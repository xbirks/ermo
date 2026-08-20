// Formato de cifras y fechas en español.

const EUR = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const euros = (n) => EUR.format(Number(n) || 0);

/** Sin decimales cuando son ",00": las cifras redondas se leen mejor. */
export function eurosCorto(n) {
    const v = Number(n) || 0;
    return Number.isInteger(v)
        ? new Intl.NumberFormat('es-ES', {
              style: 'currency', currency: 'EUR', minimumFractionDigits: 0,
          }).format(v)
        : EUR.format(v);
}

export const nombreMes = (fecha) =>
    new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
        .format(new Date(fecha));

/** "jun 26": para columnas estrechas, como las barras del dashboard. */
export const mesCorto = (fecha) =>
    new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' })
        .format(new Date(fecha))
        .replace('.', '');

export const diaCorto = (fecha) =>
    new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit' })
        .format(new Date(fecha));

/** Fecha de hoy como YYYY-MM-DD, en hora local y no UTC. */
export function hoyISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Cuándo tocará un recibo fijo dentro de un mes concreto.
 *
 * `diaCobro` puede pasarse de los días que tiene el mes (31 en un
 * recibo que se cobra "a fin de mes", por ejemplo): se recorta al
 * último día real, así 31 funciona igual de bien en abril que en
 * julio sin tener que guardar un día distinto para cada mes.
 */
export function fechaFijoDelMes(mesISO, diaCobro) {
    if (!mesISO || !diaCobro) return null;
    const [anio, mes] = mesISO.split('-').map(Number);
    const ultimoDia = new Date(anio, mes, 0).getDate();
    const dia = Math.min(diaCobro, ultimoDia);
    return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

/**
 * Fecha límite de Hacienda para liquidar un trimestre de IVA
 * (modelo 303), a partir del `trimestre_fiscal` ('2026-T3').
 *
 * Son las fechas fijas de la AEAT: el 20 del mes siguiente a cada
 * trimestre, salvo el cuarto, que se liquida el 30 de enero del año
 * que viene junto con el resumen anual.
 */
export function fechaLimiteIva(trimestreFiscal) {
    if (!trimestreFiscal) return null;
    const [anioStr, tStr] = trimestreFiscal.split('-T');
    const anio = Number(anioStr);
    const trimestre = Number(tStr);
    const limites = {
        1: `${anio}-04-20`,
        2: `${anio}-07-20`,
        3: `${anio}-10-20`,
        4: `${anio + 1}-01-30`,
    };
    return limites[trimestre] || null;
}
