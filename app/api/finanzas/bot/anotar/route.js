import { exigirClave, texto } from '@/app/lib/finanzas/acceso';
import { sql } from '@/app/lib/finanzas/db';
import { buscarMovimiento, buscarCategoria, idCorto } from '@/app/lib/finanzas/bot';

export const dynamic = 'force-dynamic';

/**
 * POST /api/finanzas/bot/anotar
 *   { "id": "3f2a9c1b", "categoria": "Gastos varios",
 *     "nota": "...", "anadir_nota": "...", "quitar_revisar": true }
 *
 * Cambia sólo la nota y/o la categoría. "nota" sustituye la nota entera;
 * "anadir_nota" la añade al final; "quitar_revisar" borra la marca
 * REVISAR una vez explicado el movimiento. Importes, fechas, cuentas y
 * conceptos no se pueden tocar por aquí.
 */
export async function POST(request) {
    const acceso = await exigirClave(request, 'anotar');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        const d = await request.json().catch(() => ({}));
        const { fila, error } = await buscarMovimiento(d.id);
        if (error) return texto(`ERROR: ${error}`, 404);

        let categoriaId = fila.categoria_id;
        if (d.categoria !== undefined && d.categoria !== null) {
            const cat = await buscarCategoria(d.categoria);
            if (!cat) return texto(`ERROR: no existe la categoría "${d.categoria}". Mira GET /api/finanzas/bot/categorias`, 400);
            categoriaId = cat.id;
        }

        let notas = fila.notas || '';
        if (typeof d.nota === 'string') notas = d.nota.trim();
        if (typeof d.anadir_nota === 'string' && d.anadir_nota.trim()) {
            notas = [notas, d.anadir_nota.trim()].filter(Boolean).join(' ');
        }
        if (d.quitar_revisar) notas = notas.replace(/REVISAR:?[^.]*\.?\s*/i, '').trim();

        await sql`
            UPDATE transacciones
            SET notas = ${notas.slice(0, 1000) || null}, categoria_id = ${categoriaId}::uuid,
                modificada_por = ${acceso.usuario.id}::uuid
            WHERE id = ${fila.id}::uuid
        `;
        return texto(`OK ${idCorto(fila.id)} · ${fila.concepto}`);
    } catch (error) {
        console.error('[bot/anotar]', error);
        return texto('ERROR: no se ha podido anotar', 500);
    }
}
