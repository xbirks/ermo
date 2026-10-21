import { exigirClave, texto } from '@/app/lib/finanzas/acceso';
import { sql } from '@/app/lib/finanzas/db';
import { crearTransaccion } from '@/app/lib/finanzas/consultas';
import { buscarCategoria, idCorto } from '@/app/lib/finanzas/bot';

export const dynamic = 'force-dynamic';

/**
 * POST /api/finanzas/bot/apuntar
 *   { "fecha": "2026-10-21", "cuenta": "Cartera Efectivo", "tipo": "gasto",
 *     "importe": 12.5, "concepto": "Café", "categoria": "Comida y supervivencia", "nota": "..." }
 *
 * Sólo en cuentas que NO se leen del banco (efectivo, ahorro…): en las
 * conectadas el movimiento ya llega solo y apuntarlo lo duplicaría.
 */
export async function POST(request) {
    const acceso = await exigirClave(request, 'apuntar');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        const d = await request.json().catch(() => ({}));
        if (!/^\d{4}-\d{2}-\d{2}$/.test(d.fecha || '')) return texto('ERROR: fecha AAAA-MM-DD', 400);
        if (!['gasto', 'ingreso'].includes(d.tipo)) return texto('ERROR: tipo gasto o ingreso', 400);
        const importe = Number(d.importe);
        if (!Number.isFinite(importe) || importe <= 0) return texto('ERROR: importe mayor que 0', 400);
        if (!String(d.concepto || '').trim()) return texto('ERROR: falta el concepto', 400);

        const [cuenta] = await sql`
            SELECT c.id, c.nombre, EXISTS (
                SELECT 1 FROM conexiones_banco b WHERE b.cuenta_id = c.id AND b.activa AND b.valida_hasta > now()
            ) AS conectada
            FROM cuentas c WHERE c.nombre ILIKE ${String(d.cuenta || '')}
        `;
        if (!cuenta) return texto(`ERROR: no existe la cuenta "${d.cuenta}"`, 400);
        if (cuenta.conectada) {
            return texto(`ERROR: ${cuenta.nombre} se lee del banco; sus movimientos llegan solos. Para explicar uno, usa /anotar.`, 409);
        }

        let categoriaId = null;
        if (d.categoria) {
            const cat = await buscarCategoria(d.categoria);
            if (!cat) return texto(`ERROR: no existe la categoría "${d.categoria}"`, 400);
            categoriaId = cat.id;
        }

        const fila = await crearTransaccion({
            fecha: d.fecha, cuenta_id: cuenta.id, categoria_id: categoriaId,
            concepto: String(d.concepto).trim().slice(0, 300), importe, tipo_movimiento: d.tipo,
            notas: d.nota ? String(d.nota).slice(0, 1000) : null, creada_por: acceso.usuario.id,
        });
        return texto(`OK ${idCorto(fila.id)} · ${cuenta.nombre} · ${d.tipo} ${importe.toFixed(2)}`);
    } catch (error) {
        console.error('[bot/apuntar]', error);
        return texto('ERROR: no se ha podido apuntar', 500);
    }
}
