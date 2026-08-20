// Avisos por Discord.
//
// Un webhook de un canal ya es un endpoint completo: no hace falta
// bot, ni token de aplicación, ni buscar ningún ID. Se crea desde
// Configuración del servidor → Integraciones → Webhooks, y la URL que
// da ahí es la única variable que hace falta.

/**
 * Manda un mensaje de texto al canal del webhook configurado.
 *
 * Si falta la variable de entorno, no lanza error: avisa en los logs
 * y sigue. Un aviso que no llega no debe tumbar el resto del cron ni
 * la comprobación de qué toca hoy.
 */
export async function enviarDiscord(texto) {
    const url = process.env.DISCORD_WEBHOOK_URL;

    if (!url) {
        console.warn('[finanzas/discord] falta DISCORD_WEBHOOK_URL');
        return { ok: false, motivo: 'sin configurar' };
    }

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Discord corta el mensaje en 2000 caracteres; un aviso o un
        // resumen mensual nunca se acerca a eso.
        body: JSON.stringify({ content: texto }),
    });

    if (!res.ok) {
        const detalle = await res.text().catch(() => '');
        console.error('[finanzas/discord] fallo al enviar:', res.status, detalle);
        return { ok: false, motivo: `HTTP ${res.status}` };
    }
    return { ok: true };
}
