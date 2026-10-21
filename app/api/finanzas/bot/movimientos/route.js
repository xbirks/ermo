import { exigirClave, texto } from '@/app/lib/finanzas/acceso';
import { sql } from '@/app/lib/finanzas/db';
import { eur, idCorto } from '@/app/lib/finanzas/bot';

export const dynamic = 'force-dynamic';

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

/**
 * GET /api/finanzas/bot/movimientos
 *   ?desde=AAAA-MM-DD   (por defecto, día 1 del mes)
 *   &hasta=AAAA-MM-DD
 *   &cuenta=Imagin
 *   &pendientes=1        sólo sin categoría o con nota REVISAR / SIN IDENTIFICAR
 *   &buscar=bizum        texto en el concepto o la nota
 *   &limite=100          máximo 300
 *
 * Una línea por movimiento:
 *   id | fecha | cuenta | importe con signo | concepto | categoría | nota
 */
export async function GET(request) {
    const acceso = await exigirClave(request, 'leer');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        const p = request.nextUrl.searchParams;
        const desde = FECHA.test(p.get('desde') || '') ? p.get('desde') : null;
        const hasta = FECHA.test(p.get('hasta') || '') ? p.get('hasta') : null;
        const cuenta = (p.get('cuenta') || '').slice(0, 40) || null;
        const pendientes = p.get('pendientes') === '1';
        const buscar = (p.get('buscar') || '').slice(0, 60) || null;
        const patron = `%${buscar || ''}%`;
        const limite = Math.min(Math.max(Number(p.get('limite')) || 100, 1), 300);

        const filas = await sql`
            SELECT t.id, t.fecha, t.importe, t.tipo_movimiento, t.concepto, t.notas,
                   c.nombre AS cuenta, cd.nombre AS destino, cat.nombre AS categoria
            FROM transacciones t
            JOIN cuentas c ON c.id = t.cuenta_id
            LEFT JOIN cuentas cd ON cd.id = t.cuenta_destino_id
            LEFT JOIN categorias cat ON cat.id = t.categoria_id
            WHERE t.fecha >= COALESCE(${desde}::date, date_trunc('month', CURRENT_DATE)::date)
              AND (${hasta}::date IS NULL OR t.fecha <= ${hasta}::date)
              AND (${cuenta}::text IS NULL OR c.nombre ILIKE ${cuenta} OR cd.nombre ILIKE ${cuenta})
              AND (NOT ${pendientes}::boolean
                   OR (t.categoria_id IS NULL AND t.tipo_movimiento <> 'transferencia_interna')
                   OR t.notas ~* '(REVISAR|SIN IDENTIFICAR)')
              AND (${buscar}::text IS NULL OR t.concepto ILIKE ${patron} OR t.notas ILIKE ${patron})
            ORDER BY t.fecha DESC, t.creada_en DESC
            LIMIT ${limite}
        `;

        if (!filas.length) return texto('Sin movimientos con esos filtros.');
        const lineas = filas.map((f) => {
            const signo = f.tipo_movimiento === 'ingreso' ? 1 : -1;
            const importe = f.tipo_movimiento === 'transferencia_interna'
                ? `${eur(f.importe)} → ${f.destino}`
                : eur(signo * Number(f.importe), true);
            const nota = (f.notas || '').replace(/\s+/g, ' ').replace(/Importado del (banco|extracto del banco)\.?/g, '').trim();
            return [idCorto(f.id), String(f.fecha).slice(0, 10), f.cuenta, importe, f.concepto, f.categoria || '—', nota]
                .join(' | ').replace(/ \| $/, '');
        });
        return texto(`id | fecha | cuenta | importe | concepto | categoría | nota\n${lineas.join('\n')}`);
    } catch (error) {
        console.error('[bot/movimientos]', error);
        return texto('ERROR: no se han podido leer los movimientos', 500);
    }
}
