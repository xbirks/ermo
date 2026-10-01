import Flecha from "./Flecha.jsx";
import s from "./Boton.module.scss";

// Botón pastilla con flecha ↗. Variantes de Figma: "claro" (fondo casi
// blanco), "cian" (cian claro), "vivo" (cian del botón Generar piezas)
// y "tinta" (oscuro).
export default function Boton({ href, variante = "tinta", className = "", children, ...resto }) {
    return (
        <a href={href} className={`${s.boton} ${s[variante]} ${className}`} {...resto}>
            {children}
            <Flecha />
        </a>
    );
}
