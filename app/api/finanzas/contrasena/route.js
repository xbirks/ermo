import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/app/lib/finanzas/db';
import {
    COOKIE_SESION, DURACION_SESION_S, crearTokenSesion, opcionesCookie,
} from '@/app/lib/finanzas/auth';
import {
    exigirAcceso, verificarPassword, hashPassword, fallosPassword,
    revocarSesionesDe, datosPeticion, resumenAgente, avisar,
} from '@/app/lib/finanzas/acceso';

export const dynamic = 'force-dynamic';

/**
 * POST /api/finanzas/contrasena   { actual, nueva }
 *
 * Cambia la contraseña propia. Es lo único que permite una sesión con
 * contraseña temporal. Al cambiarla se cierran las demás sesiones de
 * ese usuario: si alguien la conocía, pierde el acceso en el acto.
 */
export async function POST(request) {
    const acceso = await exigirAcceso(request, 'cuenta');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        const { actual, nueva } = await request.json().catch(() => ({}));

        const [fila] = await sql`SELECT password_hash FROM usuarios WHERE id = ${acceso.usuario.id}::uuid`;
        if (!(await verificarPassword(String(actual || ''), fila.password_hash))) {
            await new Promise((r) => setTimeout(r, 700));
            return NextResponse.json({ error: 'La contraseña actual no es correcta' }, { status: 400 });
        }

        const fallos = fallosPassword(nueva);
        if (fallos.length) {
            return NextResponse.json({ error: `A la contraseña nueva le falta: ${fallos.join(', ')}.` }, { status: 400 });
        }
        if (nueva === actual) {
            return NextResponse.json({ error: 'La contraseña nueva tiene que ser distinta de la actual' }, { status: 400 });
        }

        await sql`
            UPDATE usuarios SET password_hash = ${await hashPassword(nueva)}, debe_cambiar = false
            WHERE id = ${acceso.usuario.id}::uuid
        `;
        await revocarSesionesDe(acceso.usuario.id, { excepto: acceso.sid });

        // Token nuevo sin la marca de "tiene que cambiarla".
        const token = await crearTokenSesion({
            sid: acceso.sid, uid: acceso.usuario.id, rol: acceso.usuario.rol, cambiar: false,
        });
        cookies().set(COOKIE_SESION, token, opcionesCookie(DURACION_SESION_S));

        const { ip, lugar, agente } = datosPeticion(request);
        await avisar(
            `🔑 Finanzas: ${acceso.usuario.nombre} ha cambiado su contraseña`
            + `\nDesde: ${[lugar, ip].filter(Boolean).join(' · ')} · ${resumenAgente(agente)}`
        );

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[finanzas/contrasena]', error);
        return NextResponse.json({ error: 'No se ha podido cambiar la contraseña' }, { status: 500 });
    }
}
