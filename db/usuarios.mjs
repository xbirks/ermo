// Gestión de cuentas de /interno/finanzas, sólo desde la terminal.
//
// No hay pantalla para dar de alta usuarios ni para recuperar la
// contraseña por correo: cada una sería otra puerta de entrada. Esto se
// ejecuta en local con la DATABASE_URL de .env.local.
//
//   node db/usuarios.mjs alta <email> <nombre> <propietario|asistente> [--archivo ruta]
//   node db/usuarios.mjs restablecer <email> [--archivo ruta]
//   node db/usuarios.mjs baja <email>
//   node db/usuarios.mjs clave <email> [--archivo ruta]     clave de API para /api/finanzas/bot/*
//   node db/usuarios.mjs revocar-clave <email>
//   node db/usuarios.mjs lista
//
// `alta` y `restablecer` generan una contraseña temporal aleatoria (el
// propietario tendrá que cambiarla al entrar). Con --archivo se escribe
// en ese archivo en lugar de en pantalla.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import pg from 'pg';

const scrypt = promisify(crypto.scrypt);
// Mismos parámetros que app/lib/finanzas/acceso.js.
const SCRYPT = { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

async function hashPassword(plano) {
    const sal = crypto.randomBytes(16);
    const hash = await scrypt(plano, sal, 64, SCRYPT);
    return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${sal.toString('base64')}$${hash.toString('base64')}`;
}

function generarPassword(largo = 20) {
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

function conectar() {
    const env = fs.readFileSync(path.resolve('.env.local'), 'utf8');
    const url = env.match(/^DATABASE_URL=(.*)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');
    if (!url) throw new Error('Falta DATABASE_URL en .env.local');
    const local = /localhost|127\.0\.0\.1/.test(url);
    return new pg.Client({ connectionString: url, ssl: local ? false : { rejectUnauthorized: false } });
}

function entregar(lineas, archivo) {
    const texto = lineas.join('\n') + '\n';
    if (!archivo) { process.stdout.write(texto); return; }
    fs.mkdirSync(path.dirname(archivo), { recursive: true });
    fs.appendFileSync(archivo, texto, { mode: 0o600 });
    console.log(`Guardado en ${archivo}`);
}

const [orden, ...resto] = process.argv.slice(2);
const iArchivo = resto.indexOf('--archivo');
const archivo = iArchivo >= 0 ? resto.splice(iArchivo, 2)[1] : null;

const c = conectar();
await c.connect();
try {
    if (orden === 'alta') {
        const [emailCrudo, nombre, rol] = resto;
        const email = String(emailCrudo || '').trim().toLowerCase();
        if (!email.includes('@') || !nombre || !['propietario', 'asistente'].includes(rol)) {
            throw new Error('Uso: alta <email> <nombre> <propietario|asistente>');
        }
        const clave = generarPassword(rol === 'asistente' ? 24 : 16);
        // El asistente es un bot: su contraseña ya es aleatoria y larga,
        // no tiene sentido obligarle a cambiarla.
        const debeCambiar = rol === 'propietario';
        await c.query(
            `INSERT INTO usuarios (email, nombre, rol, password_hash, debe_cambiar) VALUES ($1, $2, $3, $4, $5)`,
            [email, nombre, rol, await hashPassword(clave), debeCambiar]
        );
        entregar([
            `${nombre} · ${email} · ${rol}`,
            `Contraseña${debeCambiar ? ' temporal (se cambia al entrar)' : ''}: ${clave}`,
            '',
        ], archivo);
    } else if (orden === 'restablecer') {
        const email = String(resto[0] || '').trim().toLowerCase();
        const clave = generarPassword(16);
        const r = await c.query(
            `UPDATE usuarios SET password_hash = $2, debe_cambiar = true WHERE email = $1 RETURNING id, nombre`,
            [email, await hashPassword(clave)]
        );
        if (!r.rowCount) throw new Error(`No existe ${email}`);
        await c.query(`UPDATE sesiones SET revocada_en = now() WHERE usuario_id = $1 AND revocada_en IS NULL`, [r.rows[0].id]);
        entregar([`${r.rows[0].nombre} · ${email}`, `Contraseña temporal (se cambia al entrar): ${clave}`, ''], archivo);
    } else if (orden === 'baja') {
        const email = String(resto[0] || '').trim().toLowerCase();
        const r = await c.query(`UPDATE usuarios SET activo = false WHERE email = $1 RETURNING id`, [email]);
        if (!r.rowCount) throw new Error(`No existe ${email}`);
        await c.query(`UPDATE sesiones SET revocada_en = now() WHERE usuario_id = $1 AND revocada_en IS NULL`, [r.rows[0].id]);
        console.log(`${email} dado de baja y sus sesiones cerradas.`);
    } else if (orden === 'clave') {
        // Clave de API para /api/finanzas/bot/*. Hereda el rol del usuario.
        const email = String(resto[0] || '').trim().toLowerCase();
        const [u] = (await c.query(`SELECT id, nombre, rol FROM usuarios WHERE email = $1 AND activo`, [email])).rows;
        if (!u) throw new Error(`No existe ${email}`);
        const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const clave = 'efz_' + Array.from({ length: 40 }, () => abc[crypto.randomInt(abc.length)]).join('');
        const hash = crypto.createHash('sha256').update(clave).digest('hex');
        await c.query(
            `INSERT INTO claves_api (usuario_id, nombre, hash, prefijo) VALUES ($1, $2, $3, $4)`,
            [u.id, `Clave de ${u.nombre}`, hash, clave.slice(0, 10)]
        );
        entregar([`${u.nombre} · ${email} · ${u.rol}`, `Clave de API (Authorization: Bearer …): ${clave}`, ''], archivo);
    } else if (orden === 'revocar-clave') {
        const email = String(resto[0] || '').trim().toLowerCase();
        const r = await c.query(`
            UPDATE claves_api SET revocada_en = now()
            WHERE revocada_en IS NULL AND usuario_id = (SELECT id FROM usuarios WHERE email = $1)`, [email]);
        console.log(`${r.rowCount} clave(s) de ${email} revocada(s).`);
    } else if (orden === 'lista') {
        const r = await c.query(`
            SELECT u.email, u.nombre, u.rol, u.activo, u.debe_cambiar,
                   (SELECT count(*) FROM sesiones s WHERE s.usuario_id = u.id AND s.revocada_en IS NULL AND s.expira_en > now()) AS sesiones
            FROM usuarios u ORDER BY u.creado_en`);
        console.table(r.rows);
    } else {
        console.log('Órdenes: alta · restablecer · baja · clave · revocar-clave · lista');
    }
} catch (e) {
    console.error('Error:', e.message);
    process.exitCode = 1;
} finally {
    await c.end();
}
