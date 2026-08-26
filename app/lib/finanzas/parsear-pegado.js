// Lee el texto que se copia y pega directamente de la banca móvil
// (Imagin o Santander) y lo trocea en movimientos sueltos.
//
// No es el mismo lector que usa `db/importar/importar.mjs`: aquel lee
// un CSV o un PDF descargado; esto lee el texto tal cual sale de
// seleccionar y copiar la lista de movimientos en el móvil, que trae
// saltos de línea y cabeceras sueltas por en medio. El resultado es a
// propósito "mejor esfuerzo": lo que no se reconoce se descarta en vez
// de reventar, porque la pantalla que llama a esto deja revisar y
// completar a mano antes de guardar nada.

const MESES_CORTOS = {
    ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6,
    jul: 7, ago: 8, sep: 9, oct: 10, nov: 11, dic: 12,
};
const MESES_LARGOS = {
    enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
    julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
};

const pad2 = (n) => String(n).padStart(2, '0');

/** "2.650,00" o "-6,00" → 2650 / -6, con coma decimal y punto de miles. */
function aNumero(texto) {
    return Number(texto.replace(/\./g, '').replace(',', '.'));
}

const RE_FECHA_IMAGIN = /^(\d{1,2})\s+([A-Za-zÀ-ÿ]{3})[a-zà-ÿ]*\.?\s+(\d{4})$/i;
const RE_IMPORTE_SIMPLE = /^[\d.]+,\d{2}\s*€?$/;
const RE_SALDO = /^[+-]?\s*[\d.]+,\d{2}\s*€$/;

/**
 * Extracto de Imagin (CaixaBank) copiado del móvil.
 *
 * Cada apunte son 4 o 5 líneas: un texto, la fecha ("26 Ago 2026"), a
 * veces un segundo texto (el nombre de quien paga o cobra), el
 * importe siempre en positivo, y el saldo tras el movimiento con
 * signo. El texto no dice si fue un ingreso o un gasto: se deduce
 * comparando el saldo de cada apunte con el del siguiente en la
 * lista (que viene del más reciente al más antiguo).
 */
export function parseImagin(texto) {
    const lineas = texto.split('\n').map((l) => l.trim()).filter(Boolean);

    const brutos = [];
    for (let i = 0; i < lineas.length; i++) {
        const m = lineas[i].match(RE_FECHA_IMAGIN);
        if (!m) continue;

        const dia = Number(m[1]);
        const mes = MESES_CORTOS[m[2].toLowerCase()];
        const anio = Number(m[3]);
        if (!mes) continue;
        const fecha = `${anio}-${pad2(mes)}-${pad2(dia)}`;

        const texto1 = lineas[i - 1] || '';
        let concepto; let importeTxt; let saldoTxt;

        if (RE_IMPORTE_SIMPLE.test(lineas[i + 1] || '')) {
            // 4 líneas: sin segundo texto.
            concepto = texto1;
            importeTxt = lineas[i + 1];
            saldoTxt = lineas[i + 2];
        } else {
            // 5 líneas: hay un segundo texto (el nombre).
            const texto2 = lineas[i + 1] || '';
            concepto = texto2 && texto2 !== texto1 ? `${texto1} — ${texto2}` : texto1;
            importeTxt = lineas[i + 2];
            saldoTxt = lineas[i + 3];
        }

        if (!importeTxt || !RE_IMPORTE_SIMPLE.test(importeTxt)) continue;
        const importe = Math.abs(aNumero(importeTxt.replace('€', '').trim()));
        const saldo = saldoTxt && RE_SALDO.test(saldoTxt)
            ? aNumero(saldoTxt.replace('€', '').replace(/\s/g, ''))
            : null;

        brutos.push({ fecha, concepto: concepto || 'Movimiento', importe, saldo });
    }

    // El signo sale de comparar el saldo de cada apunte con el
    // siguiente de la lista (más antiguo). El último de todos —el más
    // antiguo del pegado— se queda sin poder deducirlo: no hay nada
    // anterior con lo que compararlo.
    return brutos.map((b, i) => {
        const siguiente = brutos[i + 1];
        let tipo = null;
        if (b.saldo != null && siguiente?.saldo != null) {
            tipo = b.saldo - siguiente.saldo >= 0 ? 'ingreso' : 'gasto';
        }
        return { fecha: b.fecha, concepto: b.concepto, importe: b.importe, tipo };
    });
}

const DIAS_SEMANA = /^(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo)\s*,\s*(\d{1,2})\s+([A-Za-zÀ-ÿ]+)$/i;
const RE_IMPORTE_SANTANDER = /^[+-]?[\d.]+,\d{2}$/;
const RE_SALDO_SANTANDER = /^[\d.]+,\d{2}\s*EUR$/i;

/** Limpia lo que el banco añade y no aporta al leerlo en una lista. */
function limpiarConceptoSantander(texto) {
    return texto
        .replace(/,?\s*Tarj\.?\s*:?\s*\*?\d+/gi, '')
        .replace(/,?\s*Tarjeta\s*\d+/gi, '')
        .replace(/,\s*Comision\s*[\d,]+/gi, '')
        .replace(/\s+/g, ' ')
        .replace(/[,\s]+$/, '')
        .trim();
}

/**
 * Extracto de Santander copiado del móvil.
 *
 * Los apuntes se agrupan bajo una cabecera de día ("Miércoles, 26
 * Agosto", sin año), y cada uno trae concepto, importe con signo,
 * "EUR" suelto y el saldo tras el movimiento. El espaciado entre
 * bloques es irregular al copiar, así que se ignoran las líneas en
 * blanco y se reconoce cada apunte por su forma, no por su posición.
 */
export function parseSantander(texto, anio = new Date().getFullYear()) {
    const lineas = texto.split('\n').map((l) => l.trim()).filter(Boolean);

    const resultado = [];
    let fechaActual = null;

    for (let i = 0; i < lineas.length; i++) {
        const cab = lineas[i].match(DIAS_SEMANA);
        if (cab) {
            const dia = Number(cab[2]);
            const mes = MESES_LARGOS[cab[3].toLowerCase()];
            if (mes) fechaActual = `${anio}-${pad2(mes)}-${pad2(dia)}`;
            continue;
        }

        if (lineas[i] === 'EUR') continue;

        // ¿Empieza aquí un apunte? La línea siguiente tiene que ser un
        // importe suelto con signo.
        if (fechaActual && RE_IMPORTE_SANTANDER.test(lineas[i + 1] || '')) {
            const concepto = limpiarConceptoSantander(lineas[i]);
            const importe = aNumero(lineas[i + 1]);
            let j = i + 2;
            if (lineas[j] === 'EUR') j++;
            // El saldo es opcional para el resultado, pero si está,
            // salta también esa línea.
            if (lineas[j] && RE_SALDO_SANTANDER.test(lineas[j])) j++;

            resultado.push({
                fecha: fechaActual,
                concepto: concepto || 'Movimiento',
                importe: Math.abs(importe),
                tipo: importe < 0 ? 'gasto' : 'ingreso',
            });
            i = j - 1;
        }
    }

    return resultado;
}

/** Distingue qué lector usar mirando la forma del texto pegado. */
export function detectarBanco(texto) {
    for (const linea of texto.split('\n')) {
        const l = linea.trim();
        if (!l) continue;
        if (RE_FECHA_IMAGIN.test(l)) return 'Imagin';
        if (DIAS_SEMANA.test(l)) return 'Santander';
    }
    return null;
}
