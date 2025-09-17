// app/api/calc-interaction/route.js
const WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

export async function POST(request) {
  try {
    if (!WEBHOOK) {
      return new Response('Missing DISCORD_WEBHOOK_URL', { status: 500 });
    }

    const json = await request.json().catch(() => ({}));
    const { event, reason, state, sid, t, url } = json || {};
    if (!event) return new Response('Bad Request', { status: 400 });

    const fmtEUR = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
    const total = typeof state?.total === 'number' ? state.total : undefined;

    const lines = [
      `**Calculadora** (${reason || 'activity'})`,
      total != null ? `Total: **${fmtEUR.format(total)}**` : undefined,
      state?.tipo ? `Tipo: ${state.tipo}` : undefined,
      state?.tamano ? `Tamaño: ${state.tamano}` : undefined,
      state?.complejidad ? `Complejidad: ${state.complejidad}` : undefined,
      url ? `URL: ${url}` : undefined,
      sid ? `SID: \`${sid}\`` : undefined,
      t ? `Time: <t:${Math.floor(Number(t) / 1000)}:f>` : undefined,
    ].filter(Boolean);

    const payload = { content: lines.join('\n') };

    const r = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (r.status === 204) return new Response(null, { status: 204 });

    const text = await r.text().catch(() => '');
    return new Response(`Discord error: ${r.status} ${text}`, { status: 502 });
  } catch (e) {
    return new Response(`Server error: ${e?.message || e}`, { status: 500 });
  }
}
