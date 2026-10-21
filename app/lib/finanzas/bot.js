import { sql } from './db';

// Utilidades de la API del asistente (/api/finanzas/bot/*).
//
// Todo pensado para gastar pocos tokens: texto plano, una línea por
// dato, importes con signo, ids recortados a 8 caracteres (se aceptan
// así de vuelta) y nada de campos que no sirvan para decidir.

/** 1.234,56 con signo opcional. */
export function eur(n, conSigno = false) {
    const v = Number(n) || 0;
    const s = Math.abs(v).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (!conSigno) return v < 0 ? `-${s}` : s;
    return `${v < 0 ? '-' : '+'}${s}`;
}

export const idCorto = (id) => String(id).slice(0, 8);

/**
 * Busca un movimiento por id completo o por sus primeros caracteres
 * (mínimo 6). Devuelve { fila } o { error }.
 */
export async function buscarMovimiento(id) {
    const limpio = String(id || '').trim().toLowerCase();
    if (!/^[0-9a-f-]{6,36}$/.test(limpio)) return { error: 'id no válido' };
    const filas = await sql`
        SELECT t.id, t.origen, t.notas, t.categoria_id, t.concepto, c.nombre AS cuenta
        FROM transacciones t JOIN cuentas c ON c.id = t.cuenta_id
        WHERE t.id::text LIKE ${limpio + '%'}
        LIMIT 2
    `;
    if (!filas.length) return { error: `no existe ningún movimiento ${limpio}` };
    if (filas.length > 1) return { error: `el id ${limpio} es ambiguo; usa más caracteres` };
    return { fila: filas[0] };
}

/** Categoría por nombre, sin distinguir mayúsculas ni tildes. */
export async function buscarCategoria(nombre) {
    const normal = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    const categorias = await sql`SELECT id, nombre FROM categorias WHERE activa`;
    return categorias.find((c) => normal(c.nombre) === normal(nombre)) || null;
}
