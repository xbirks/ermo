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
 * Convierte un fallo de conexión en una pista útil.
 *
 * Nunca devuelve la cadena de conexión ni la contraseña: sólo describe
 * qué revisar. Sin esto, cualquier problema de red o credenciales se ve
 * en pantalla como un "Error al cargar los datos" indistinguible de un
 * error de programación.
 */
function diagnostico(error) {
    const msg = String(error?.message || '');
    const codigo = error?.code;

    if (/DATABASE_URL/.test(msg)) {
        return 'Falta la variable DATABASE_URL en Vercel.';
    }
    if (codigo === '28P01' || /password authentication failed/i.test(msg)) {
        return 'Contraseña de la base de datos incorrecta. Revisa DATABASE_URL: '
             + 'si la clave lleva @ / ? # o &, hay que codificarla en la URL.';
    }
    if (/\[YOUR-PASSWORD\]/i.test(msg)) {
        return 'DATABASE_URL conserva el texto [YOUR-PASSWORD] sin sustituir.';
    }
    if (codigo === 'ENOTFOUND' || /getaddrinfo/i.test(msg)) {
        return 'No se encuentra el servidor de la base de datos. Revisa el host de DATABASE_URL.';
    }
    if (codigo === 'ETIMEDOUT' || /timeout/i.test(msg)) {
        return 'La base de datos no responde. Comprueba que el proyecto de Supabase esté activo.';
    }
    if (/SSL|self.signed|certificate/i.test(msg)) {
        return 'Fallo de SSL al conectar con la base de datos.';
    }
    if (codigo === '3D000') {
        return 'La base de datos indicada en DATABASE_URL no existe.';
    }
    if (codigo === '42P01') {
        return 'Faltan las tablas. Ejecuta db/schema.sql y db/seed.sql en Supabase.';
    }
    return null;
}

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

        // Traduce los fallos típicos de conexión a algo accionable. El
        // mensaje describe la causa, nunca la cadena de conexión ni la
        // contraseña.
        const pista = diagnostico(error);
        return NextResponse.json(
            { error: pista || 'Error al cargar los datos' }, { status: 500 }
        );
    }
}
