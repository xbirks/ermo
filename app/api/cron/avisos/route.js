import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/finanzas/db';
import { getResumenMes } from '@/app/lib/finanzas/consultas';
import { euros } from '@/app/lib/finanzas/formato';
import { enviarDiscord } from '@/app/lib/finanzas/discord';

// Nunca se cachea: tiene que leer la base cada vez que lo llame el cron.
export const dynamic = 'force-dynamic';

/**
 * Hoy, en fecha de Madrid.
 *
 * Vercel ejecuta los cron en UTC. Cerca de medianoche, tomar la fecha
 * en UTC sin más puede devolver el día equivocado (a la 1 de la
 * madrugada en Madrid todavía es el día anterior en UTC en invierno,
 * y dos horas antes en verano). Formatear con la zona horaria puesta
 * evita ese salto.
 */
function hoyMadrid() {
    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Madrid',
        year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const obj = Object.fromEntries(partes.map((p) => [p.type, p.value]));
    return `${obj.year}-${obj.month}-${obj.day}`;
}

/**
 * GET /api/cron/avisos
 *
 * Una vez al día: qué toca pagar o hacer hoy, y a mitad de mes un
 * resumen de cómo va. Lo dispara el cron de vercel.json.
 */
export async function GET(request) {
    const secreto = process.env.CRON_SECRET;
    if (secreto) {
        const cabecera = request.headers.get('authorization');
        if (cabecera !== `Bearer ${secreto}`) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }
    }

    try {
        const hoy = hoyMadrid();
        const diaHoy = Number(hoy.slice(8, 10));
        const mes = `${hoy.slice(0, 7)}-01`;

        // Tres fuentes de "esto toca hoy": los recibos fijos, el
        // préstamo del coche (que no es un recibo, es una deuda) y los
        // avisos sueltos que no mueven dinero. Cada uno comprueba que
        // no esté ya apuntado este mes, para no repetir el aviso de
        // algo que ya se ha hecho.
        let pendientes;
        try {
            pendientes = await sql`
                SELECT c.nombre AS concepto, c.importe_previsto AS importe, 'fijo' AS tipo
                FROM categorias c
                WHERE c.es_fijo AND c.activa AND c.dia_cobro = ${diaHoy}
                  AND fn_toca_en_mes(c.cada_meses, c.primer_mes, ${mes}::date)
                  AND NOT EXISTS (
                    SELECT 1 FROM transacciones t WHERE t.categoria_id = c.id
                      AND t.fecha >= ${mes}::date AND t.fecha < (${mes}::date + INTERVAL '1 month')
                  )
                  -- Si la categoría es la cuota de una deuda (el coche),
                  -- ya avisa la parte de "deuda" de abajo, con su día
                  -- real de cargo. Sin este filtro saldrían dos avisos
                  -- del mismo pago, en días distintos y con el importe
                  -- redondeado de un lado y el exacto del otro.
                  AND c.id NOT IN (
                    SELECT categoria_id FROM deudas WHERE categoria_id IS NOT NULL
                  )

                UNION ALL

                SELECT d.concepto, d.cuota AS importe, 'deuda' AS tipo
                FROM deudas d
                WHERE d.pendiente > 0 AND d.dia_cobro = ${diaHoy}
                  AND (d.categoria_id IS NULL OR NOT EXISTS (
                    SELECT 1 FROM transacciones t WHERE t.categoria_id = d.categoria_id
                      AND t.fecha >= ${mes}::date AND t.fecha < (${mes}::date + INTERVAL '1 month')
                  ))

                UNION ALL

                SELECT a.concepto, NULL AS importe, 'aviso' AS tipo
                FROM avisos a
                WHERE a.activo AND a.dia = ${diaHoy}
                  AND fn_toca_en_mes(a.cada_meses, a.primer_mes, ${mes}::date)
            `;
        } catch (e) {
            // La tabla "avisos" puede no existir todavía si falta la
            // migración 016: se sigue sin esa parte en vez de romper
            // también los fijos y las deudas.
            if (e?.code !== '42P01') throw e;
            console.warn('[finanzas/avisos] falta la migración 016-avisos');
            pendientes = [];
        }

        const mensajes = [];

        if (pendientes.length > 0) {
            const lineas = pendientes.map((p) =>
                p.importe ? `• ${p.concepto} — ${euros(p.importe)}` : `• ${p.concepto}`
            );
            mensajes.push(`Hoy toca:\n${lineas.join('\n')}`);
        }

        // A mitad de mes, cómo va la cosa hasta ahora.
        if (diaHoy === 15) {
            const r = await getResumenMes(mes);
            mensajes.push(
                `Resumen a mitad de mes.\n`
                + `Ingresos: ${euros(r.ingresos_totales)}\n`
                + `Gastos fijos: ${euros(r.gastos_fijos)}\n`
                + `Gastos variables: ${euros(r.gastos_variables)}\n`
                + `Limpio hasta hoy: ${euros(r.total_limpio)}`
            );
        }

        for (const texto of mensajes) {
            await enviarDiscord(texto);
        }

        return NextResponse.json({
            ok: true,
            dia: hoy,
            avisos: pendientes.map((p) => p.concepto),
            informe: diaHoy === 15,
        });
    } catch (error) {
        console.error('[finanzas/avisos]', error);
        return NextResponse.json({ error: 'Fallo al comprobar los avisos' }, { status: 500 });
    }
}
