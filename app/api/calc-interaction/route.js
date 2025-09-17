// app/api/calc-interaction/route.ts
import type { NextRequest } from 'next/server';

const WEBHOOK = process.env.DISCORD_WEBHOOK_URL!;

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => ({}));
    const { event, reason, state, sid, t, url } = json || {};

    // Hardening básico
    if (!event) return new Response('Bad Request', { status: 400 });

    // Construye mensaje
    const total = typeof state?.total === 'number' ? state.total : undefined;
    const lines = [
      `**Calculadora** (${reason || 'activity'})`,
      total != null ? `Total: **${new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(total)}**` : undefined,
      state?.tipo ? `Tipo: ${state.tipo}` : undefined,
      state?.tamano ? `Tamaño: ${state.tamano}` : undefined,
      state?.complejidad ? `Complejidad: ${state.complejidad}` : undefined,
      url ? `URL: ${url}` : undefined,
      sid ? `SID: \`${sid}\`` : undefined,
      t ? `Time: <t:${Math.floor(Number(t)/1000)}:f>` : undefined,
    ].filter(Boolean);

    // Payload Discord (simple y compatible)
    const payload = { content: lines.join('\n') };

    // Enviar a Discord (server-side, sin CORS)
    const r = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // keepalive ayuda en edge, pero en node no es necesario
    });

    // Discord devuelve 204 en éxito
    if (r.status === 204) return new Response(null, { status: 204 });

    const text = await r.text().catch(() => '');
    return new Response(`Discord error: ${r.status} ${text}`, { status: 502 });
  } catch (e: any) {
    return new Response(`Server error: ${e?.message || e}`, { status: 500 });
  }
}
