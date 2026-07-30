import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/finanzas/db';
import {
    getCuentas, getCategorias, getResumenMes,
    getTransaccionesDelMes, getReservas,
    getProvisionesIva, getIvaPorTrimestre,
} from '@/app/lib/finanzas/consultas';

// Lee la base de datos en cada llamada: nunca se cachea ni se
// prerenderiza en el build.
export const dynamic = 'force-dynamic';

const num = (v) => (v === null || v === undefined ? 0 : Number(v));

/**
 * GET /api/finanzas/panel?mes=YYYY-MM-DD
 *
 * Todo lo que la pantalla necesita en una sola llamada. Con un usuario
 * y estos volúmenes, una consulta agrupada es más rápida que seis
 * peticiones sueltas desde el navegador.
 */
export async function GET(request) {
    try {
        const mes = request.nextUrl.searchParams.get('mes') || new Date().toISOString();

        const [
            cuentas, categorias, resumen, movimientos,
            reservas, provisiones, trimestres, historico, meses,
        ] = await Promise.all([
            getCuentas(),
            getCategorias(),
            getResumenMes(mes),
            getTransaccionesDelMes(mes),
            getReservas(),
            getProvisionesIva(),
            getIvaPorTrimestre(),
            // Últimos 12 meses, para las barras de comparación.
            sql`SELECT mes, ingresos_totales, gastos_fijos, gastos_variables,
                       iva_provisionado, total_limpio, a_ahorro_inversion
                FROM v_resumen_mensual
                ORDER BY mes DESC
                LIMIT 12`,
            sql`SELECT DISTINCT date_trunc('month', fecha)::date AS mes
                FROM transacciones ORDER BY mes DESC`,
        ]);

        return NextResponse.json({
            cuentas,
            categorias,
            resumen,
            movimientos,
            reservas,
            provisiones,
            trimestres,
            historico: historico.map((h) => ({
                mes: h.mes,
                ingresos_totales: num(h.ingresos_totales),
                gastos_fijos: num(h.gastos_fijos),
                gastos_variables: num(h.gastos_variables),
                iva_provisionado: num(h.iva_provisionado),
                total_limpio: num(h.total_limpio),
                a_ahorro_inversion: num(h.a_ahorro_inversion),
            })),
            meses: meses.map((m) => m.mes),
        }, {
            headers: { 'Cache-Control': 'no-store' },
        });
    } catch (error) {
        console.error('[finanzas/panel]', error);
        return NextResponse.json(
            { error: 'Error al cargar los datos' }, { status: 500 }
        );
    }
}
