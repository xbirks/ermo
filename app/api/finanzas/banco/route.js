import { NextResponse } from 'next/server';
import { exigirAcceso } from '@/app/lib/finanzas/acceso';
import { estadoConexiones } from '@/app/lib/finanzas/banco';

export const dynamic = 'force-dynamic';

/** GET /api/finanzas/banco · estado de la conexión de cada banco. */
export async function GET(request) {
    const acceso = await exigirAcceso(request, 'leer');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        return NextResponse.json({ bancos: await estadoConexiones(), rol: acceso.usuario.rol });
    } catch (error) {
        console.error('[finanzas/banco GET]', error);
        return NextResponse.json({ error: 'No se ha podido leer el estado de los bancos' }, { status: 500 });
    }
}
