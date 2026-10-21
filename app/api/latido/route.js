import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/finanzas/db';
import { sincronizarTodas } from '@/app/lib/finanzas/banco';
import { enviarDiscord } from '@/app/lib/finanzas/discord';

/**
 * Lee los bancos conectados y avisa por Discord: qué ha entrado, si el
 * saldo de la app no cuadraba con el del banco y si alguna autorización
 * caduca en menos de dos semanas. Nunca tumba el latido si falla.
 */
async function leerBancos() {
    try {
        const resultados = await sincronizarTodas();
        const lineas = resultados.map((r) => (r.ok
            ? `${r.cuenta}: ${r.nuevas} nuevos`
              + (r.diferencia ? ` · ⚠️ la app iba ${r.diferencia > 0 ? 'por debajo' : 'por encima'} ${Math.abs(r.diferencia).toFixed(2)} €` : '')
            : `${r.cuenta}: ❌ ${r.error}`));

        const caducan = await sql`
            SELECT c.nombre, b.valida_hasta FROM conexiones_banco b JOIN cuentas c ON c.id = b.cuenta_id
            WHERE b.activa AND b.valida_hasta < now() + interval '14 days'
        `;
        for (const c of caducan) {
            const dias = Math.ceil((new Date(c.valida_hasta) - Date.now()) / 86400000);
            lineas.push(dias > 0
                ? `🔔 La conexión con ${c.nombre} caduca en ${dias} días: renuévala en Finanzas → Bancos.`
                : `🔔 La conexión con ${c.nombre} ha caducado: vuelve a conectarla en Finanzas → Bancos.`);
        }

        const hayAlgo = resultados.some((r) => !r.ok || r.nuevas || r.diferencia) || caducan.length;
        if (hayAlgo) await enviarDiscord(`🏦 Lectura de bancos\n${lineas.join('\n')}`).catch(() => {});
        return resultados;
    } catch (error) {
        console.error('[latido/bancos]', error);
        return { error: 'Fallo al leer los bancos' };
    }
}

// Nunca se cachea: si Next guardara la respuesta, la base no se tocaría
// y el latido no serviría de nada.
export const dynamic = 'force-dynamic';
// Leer dos bancos puede tardar unos segundos más que el límite por defecto.
export const maxDuration = 60;

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
 * Además, si existe CRON_SECRET, lee los bancos conectados (ver
 * leerBancos). Está protegido, porque una ruta pública que abre
 * conexiones a la base es una invitación a que alguien las agote.
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

        // De paso, la lectura diaria de los bancos. Sólo con CRON_SECRET
        // configurada: sin ella esta ruta queda abierta, y cualquiera
        // podría gastar las 4 lecturas diarias que permite PSD2.
        let bancos = null;
        if (secreto) bancos = await leerBancos();

        return NextResponse.json({ ok: true, momento: fila.momento, bancos });
    } catch (error) {
        // El mensaje de Postgres puede llevar el host o el usuario de la
        // cadena de conexión, así que se queda en los logs de Vercel.
        console.error('[latido]', error);
        return NextResponse.json({ error: 'La base no responde' }, { status: 503 });
    }
}
