import { NextResponse } from 'next/server';
import { exigirAcceso, datosPeticion } from '@/app/lib/finanzas/acceso';
import { sincronizarTodas } from '@/app/lib/finanzas/banco';

export const dynamic = 'force-dynamic';
// Leer dos bancos puede tardar unos segundos más que el límite por defecto.
export const maxDuration = 60;

/**
 * POST /api/finanzas/banco/actualizar
 *
 * Lectura en el momento, con la persona delante: se mandan su IP y su
 * navegador al banco, y así no cuenta para el límite de 4 lecturas
 * automáticas al día.
 */
export async function POST(request) {
    const acceso = await exigirAcceso(request, 'escribir');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        const { ip, agente } = datosPeticion(request);
        return NextResponse.json({ resultados: await sincronizarTodas({ psu: { ip, agente } }) });
    } catch (error) {
        console.error('[finanzas/banco/actualizar]', error);
        return NextResponse.json({ error: 'No se ha podido leer los bancos' }, { status: 500 });
    }
}
