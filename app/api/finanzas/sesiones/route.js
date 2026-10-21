import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_SESION } from '@/app/lib/finanzas/auth';
import {
    exigirAcceso, revocarSesionesDe, datosPeticion, resumenAgente, avisar,
} from '@/app/lib/finanzas/acceso';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/finanzas/sesiones
 *
 * Cierra todas las sesiones del usuario, incluida la actual. Es el
 * botón de pánico: si un móvil se pierde o algo no cuadra, todos los
 * dispositivos tendrán que volver a entrar con contraseña y código.
 */
export async function DELETE(request) {
    const acceso = await exigirAcceso(request, 'cuenta');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        await revocarSesionesDe(acceso.usuario.id);
        cookies().delete(COOKIE_SESION);

        const { ip, lugar, agente } = datosPeticion(request);
        await avisar(
            `🚪 Finanzas: ${acceso.usuario.nombre} ha cerrado todas sus sesiones`
            + `\nDesde: ${[lugar, ip].filter(Boolean).join(' · ')} · ${resumenAgente(agente)}`
        );
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[finanzas/sesiones]', error);
        return NextResponse.json({ error: 'No se han podido cerrar las sesiones' }, { status: 500 });
    }
}
