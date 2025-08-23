import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json(); // { t, source, total }
    if (process.env.DISCORD_WEBHOOK_URL) {
      const text =
        `🧮 Interacción en calculadora\n` +
        `• Origen: ${data.source || 'n/d'}\n` +
        `• Total: ${data.total ?? 'n/d'}\n` +
        `• Hora: ${new Date(data.t).toLocaleString('es-ES')}`;

      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return new NextResponse('Bad Request', { status: 400 });
  }
}
