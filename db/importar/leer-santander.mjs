import { readFileSync } from 'node:fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

/**
 * Lee el PDF de movimientos de Santander.
 *
 * Santander no deja exportar CSV desde la banca online, sólo este PDF.
 * Cada movimiento ocupa dos renglones:
 *
 *   30/07/2026 | Pago Movil En Licencia 1979, ... | -6,00 EUR | 68,04 EUR
 *   Fecha valor: 30/07/2026
 *
 * El texto se agrupa por su altura en la página para reconstruir las
 * filas, porque el PDF no guarda la tabla como tal sino fragmentos
 * sueltos con coordenadas.
 */

const FECHA = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const IMPORTE = /^(-?[\d.]+,\d{2})\s*EUR$/;

/** "-1.234,56" → -1234.56 */
function aNumero(texto) {
    return Number(texto.replace(/\./g, '').replace(',', '.'));
}

/** dd/mm/aaaa → aaaa-mm-dd */
function aISO(d, m, a) {
    return `${a}-${m}-${d}`;
}

/**
 * Limpia el concepto que imprime el banco.
 *
 * Los conceptos vienen con el número de tarjeta, la ciudad y coletillas
 * que no aportan nada al leerlos en una lista.
 */
function limpiarConcepto(texto) {
    return texto
        .replace(/,?\s*Tarj\.?\s*:?\s*\*?\d+/gi, '')     // Tarj. :*988762
        .replace(/,?\s*Tarjeta\s*\d+/gi, '')             // Tarjeta 5489010390988762
        .replace(/,\s*Comision\s*[\d,]+/gi, '')          // Comision 0,00
        .replace(/^Pago Movil En\s+/i, '')
        .replace(/^Compra\s+(Internet\s+En\s+)?/i, '')
        .replace(/^Recibo\s+/i, '')
        .replace(/\s+/g, ' ')
        .replace(/[,\s]+$/, '')
        .trim();
}

export async function leerSantander(ruta) {
    const doc = await getDocument({
        data: new Uint8Array(readFileSync(ruta)),
        useSystemFonts: true,
    }).promise;

    const movimientos = [];
    let saldoFinal = null;

    for (let n = 1; n <= doc.numPages; n++) {
        const pagina = await doc.getPage(n);
        const contenido = await pagina.getTextContent();

        // Agrupa los fragmentos por altura: cada grupo es un renglón.
        const renglones = new Map();
        for (const item of contenido.items) {
            if (!item.str.trim()) continue;
            const y = Math.round(item.transform[5]);
            if (!renglones.has(y)) renglones.set(y, []);
            renglones.get(y).push({ x: item.transform[4], texto: item.str.trim() });
        }

        // De arriba abajo, ordenando cada renglón de izquierda a derecha.
        const filas = [...renglones.entries()]
            .sort((a, b) => b[0] - a[0])
            .map(([, items]) => items.sort((a, b) => a.x - b.x).map((i) => i.texto));

        for (const campos of filas) {
            // El saldo de la cuenta aparece en la cabecera del extracto.
            if (saldoFinal === null && campos[0] === 'Saldo:') {
                const m = campos.find((c) => IMPORTE.test(c));
                if (m) saldoFinal = aNumero(m.match(IMPORTE)[1]);
            }

            const fecha = campos[0]?.match(FECHA);
            if (!fecha) continue;

            // Una fila de movimiento tiene fecha, concepto, importe y saldo.
            const importes = campos.filter((c) => IMPORTE.test(c));
            if (importes.length < 1) continue;

            const importe = aNumero(importes[0].match(IMPORTE)[1]);
            if (!Number.isFinite(importe) || importe === 0) continue;

            // El concepto es lo que hay entre la fecha y el primer importe.
            const iImporte = campos.indexOf(importes[0]);
            const concepto = limpiarConcepto(campos.slice(1, iImporte).join(' '));

            movimientos.push({
                fecha: aISO(fecha[1], fecha[2], fecha[3]),
                concepto: concepto || 'Movimiento',
                conceptoOriginal: campos.slice(1, iImporte).join(' '),
                importe: Math.abs(importe),
                tipo: importe > 0 ? 'ingreso' : 'gasto',
                banco: 'Santander',
            });
        }
    }

    return { movimientos, saldoFinal };
}
