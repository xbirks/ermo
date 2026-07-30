import { NextResponse } from 'next/server';
import {
    getResumenAnual, getAniosDisponibles, getDeudas, getNotasDelAnio,
} from '@/app/lib/finanzas/consultas';

// Lee la base de datos en cada llamada: nunca se cachea ni se
// prerenderiza en el build.
export const dynamic = 'force-dynamic';

/**
 * GET /api/finanzas/anual?anio=2026
 *
 * Los doce meses de un año, con lo que entró y salió en cada uno.
 */
export async function GET(request) {
    try {
        const pedido = Number(request.nextUrl.searchParams.get('anio'));
        const anio = Number.isInteger(pedido) && pedido > 2000 && pedido < 2100
            ? pedido
            : new Date().getFullYear();

        const [meses, anios, deudas, notas] = await Promise.all([
            getResumenAnual(anio),
            getAniosDisponibles(),
            getDeudas(),
            getNotasDelAnio(anio),
        ]);

        return NextResponse.json({ anio, meses, anios, deudas, notas }, {
            headers: { 'Cache-Control': 'no-store' },
        });
    } catch (error) {
        console.error('[finanzas/anual]', error);
        return NextResponse.json({ error: 'Error al cargar el año' }, { status: 500 });
    }
}
