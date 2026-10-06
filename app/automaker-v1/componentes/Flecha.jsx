import s from "./Flecha.module.scss";

// Flecha ↗ de los botones, calcada de Figma (nodos 90:330 y 90:504):
// los dos brazos llegan hasta el borde del cuadrado. Lleva dos copias:
// al pasar el ratón por el enlace que la contiene, una sale por la
// esquina y la otra entra por la opuesta.
export default function Flecha({ className = "" }) {
    const trazo = (
        <svg viewBox="0 0 10 10" aria-hidden="true">
            <path d="M9.5 10V.5H0M9.5.5 0 10" />
        </svg>
    );
    return (
        <span className={`${s.flecha} ${className}`} aria-hidden="true">
            {trazo}
            {trazo}
        </span>
    );
}
