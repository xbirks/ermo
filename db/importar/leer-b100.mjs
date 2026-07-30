import { readFileSync } from 'node:fs';

/**
 * Lee el CSV de movimientos de B100 (BBVA).
 *
 * Formato: separador `,`, fechas dd/mm/aaaa, importes con punto decimal.
 * Columnas: Fecha de Operación, Fecha valor, Detalle, Concepto,
 *           Cantidad, Saldo tras operación, Divisa, Tipo de Movimiento
 *
 * OJO con el saldo. B100 mueve el dinero automáticamente a la "Hucha"
 * en cuanto entra, así que el extracto de la cuenta corriente acaba
 * siempre en 0,00 € aunque haya miles de euros ahorrados. En el
 * fichero de julio de 2026: entran y salen 17.835 € y el saldo final
 * es cero, pero en la hucha hay 8.135 €.
 *
 * Por eso se separan dos cosas:
 *   · Movimientos con el exterior: dinero que de verdad entra o sale
 *     de B100. Es lo que afecta al ahorro real.
 *   · Movimientos con la hucha: dinero que se queda dentro, sólo
 *     cambiando de bolsillo. No son ingresos ni gastos.
 */

const A_HUCHA = /AHORRO PARA HUCHA/i;
const DE_HUCHA = /TRASPASO DESDE HUCHA/i;

/** dd/mm/aaaa → aaaa-mm-dd */
function aISO(fecha) {
    const [d, m, a] = fecha.trim().split('/');
    return `${a}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

/** Divide una línea CSV respetando las comillas. */
function partirLinea(linea, sep = ',') {
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

export function leerB100(ruta) {
    const texto = readFileSync(ruta, 'utf8').replace(/^﻿/, '');
    const lineas = texto.split(/\r?\n/).filter((l) => l.trim());

    const cabecera = partirLinea(lineas[0]);
    const col = (n) => cabecera.findIndex((c) => c.toLowerCase().includes(n));
    const iFecha = col('fecha de operación') >= 0 ? col('fecha de operación') : col('fecha');
    const iConcepto = col('concepto');
    const iDetalle = col('detalle');
    const iCantidad = col('cantidad');

    if (iFecha < 0 || iCantidad < 0) {
        throw new Error(
            `El CSV de B100 no tiene las columnas esperadas. Encontradas: ${cabecera.join(', ')}`
        );
    }

    const movimientos = [];
    const hucha = { entra: 0, sale: 0, movimientos: 0 };

    for (const linea of lineas.slice(1)) {
        const campos = partirLinea(linea);
        if (campos.length < 4) continue;

        const importe = Number(campos[iCantidad]);
        if (!Number.isFinite(importe) || importe === 0) continue;

        const concepto = campos[iConcepto] || '';
        const detalle = iDetalle >= 0 ? campos[iDetalle] : '';

        // Los traspasos con la hucha no salen de B100: se contabilizan
        // aparte para poder calcular el saldo real, pero no son
        // ingresos ni gastos.
        if (A_HUCHA.test(concepto)) {
            hucha.sale += Math.abs(importe);
            hucha.movimientos++;
            continue;
        }
        if (DE_HUCHA.test(concepto)) {
            hucha.entra += Math.abs(importe);
            hucha.movimientos++;
            continue;
        }

        movimientos.push({
            fecha: aISO(campos[iFecha]),
            concepto: concepto || detalle || 'Movimiento',
            detalle,
            importe: Math.abs(importe),
            // Positivo = entra dinero en el ahorro; negativo = sale.
            tipo: importe > 0 ? 'ingreso' : 'gasto',
            banco: 'B100',
        });
    }

    // Lo que hay guardado: lo que ha ido a la hucha menos lo que ha
    // vuelto. Coincide con el neto aportado desde fuera.
    const saldoHucha = hucha.sale - hucha.entra;

    return { movimientos, hucha: { ...hucha, saldo: saldoHucha } };
}
