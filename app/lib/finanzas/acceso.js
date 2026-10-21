import crypto from 'node:crypto';
import { promisify } from 'node:util';
import nodemailer from 'nodemailer';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sql } from './db';
import { enviarDiscord } from './discord';
import { COOKIE_SESION, verificarTokenSesion } from './auth';

// Control de acceso de la app de finanzas (runtime de Node).
//
// El middleware ya ha comprobado la firma del token antes de llegar
// aquí. Esto es la segunda capa, la que mira la base de datos: que la
// sesión no esté cerrada ni caducada, que el usuario siga activo y que
// su rol le permita lo que pide. Si un día el middleware fallara o se
// saltara, cada ruta sigue protegida por sí misma.

const scrypt = promisify(crypto.scrypt);

// --- Contraseñas --------------------------------------------------

// scrypt con N = 2^15: unos 100 ms por intento en el servidor. Para
// quien entra es imperceptible; para quien prueba millones de claves
// con una copia de la tabla, inviable.
const SCRYPT = { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export async function hashPassword(plano) {
    const sal = crypto.randomBytes(16);
    const hash = await scrypt(plano, sal, 64, SCRYPT);
    return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${sal.toString('base64')}$${hash.toString('base64')}`;
}

export async function verificarPassword(plano, guardado) {
    try {
        const [alg, N, r, p, sal, hash] = String(guardado).split('$');
        if (alg !== 'scrypt') return false;
        const esperado = Buffer.from(hash, 'base64');
        const calculado = await scrypt(String(plano), Buffer.from(sal, 'base64'), esperado.length, {
            N: Number(N), r: Number(r), p: Number(p), maxmem: SCRYPT.maxmem,
        });
        return crypto.timingSafeEqual(calculado, esperado);
    } catch {
        return false;
    }
}

// Hash de relleno: si el email no existe se verifica contra esto, para
// que la respuesta tarde lo mismo y no delate qué emails son válidos.
let hashRelleno;
export async function verificarContraRelleno(plano) {
    hashRelleno ??= await hashPassword(crypto.randomBytes(24).toString('hex'));
    await verificarPassword(plano, hashRelleno);
    return false;
}

/** Devuelve la lista de requisitos que no cumple (vacía si es válida). */
export function fallosPassword(p) {
    const fallos = [];
    if (typeof p !== 'string' || p.length < 12) fallos.push('al menos 12 caracteres');
    if (!/[A-Z]/.test(p || '')) fallos.push('una mayúscula');
    if (!/[a-z]/.test(p || '')) fallos.push('una minúscula');
    if (!/[0-9]/.test(p || '')) fallos.push('un número');
    if (!/[^A-Za-z0-9]/.test(p || '')) fallos.push('un símbolo');
    return fallos;
}

/** Contraseña aleatoria que cumple la política, sin caracteres ambiguos. */
export function generarPassword(largo = 20) {
    const grupos = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnopqrstuvwxyz', '23456789', '!@#$%&*?-_=+'];
    const todo = grupos.join('');
    const letras = grupos.map((g) => g[crypto.randomInt(g.length)]);
    while (letras.length < largo) letras.push(todo[crypto.randomInt(todo.length)]);
    for (let i = letras.length - 1; i > 0; i--) {
        const j = crypto.randomInt(i + 1);
        [letras[i], letras[j]] = [letras[j], letras[i]];
    }
    return letras.join('');
}

// --- Datos de la petición ------------------------------------------

export function datosPeticion(request) {
    const h = request.headers;
    const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || 'desconocida';
    const ciudad = h.get('x-vercel-ip-city');
    const pais = h.get('x-vercel-ip-country');
    let lugar = null;
    try {
        lugar = [ciudad && decodeURIComponent(ciudad), pais].filter(Boolean).join(', ') || null;
    } catch { /* cabecera mal codificada: sin lugar */ }
    return { ip, lugar, agente: (h.get('user-agent') || '').slice(0, 200) };
}

/** Navegador y sistema en pocas palabras, para los avisos. */
export function resumenAgente(agente = '') {
    const nav = /Edg\//.test(agente) ? 'Edge' : /Chrome\//.test(agente) ? 'Chrome'
        : /Firefox\//.test(agente) ? 'Firefox' : /Safari\//.test(agente) ? 'Safari' : 'Otro navegador';
    const so = /iPhone|iPad/.test(agente) ? 'iOS' : /Android/.test(agente) ? 'Android'
        : /Windows/.test(agente) ? 'Windows' : /Mac OS X/.test(agente) ? 'macOS'
        : /Linux/.test(agente) ? 'Linux' : 'sistema desconocido';
    return `${nav} en ${so}`;
}

// --- Fuerza bruta -------------------------------------------------

// En una ventana de 15 minutos: 5 fallos por email, 10 por IP o 30 en
// total (un ataque repartido entre muchas IP) bloquean el acceso.
export const LIMITES = { porEmail: 5, porIp: 10, global: 30 };

/**
 * Cuenta los fallos recientes. Devuelve el motivo del bloqueo o null.
 * Va en la base de datos y no en memoria: en Vercel cada petición puede
 * caer en una instancia distinta y un contador en memoria no serviría.
 */
export async function bloqueo({ email, ip }) {
    const [f] = await sql`
        SELECT
            count(*) FILTER (WHERE email = ${email ?? ''})  AS por_email,
            count(*) FILTER (WHERE ip = ${ip})              AS por_ip,
            count(*)                                         AS global
        FROM intentos_acceso
        WHERE resultado IN ('password_mal', 'codigo_mal')
          AND creado_en > now() - interval '15 minutes'
    `;
    if (Number(f.global) >= LIMITES.global) return 'global';
    if (Number(f.por_ip) >= LIMITES.porIp) return 'ip';
    if (email && Number(f.por_email) >= LIMITES.porEmail) return 'email';
    return null;
}

export async function registrarIntento({ email, ip, resultado }) {
    await sql`INSERT INTO intentos_acceso (email, ip, resultado) VALUES (${email ?? null}, ${ip}, ${resultado})`;
}

export async function fallosRecientes({ email, ip }) {
    const [f] = await sql`
        SELECT count(*) AS n FROM intentos_acceso
        WHERE resultado IN ('password_mal', 'codigo_mal')
          AND (email = ${email ?? ''} OR ip = ${ip})
          AND creado_en > now() - interval '15 minutes'
    `;
    return Number(f.n);
}

// --- Código por correo --------------------------------------------

function hmacCodigo(id, codigo) {
    return crypto.createHmac('sha256', process.env.FINANZAS_JWT_SECRET).update(`${id}:${codigo}`).digest('hex');
}

export async function crearCodigo(usuario, ip) {
    // Un código nuevo invalida los anteriores sin usar.
    await sql`
        UPDATE codigos_acceso SET expira_en = now()
        WHERE usuario_id = ${usuario.id}::uuid AND usado_en IS NULL AND expira_en > now()
    `;
    const id = crypto.randomUUID();
    const codigo = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
    await sql`
        INSERT INTO codigos_acceso (id, usuario_id, codigo_hash, expira_en, ip)
        VALUES (${id}::uuid, ${usuario.id}::uuid, ${hmacCodigo(id, codigo)}, now() + interval '10 minutes', ${ip})
    `;
    return { id, codigo };
}

const MAX_INTENTOS_CODIGO = 5;

/** Comprueba el código. Devuelve 'ok', 'mal' o 'agotado'. */
export async function comprobarCodigo({ cid, uid, codigo }) {
    const [fila] = await sql`
        SELECT id, codigo_hash, intentos FROM codigos_acceso
        WHERE id = ${cid}::uuid AND usuario_id = ${uid}::uuid
          AND usado_en IS NULL AND expira_en > now()
    `;
    if (!fila || fila.intentos >= MAX_INTENTOS_CODIGO) return 'agotado';

    const esperado = Buffer.from(fila.codigo_hash, 'hex');
    const calculado = Buffer.from(hmacCodigo(fila.id, String(codigo || '').trim()), 'hex');
    if (!crypto.timingSafeEqual(esperado, calculado)) {
        const [{ intentos }] = await sql`
            UPDATE codigos_acceso SET intentos = intentos + 1 WHERE id = ${fila.id}::uuid RETURNING intentos
        `;
        return intentos >= MAX_INTENTOS_CODIGO ? 'agotado' : 'mal';
    }
    await sql`UPDATE codigos_acceso SET usado_en = now() WHERE id = ${fila.id}::uuid`;
    return 'ok';
}

export async function enviarCodigo({ email, nombre, codigo, lugar, agente }) {
    const transporte = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const desde = [lugar, resumenAgente(agente)].filter(Boolean).join(' · ');
    // El código va sólo en el cuerpo, no en el asunto: el asunto se ve en
    // la pantalla bloqueada del móvil.
    await transporte.sendMail({
        from: `ERMO Finanzas <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Tu código para entrar en Finanzas',
        text: [
            `Hola, ${nombre}.`,
            '',
            `Tu código es: ${codigo}`,
            '',
            'Caduca en 10 minutos y sólo sirve una vez.',
            desde ? `Petición desde: ${desde}.` : '',
            '',
            'Si no has sido tú, alguien conoce tu contraseña: cámbiala en cuanto entres.',
        ].join('\n'),
        html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0a0a0b;max-width:420px">
                <p style="font-size:15px;margin:0 0 20px">Hola, ${nombre}.</p>
                <p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b6b73;margin:0 0 6px">Tu código</p>
                <p style="font-size:34px;font-weight:600;letter-spacing:.18em;margin:0 0 20px">${codigo}</p>
                <p style="font-size:13px;color:#46464d;margin:0 0 6px">Caduca en 10 minutos y sólo sirve una vez.</p>
                ${desde ? `<p style="font-size:13px;color:#46464d;margin:0 0 20px">Petición desde: ${desde}.</p>` : ''}
                <p style="font-size:13px;color:#46464d;margin:0">Si no has sido tú, alguien conoce tu contraseña: cámbiala en cuanto entres.</p>
            </div>`,
    });
}

// --- Sesiones -----------------------------------------------------

export async function crearSesionBD(usuario, { ip, lugar, agente }) {
    const [fila] = await sql`
        INSERT INTO sesiones (usuario_id, expira_en, ip, lugar, agente)
        VALUES (${usuario.id}::uuid, now() + interval '7 days', ${ip}, ${lugar}, ${agente})
        RETURNING id
    `;
    return fila.id;
}

export async function revocarSesion(sid) {
    await sql`UPDATE sesiones SET revocada_en = now() WHERE id = ${sid}::uuid AND revocada_en IS NULL`;
}

export async function revocarSesionesDe(uid, { excepto } = {}) {
    await sql`
        UPDATE sesiones SET revocada_en = now()
        WHERE usuario_id = ${uid}::uuid AND revocada_en IS NULL
          AND (${excepto ?? null}::uuid IS NULL OR id <> ${excepto ?? null}::uuid)
    `;
}

// --- Permisos -----------------------------------------------------
//
// leer      ver datos
// apuntar   crear un movimiento nuevo
// anotar    cambiar la nota o la categoría de un movimiento
// cuenta    cambiar la propia contraseña o cerrar las propias sesiones
// escribir  todo lo demás: editar a fondo, borrar, IVA, reservas, fijos…

const PERMISOS = {
    propietario: new Set(['leer', 'apuntar', 'anotar', 'cuenta', 'escribir']),
    asistente: new Set(['leer', 'apuntar', 'anotar', 'cuenta']),
};

const prohibido = (error, extra = {}) => ({
    respuesta: NextResponse.json({ error, ...extra }, { status: 403 }),
});

/**
 * Comprueba la sesión y el permiso. Uso en cada ruta:
 *
 *   const acceso = await exigirAcceso(request, 'leer');
 *   if (acceso.respuesta) return acceso.respuesta;
 *   acceso.usuario  →  { id, email, nombre, rol }
 */
export async function exigirAcceso(request, accion) {
    const token = cookies().get(COOKIE_SESION)?.value;
    const payload = await verificarTokenSesion(token);
    if (!payload) {
        return { respuesta: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) };
    }

    const [fila] = await sql`
        SELECT s.id AS sid, s.ultimo_uso, u.id, u.email, u.nombre, u.rol, u.debe_cambiar
        FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id
        WHERE s.id = ${payload.sid}::uuid
          AND s.revocada_en IS NULL AND s.expira_en > now()
          AND u.activo
    `;
    if (!fila) {
        return { respuesta: NextResponse.json({ error: 'Sesión cerrada o caducada' }, { status: 401 }) };
    }

    const usuario = { id: fila.id, email: fila.email, nombre: fila.nombre, rol: fila.rol };

    if (fila.debe_cambiar && accion !== 'cuenta') {
        return prohibido('Tienes que cambiar la contraseña antes de seguir.', { cambiarPassword: true });
    }
    if (!PERMISOS[fila.rol]?.has(accion)) {
        return prohibido(`Tu cuenta (${fila.nombre}) no tiene permiso para esto.`);
    }

    // Último uso, como mucho una escritura cada 5 minutos.
    if (Date.now() - new Date(fila.ultimo_uso).getTime() > 5 * 60 * 1000) {
        await sql`UPDATE sesiones SET ultimo_uso = now() WHERE id = ${fila.sid}::uuid`;
    }

    // Toda escritura queda registrada con su autor. Si el registro
    // falla, la escritura no se hace.
    if (accion !== 'leer') {
        let cuerpo = null;
        try {
            const texto = await request.clone().text();
            if (texto) cuerpo = JSON.parse(texto.slice(0, 20000));
        } catch { /* cuerpo vacío o no JSON */ }
        if (cuerpo && typeof cuerpo === 'object') {
            for (const k of ['password', 'actual', 'nueva', 'codigo']) if (k in cuerpo) cuerpo[k] = '***';
        }
        const url = new URL(request.url);
        await sql`
            INSERT INTO auditoria (usuario_id, metodo, ruta, cuerpo, ip)
            VALUES (${usuario.id}::uuid, ${request.method}, ${url.pathname + url.search},
                    ${cuerpo ? JSON.stringify(cuerpo) : null}::jsonb, ${datosPeticion(request).ip})
        `;
    }

    return { usuario, sid: fila.sid };
}

// --- Avisos -------------------------------------------------------

/** Aviso a Discord que nunca rompe la petición si falla. */
export async function avisar(texto) {
    try { await enviarDiscord(texto); } catch (e) { console.error('[finanzas/acceso] aviso', e); }
}
