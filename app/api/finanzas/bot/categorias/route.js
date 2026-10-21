import { exigirClave, texto } from '@/app/lib/finanzas/acceso';
import { sql } from '@/app/lib/finanzas/db';

export const dynamic = 'force-dynamic';

/** GET /api/finanzas/bot/categorias · los nombres válidos, en una línea. */
export async function GET(request) {
    const acceso = await exigirClave(request, 'leer');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        const filas = await sql`SELECT nombre FROM categorias WHERE activa ORDER BY nombre`;
        return texto(filas.map((f) => f.nombre).join(' · '));
    } catch (error) {
        console.error('[bot/categorias]', error);
        return texto('ERROR: no se han podido leer las categorías', 500);
    }
}
