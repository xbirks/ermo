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
