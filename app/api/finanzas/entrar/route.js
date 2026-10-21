import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/app/lib/finanzas/db';
import {
    COOKIE_SESION, COOKIE_PASO, DURACION_PASO_S,
    crearTokenPaso, verificarTokenSesion, opcionesCookie,
} from '@/app/lib/finanzas/auth';
import {
    verificarPassword, verificarContraRelleno, datosPeticion, resumenAgente,
    bloqueo, registrarIntento, fallosRecientes, crearCodigo, enviarCodigo,
    revocarSesion, avisar, LIMITES,
} from '@/app/lib/finanzas/acceso';

export const dynamic = 'force-dynamic';

const ESPERA_FALLO_MS = 700;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * POST /api/finanzas/entrar   { email, password }
 *
 * Primer paso. Si el email está dado de alta y la contraseña es buena,
 * manda un código de 6 dígitos a ese email y deja una cookie de "paso"
 * de 10 minutos. Sin ese código no hay sesión.
 *
 * La respuesta a un email que no existe es idéntica, en contenido y en
 * tiempo, a la de una contraseña mal: no se puede averiguar qué emails
 * tienen cuenta.
 */
export async function POST(request) {
    const { ip, lugar, agente } = datosPeticion(request);
    let email = '';

    try {
        const datos = await request.json().catch(() => ({}));
        email = String(datos.email || '').trim().toLowerCase().slice(0, 200);
        const password = String(datos.password || '').slice(0, 200);

        const motivo = await bloqueo({ email, ip });
        if (motivo) {
            await registrarIntento({ email, ip, resultado: 'bloqueado' });
            return NextResponse.json(
                { error: 'Demasiados intentos. Espera 15 minutos y vuelve a probar.' },
                { status: 429 }
            );
        }

        const [usuario] = email
            ? await sql`SELECT id, email, nombre, password_hash FROM usuarios WHERE email = ${email} AND activo`
            : [];

        const bien = usuario
            ? await verificarPassword(password, usuario.password_hash)
            : await verificarContraRelleno(password);

        if (!bien) {
            await registrarIntento({ email, ip, resultado: 'password_mal' });
            const fallos = await fallosRecientes({ email, ip });
            if (fallos === 3 || fallos === LIMITES.porEmail) {
                await avisar(
                    `⚠️ Finanzas: ${fallos} contraseñas fallidas en 15 min`
                    + `\nEmail: ${email || '(vacío)'}${usuario ? '' : ' (no existe)'}`
                    + `\nDesde: ${[lugar, ip].filter(Boolean).join(' · ')} · ${resumenAgente(agente)}`
                    + (fallos >= LIMITES.porEmail ? '\nAcceso bloqueado 15 minutos.' : '')
                );
            }
            await espera(ESPERA_FALLO_MS);
            return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 });
        }

        const { id: cid, codigo } = await crearCodigo(usuario, ip);
        await enviarCodigo({ email: usuario.email, nombre: usuario.nombre, codigo, lugar, agente });
        await registrarIntento({ email, ip, resultado: 'codigo_enviado' });

        const paso = await crearTokenPaso({ cid, uid: usuario.id });
        cookies().set(COOKIE_PASO, paso, opcionesCookie(DURACION_PASO_S));

        return NextResponse.json({ paso: 'codigo' });
    } catch (error) {
        console.error('[finanzas/entrar]', error);
        return NextResponse.json({ error: 'No se ha podido iniciar sesión. Inténtalo de nuevo.' }, { status: 500 });
    }
}

/** DELETE /api/finanzas/entrar · cierra la sesión actual. */
export async function DELETE() {
    try {
        const payload = await verificarTokenSesion(cookies().get(COOKIE_SESION)?.value);
        if (payload?.sid) await revocarSesion(payload.sid);
    } catch (error) {
        console.error('[finanzas/entrar DELETE]', error);
    }
    cookies().delete(COOKIE_SESION);
    cookies().delete(COOKIE_PASO);
    return NextResponse.json({ ok: true });
}
