import { readFileSync } from 'node:fs';

/**
 * Lee el CSV de movimientos de Imagin (CaixaBank).
 *
 * Formato: separador `;`, fechas dd/mm/aaaa, importes con el sufijo EUR
 * y separador de miles ("-1.234,56EUR").
 * Columnas: Concepto, Fecha, Importe, Saldo
 *
 * El fichero trae el saldo tras cada movimiento, y la primera fila es
 * la más reciente: de ahí sale el saldo actual de la cuenta sin tener
 * que sumar nada.
 */

/** dd/mm/aaaa → aaaa-mm-dd */
function aISO(fecha) {
    const [d, m, a] = fecha.trim().split('/');
    return `${a}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

/** "-1.234,56EUR" → -1234.56 */
function aNumero(texto) {
    return Number(
        texto.replace(/EUR/i, '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
    );
}

function partirLinea(linea, sep = ';') {
    const campos = [];
    let actual = '';
    let enComillas = false;
    for (let i = 0; i < linea.length; i++) {
        const c = linea[i];
        if (c === '"') {
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

export function leerImagin(ruta) {
    const texto = readFileSync(ruta, 'utf8').replace(/^﻿/, '');
    const lineas = texto.split(/\r?\n/).filter((l) => l.trim());

    const cabecera = partirLinea(lineas[0]);
    const col = (n) => cabecera.findIndex((c) => c.toLowerCase().includes(n));
    const iConcepto = col('concepto');
    const iFecha = col('fecha');
    const iImporte = col('importe');
    const iSaldo = col('saldo');

    if (iFecha < 0 || iImporte < 0) {
        throw new Error(
            `El CSV de Imagin no tiene las columnas esperadas. Encontradas: ${cabecera.join(', ')}`
        );
    }

    const movimientos = [];
    let saldoActual = null;

    for (const linea of lineas.slice(1)) {
        const campos = partirLinea(linea);
        if (campos.length < 3) continue;

        const importe = aNumero(campos[iImporte]);
        if (!Number.isFinite(importe) || importe === 0) continue;

        // La primera fila con saldo es la más reciente: ese es el saldo
        // de la cuenta hoy.
        if (saldoActual === null && iSaldo >= 0) {
            const s = aNumero(campos[iSaldo]);
            if (Number.isFinite(s)) saldoActual = s;
        }

        movimientos.push({
            fecha: aISO(campos[iFecha]),
            concepto: (campos[iConcepto] || 'Movimiento').trim(),
            importe: Math.abs(importe),
            tipo: importe > 0 ? 'ingreso' : 'gasto',
            banco: 'Imagin',
        });
    }

    return { movimientos, saldoActual };
}
