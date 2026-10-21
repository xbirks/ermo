// Tirita de estilo (septiembre 2026). Las páginas pasan todavía a mano
// los azules antiguos a los botones (unos 47). En vez de tocar cada
// página, se traducen aquí a la paleta nueva, en un único punto.
// Cuando llegue el rediseño, este fichero desaparece.

const EQUIVALENCIAS = {
    "#3f52ff": "#14394B", // azul ERMO → tinta
    "#2136f8": "#14394B",
    "#0e1c9d": "#0C2735", // azul oscuro de hover → tinta profunda
    "#0b167d": "#0C2735",
    "#1f7cc8ff": "#0C2735",
};

export function traducirColor(color) {
    if (typeof color !== "string") return color;
    return EQUIVALENCIAS[color.trim().toLowerCase()] ?? color;
}
