import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/app/lib/finanzas/db';
import {
    COOKIE_SESION, COOKIE_PASO, DURACION_SESION_S,
    crearTokenSesion, verificarTokenPaso, opcionesCookie,
} from '@/app/lib/finanzas/auth';
import {
    datosPeticion, resumenAgente, bloqueo, registrarIntento,
    comprobarCodigo, crearSesionBD, avisar,
} from '@/app/lib/finanzas/acceso';

export const dynamic = 'force-dynamic';

/**
 * POST /api/finanzas/entrar/codigo   { codigo }
 *
 * Segundo paso. Con la cookie de paso y el código del correo, abre una
 * sesión de 7 días. Cada código admite 5 intentos; después hay que
 * volver a empezar desde la contraseña.
 */
export async function POST(request) {
    const { ip, lugar, agente } = datosPeticion(request);

    try {
        const paso = await verificarTokenPaso(cookies().get(COOKIE_PASO)?.value);
        if (!paso) {
            return NextResponse.json(
                { error: 'El código ha caducado. Vuelve a escribir tu contraseña.', reiniciar: true },
                { status: 401 }
            );
        }

        const [usuario] = await sql`
            SELECT id, email, nombre, rol, debe_cambiar FROM usuarios WHERE id = ${paso.uid}::uuid AND activo
        `;
        if (!usuario) {
            cookies().delete(COOKIE_PASO);
            return NextResponse.json({ error: 'No autorizado', reiniciar: true }, { status: 401 });
        }

        if (await bloqueo({ email: usuario.email, ip })) {
            await registrarIntento({ email: usuario.email, ip, resultado: 'bloqueado' });
            return NextResponse.json(
                { error: 'Demasiados intentos. Espera 15 minutos y vuelve a probar.', reiniciar: true },
                { status: 429 }
            );
        }

        const { codigo } = await request.json().catch(() => ({}));
        const resultado = await comprobarCodigo({ cid: paso.cid, uid: usuario.id, codigo });

        if (resultado !== 'ok') {
            await registrarIntento({ email: usuario.email, ip, resultado: 'codigo_mal' });
            if (resultado === 'agotado') {
                cookies().delete(COOKIE_PASO);
                await avisar(
                    `⚠️ Finanzas: código agotado o caducado para ${usuario.nombre}`
                    + `\nDesde: ${[lugar, ip].filter(Boolean).join(' · ')} · ${resumenAgente(agente)}`
                );
                return NextResponse.json(
                    { error: 'Demasiados intentos con este código. Vuelve a empezar.', reiniciar: true },
                    { status: 401 }
                );
            }
            await new Promise((r) => setTimeout(r, 500));
            return NextResponse.json({ error: 'Código incorrecto' }, { status: 401 });
        }

        const sid = await crearSesionBD(usuario, { ip, lugar, agente });
        const token = await crearTokenSesion({
            sid, uid: usuario.id, rol: usuario.rol, cambiar: usuario.debe_cambiar,
        });
        cookies().set(COOKIE_SESION, token, opcionesCookie(DURACION_SESION_S));
        cookies().delete(COOKIE_PASO);
        await registrarIntento({ email: usuario.email, ip, resultado: 'ok' });

        await avisar(
            `🔐 Entrada en Finanzas: ${usuario.nombre}`
            + `\nDesde: ${[lugar, ip].filter(Boolean).join(' · ')} · ${resumenAgente(agente)}`
            + '\nSi no has sido tú, cierra todas las sesiones y cambia la contraseña.'
        );

        return NextResponse.json({ ok: true, cambiarPassword: usuario.debe_cambiar });
    } catch (error) {
        console.error('[finanzas/entrar/codigo]', error);
        return NextResponse.json({ error: 'No se ha podido comprobar el código.' }, { status: 500 });
    }
}
