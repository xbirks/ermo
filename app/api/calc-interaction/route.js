import { NextResponse } from 'next/server';

// Fuerza ejecución en Node (acceso estable a process.env) y evita cache
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SummaryState = {
  total?: number;
  tipo?: string;
  tamano?: string;
  complejidad?: string;
};

type Payload = {
  event?: string;
  state?: SummaryState;
  t?: number;
  url?: string;
  sid?: string;
  reason?: string;
};

async function readBodyAsJson(req: Request): Promise<Payload | null> {
  // Algunos navegadores/envíos con sendBeacon usan text/plain
  const ctype = req.headers.get('content-type') || '';
  try {
    if (ctype.includes('application/json')) {
      return await req.json();
    }
    // Fallback: intentar parsear texto como JSON
    const raw = await req.text();
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildDiscordText(data: Payload) {
  const event = data?.event ?? 'n/d';
  const t = data?.t ?? Date.now();
  const s = data?.state ?? {};
  const url = data?.url ?? '';
  const reason = data?.reason ?? '';

  if (event === 'summary') {
    return (
      '🧮 Calculadora (resumen)\n' +
      `• Total: € ${Number(s.total ?? 0).toFixed(2)} | ` +
      `Tipo: ${s.tipo ?? 'n/d'} | ` +
      `Tamaño: ${s.tamano ?? 'n/d'} | ` +
      `Comp: ${s.complejidad ?? 'n/d'}\n` +
      `• Motivo: ${reason || 'n/d'} | URL: ${url}\n` +
      `• Hora: ${new Date(t).toLocaleString('es-ES')}`
    );
  }

  return (
    '🧮 Interacción en calculadora\n' +
    `• Evento: ${String(event).toUpperCase()} | Motivo: ${reason || 'n/d'}\n` +
    `• Total: € ${Number(s.total ?? 0).toFixed(2)} | ` +
    `Tipo: ${s.tipo ?? 'n/d'} | Tamaño: ${s.tamano ?? 'n/d'} | Comp.: ${s.complejidad ?? 'n/d'}\n` +
    `• URL: ${url}\n` +
    `• Hora: ${new Date(t).toLocaleString('es-ES')}`
  );
}

export async function POST(req: Request) {
  const data = await readBodyAsJson(req);

  if (!data) {
    // Devuelve 400 si no llegó JSON válido
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  // Construir mensaje
  const text = buildDiscordText(data);

  // Enviar a Discord si hay webhook
  const hook = process.env.DISCORD_WEBHOOK_URL;
  if (hook && hook.startsWith('http')) {
    try {
      const r = await fetch(hook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Discord acepta { content } para mensajes simples
        body: JSON.stringify({ content: text }),
        cache: 'no-store',
      });
      // Discord suele responder 204 No Content en éxito
      if (!r.ok && r.status !== 204 && r.status !== 429) {
        return NextResponse.json({ ok: false, error: `Discord ${r.status}` }, { status: 502 });
      }
    } catch (e) {
      return NextResponse.json({ ok: false, error: 'Discord fetch failed' }, { status: 502 });
    }
  }

  // Respuesta OK
  return NextResponse.json({ ok: true }, { status: 200 });
}

// Opcional: habilitar OPTIONS si alguna vez llamas cross-origin
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
