import { NextResponse } from 'next/server';
import { verifyKey, InteractionType, InteractionResponseType } from 'discord-interactions';
import { sql } from '@/app/lib/finanzas/db';
import { euros } from '@/app/lib/finanzas/formato';

// Nunca se cachea: cada interacción es distinta.
export const dynamic = 'force-dynamic';

/** Hoy, en fecha de Madrid. Ver /api/cron/avisos para el porqué. */
function hoyMadrid() {
    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Madrid',
        year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const obj = Object.fromEntries(partes.map((p) => [p.type, p.value]));
    return `${obj.year}-${obj.month}-${obj.day}`;
}

function valorDe(opciones, nombre) {
    return opciones?.find((o) => o.name === nombre)?.value;
}

function mensaje(texto) {
    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: texto },
    });
}

/**
 * POST /api/discord/interactions
 *
 * Recibe los comandos /nota y /gasto desde Discord.
 *
 * Discord llama a esta URL en el momento en que alguien escribe el
 * comando: no hace falta ningún proceso que se quede escuchando de
 * fondo. Lo único obligatorio es comprobar la firma de cada petición,
 * porque sin eso cualquiera que conozca la URL podría apuntar gastos
 * o notas en tu nombre.
 */
export async function POST(request) {
    const firma = request.headers.get('x-signature-ed25519');
    const marca = request.headers.get('x-signature-timestamp');
    const cuerpo = await request.text();

    const clave = process.env.DISCORD_PUBLIC_KEY;

    // verifyKey es asíncrona en esta versión de la librería (usa Web
    // Crypto). Sin el await, la condición siguiente evaluaría una
    // promesa pendiente en vez de su resultado, y una promesa
    // pendiente es "verdadera" en JavaScript aunque la firma sea
    // falsa: cualquiera podría apuntar gastos sin pasar por Discord.
    const valida = Boolean(
        clave && firma && marca && await verifyKey(cuerpo, firma, marca, clave)
    );
    if (!valida) {
        return NextResponse.json({ error: 'Firma no válida' }, { status: 401 });
    }

    const interaccion = JSON.parse(cuerpo);

    // Discord manda un PING al configurar la URL, para comprobar que
    // responde antes de dejarla activa.
    if (interaccion.type === InteractionType.PING) {
        return NextResponse.json({ type: InteractionResponseType.PONG });
    }

    if (interaccion.type !== InteractionType.APPLICATION_COMMAND) {
        return NextResponse.json({ error: 'No implementado' }, { status: 400 });
    }

    const { name, options } = interaccion.data;

    try {
        if (name === 'nota') {
            const texto = valorDe(options, 'texto');
            await sql`INSERT INTO notas_libres (texto) VALUES (${texto})`;
            return mensaje(`Guardado: «${texto}»`);
        }

        if (name === 'gasto') {
            const importe = valorDe(options, 'importe');
            const concepto = valorDe(options, 'concepto');
            const nombreCuenta = valorDe(options, 'cuenta') || 'Santander';

            const [cuenta] = await sql`SELECT id FROM cuentas WHERE nombre = ${nombreCuenta}`;
            if (!cuenta) {
                return mensaje(`No encuentro la cuenta «${nombreCuenta}».`);
            }

            await sql`
                INSERT INTO transacciones (fecha, cuenta_id, concepto, importe, tipo_movimiento)
                VALUES (${hoyMadrid()}::date, ${cuenta.id}, ${concepto}, ${importe}, 'gasto')
            `;
            return mensaje(`Apuntado: ${euros(importe)} en ${concepto} (${nombreCuenta}).`);
        }

        return mensaje('Comando no reconocido.');
    } catch (error) {
        console.error('[discord/interactions]', error);
        // El importe puede venir a 0 o negativo: la base lo rechaza
        // por su propio CHECK, no hace falta duplicar esa validación
        // aquí. Cualquier otro fallo, igual: se avisa sin detalle
        // técnico y se revisa desde la web.
        return mensaje('Algo ha fallado al guardarlo. Revísalo desde la web.');
    }
}
