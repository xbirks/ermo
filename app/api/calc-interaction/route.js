import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    const event = data?.event || null;
    const t = data?.t ?? Date.now();

    let text;

    if (event === 'summary') {
      const s = data?.state || {};
      // Mensaje minimalista (lo que pediste)
      text =
        '🧮 Calculadora (resumen)\n' +
        `• Total: € ${Number(s?.total ?? 0).toFixed(2)} | ` +
        `Tipo: ${s?.tipo ?? 'n/d'} | ` +
        `Tamaño: ${s?.tamano ?? 'n/d'} | ` +
        `Comp: ${s?.complejidad ?? 'n/d'}\n` +
        `• Hora: ${new Date(t).toLocaleString('es-ES')}`;
    } else {
      // Retrocompat (por si llega algo viejo)
      const s = data?.state || {};
      text =
        '🧮 Interacción en calculadora\n' +
        `• Evento: ${String(event || 'n/d').toUpperCase()}\n` +
        `• Total: € ${Number(s?.total ?? 0).toFixed(2)} | ` +
        `• Tipo: ${s?.tipo ?? 'n/d'} | • Tamaño: ${s?.tamano ?? 'n/d'} | • Comp.: ${s?.complejidad ?? 'n/d'}\n` +
        `• Hora: ${new Date(t).toLocaleString('es-ES')}`;
    }

    if (process.env.DISCORD_WEBHOOK_URL) {
      const r = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      if (!r.ok && r.status !== 429) {
        return NextResponse.json({ ok: false, error: `Discord ${r.status}` }, { status: 502 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return new NextResponse('Bad Request', { status: 400 });
  }
}
