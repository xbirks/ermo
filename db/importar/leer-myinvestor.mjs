import { readFileSync } from 'node:fs';

/**
 * Lee el CSV de movimientos de MyInvestor.
 *
 * Formato: separador `;`, fechas dd/mm/aaaa, importes con coma decimal.
 * Columnas: Fecha de operación, Fecha de valor, Concepto, Importe, Divisa
 *
 * Sólo devuelve las aportaciones: el dinero que entra desde otras
 * cuentas. Se descartan a propósito dos cosas:
 *
 *   · Las compras de fondos (importes negativos: FIDELITY, AMUNDI,
 *     SP500...). No son gastos, son el mismo dinero cambiando de forma.
 *     Importarlas diría que has perdido 2.470 € cuando los tienes
 *     invertidos.
 *   · Los rendimientos ("PERIODO 06/06/2026 06/07/2026"). Se quedan
 *     dentro de la inversión y no forman parte del dinero del mes.
 */

const RENDIMIENTO = /^PERIODO\s+\d{2}\/\d{2}\/\d{4}/i;

/** dd/mm/aaaa → aaaa-mm-dd */
function aISO(fecha) {
    const [d, m, a] = fecha.trim().split('/');
    return `${a}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

/** "1.234,56" → 1234.56 */
function aNumero(importe) {
    return Number(importe.trim().replace(/\./g, '').replace(',', '.'));
}

/** Divide una línea CSV respetando las comillas. */
function partirLinea(linea, sep = ';') {
    const campos = [];
    let actual = '';
    let enComillas = false;
    for (let i = 0; i < linea.length; i++) {
        const c = linea[i];
        if (c === '"') {
            // Dos comillas seguidas dentro de un campo son una comilla literal.
            if (enComillas && linea[i + 1] === '"') { actual += '"'; i++; }
            else enComillas = !enComillas;
        } else if (c === sep && !enComillas) {
            campos.push(actual);
            actual = '';
        } else {
            actual += c;
        }
    }
    campos.push(actual);
    return campos.map((c) => c.trim());
}

export function leerMyInvestor(ruta) {
    // utf-8 con BOM: el ﻿ inicial rompería el nombre de la primera columna.
    const texto = readFileSync(ruta, 'utf8').replace(/^﻿/, '');
    const lineas = texto.split(/\r?\n/).filter((l) => l.trim());

    const cabecera = partirLinea(lineas[0]);
    const col = (nombre) => cabecera.findIndex((c) => c.toLowerCase().includes(nombre));

    const iFecha = col('fecha de operación') >= 0 ? col('fecha de operación') : col('fecha');
    const iConcepto = col('concepto');
    const iImporte = col('importe');

    if (iFecha < 0 || iConcepto < 0 || iImporte < 0) {
        throw new Error(
            `El CSV de MyInvestor no tiene las columnas esperadas. Encontradas: ${cabecera.join(', ')}`
        );
    }

    const aportaciones = [];
    const descartados = { compras: 0, rendimientos: 0 };

    for (const linea of lineas.slice(1)) {
        const campos = partirLinea(linea);
        if (campos.length < 3) continue;

        const concepto = campos[iConcepto];
        const importe = aNumero(campos[iImporte]);
        if (!Number.isFinite(importe)) continue;

        if (importe < 0) { descartados.compras++; continue; }
        if (RENDIMIENTO.test(concepto)) { descartados.rendimientos++; continue; }

        aportaciones.push({
            fecha: aISO(campos[iFecha]),
            concepto: concepto || 'Aportación',
            importe,
            banco: 'MyInvestor',
        });
    }

    return { aportaciones, descartados };
}
