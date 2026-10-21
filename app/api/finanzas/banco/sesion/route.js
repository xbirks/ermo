import { NextResponse } from 'next/server';
import { exigirAcceso, datosPeticion, avisar } from '@/app/lib/finanzas/acceso';
import { completarConexion, sincronizar } from '@/app/lib/finanzas/banco';

export const dynamic = 'force-dynamic';
// Leer dos bancos puede tardar unos segundos más que el límite por defecto.
export const maxDuration = 60;

/**
 * POST /api/finanzas/banco/sesion   { code, state }
 *
 * Vuelta del banco: abre la sesión de lectura, la guarda y hace la
 * primera lectura en el momento.
 */
export async function POST(request) {
    const acceso = await exigirAcceso(request, 'escribir');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        const { code, state } = await request.json().catch(() => ({}));
        if (!code || !state) {
            return NextResponse.json({ error: 'Falta el código del banco' }, { status: 400 });
        }
        const { conexion, cuenta, otrasCuentas } = await completarConexion({
            code: String(code), state: String(state), usuarioId: acceso.usuario.id,
        });

        const { ip, agente } = datosPeticion(request);
        const lectura = await sincronizar(conexion, { psu: { ip, agente } }).catch((e) => ({ error: e.message }));

        await avisar(
            `🏦 Finanzas: ${cuenta} conectado (solo lectura) hasta el `
            + `${new Date(conexion.valida_hasta).toLocaleDateString('es-ES')}.`
            + (lectura.error ? `\nLa primera lectura ha fallado: ${lectura.error}`
                : `\nPrimera lectura: ${lectura.nuevas} movimientos nuevos, ${lectura.enlazadas} ya apuntados.`)
        );

        return NextResponse.json({ ok: true, cuenta, otrasCuentas, lectura });
    } catch (error) {
        console.error('[finanzas/banco/sesion]', error);
        return NextResponse.json({ error: error.message || 'No se ha podido completar la conexión' }, { status: 500 });
    }
}
