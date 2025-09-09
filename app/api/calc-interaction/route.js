import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();

    // Retrocompat: payload antiguo { t, source, total }
    const isLegacy = typeof data?.source !== 'undefined' || typeof data?.total !== 'undefined';

    // Nuevo payload esperado { event, details, state, sid, url, t }
    const event = data?.event ?? (isLegacy ? 'legacy_interaction' : null);
    const t = data?.t ?? Date.now();

    // Estado (si existe en nuevo payload)
    const s = data?.state || {};
    const total = isLegacy ? data?.total : s?.total;

    // Construcción del mensaje
    const lines = [];
    lines.push('🧮 Interacción en calculadora');

    if (event) lines.push(`• Evento: ${String(event).toUpperCase()}`);

    if (isLegacy) {
      lines.push(`• Origen: ${data?.source ?? 'n/d'}`);
      lines.push(`• Total: € ${Number(total ?? 0).toFixed(2)}`);
    } else {
      // Snapshot resumido (si existe)
      if (s && Object.keys(s).length) {
        lines.push(
          [
            `• Total: € ${Number(total ?? 0).toFixed(2)}`,
            `• Tipo: ${s?.tipo ?? 'n/d'}`,
            `• Tamaño: ${s?.tamano ?? 'n/d'}`,
            `• Comp.: ${s?.complejidad ?? 'n/d'}`
          ].join(' | ')
        );
        lines.push(
          [
            `• Acces.: ${s?.accesibilidad ?? 'n/d'}`,
            `SEO tec=${!!s?.seoTec}`,
            `SEO cont=${!!s?.seoCont}`
          ].join(' | ')
        );
        lines.push(
          [
            `• Contenidos: red=${!!s?.opRedaccion} trad=${!!s?.opTraducciones} img=${!!s?.opImagenes} foto=${!!s?.opFotografia}`
          ].join(' ')
        );
        lines.push(
          [
            `• Operativa: urgente=${!!s?.opUrgente} revExtra=${!!s?.opRevisionExtra} reuExtra=${!!s?.opReunionesExtra}`
          ].join(' ')
        );
        lines.push(
          [
            `• Mantenimiento: anual=${!!s?.mantAnual} horas=${!!s?.mantHoras} ext=${!!s?.mantExternos}`
          ].join(' ')
        );
      }
      if (data?.details) {
        // Evita mensajes enormes
        const detailsStr = JSON.stringify(data.details);
        lines.push(`• Detalles: ${detailsStr.slice(0, 300)}${detailsStr.length > 300 ? '…' : ''}`);
      }
      if (data?.sid) lines.push(`• SID: ${data.sid}`);
      if (data?.url) lines.push(`• URL: ${data.url}`);
      if (req?.headers?.get('user-agent')) lines.push(`• UA: ${req.headers.get('user-agent')}`);
    }

    lines.push(`• Hora: ${new Date(t).toLocaleString('es-ES')}`);

    const text = lines.join('\n');

    if (process.env.DISCORD_WEBHOOK_URL) {
      const r = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      // Opcional: si Discord rate-limita (429), no lo tratamos como error fatal
      if (!r.ok && r.status !== 429) {
        return NextResponse.json({ ok: false, error: `Discord ${r.status}` }, { status: 502 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return new NextResponse('Bad Request', { status: 400 });
  }
}
