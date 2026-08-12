import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/finanzas/db';

// Nunca se cachea: si Next guardara la respuesta, la base no se tocaría
// y el latido no serviría de nada.
export const dynamic = 'force-dynamic';

/**
 * GET /api/latido
 *
 * Mantiene despierto el proyecto de Supabase.
 *
 * El plan gratuito pausa la base tras siete días sin actividad, y
 * despausarla es un trámite manual. Como esta herramienta se usa a
 * rachas (unos días de apuntes, luego semanas sin entrar), es fácil
 * pasar de siete días sin abrirla.
 *
 * Una consulta al día basta para reiniciar ese contador. La lanza el
 * cron de Vercel definido en vercel.json.
 *
 * No lee ni escribe datos: sólo pregunta la hora al servidor. Aun así
 * está protegido, porque una ruta pública que abre conexiones a la base
 * es una invitación a que alguien las agote.
 */
export async function GET(request) {
    // Vercel manda esta cabecera automáticamente en las llamadas de cron
    // cuando existe la variable CRON_SECRET. Sin la variable configurada
    // el endpoint queda abierto, así que conviene ponerla.
    const secreto = process.env.CRON_SECRET;
    if (secreto) {
        const cabecera = request.headers.get('authorization');
        if (cabecera !== `Bearer ${secreto}`) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }
    }

    try {
        const [fila] = await sql`SELECT now() AS momento`;
        return NextResponse.json({ ok: true, momento: fila.momento });
    } catch (error) {
        // El mensaje de Postgres puede llevar el host o el usuario de la
        // cadena de conexión, así que se queda en los logs de Vercel.
        console.error('[latido]', error);
        return NextResponse.json({ error: 'La base no responde' }, { status: 503 });
    }
}
