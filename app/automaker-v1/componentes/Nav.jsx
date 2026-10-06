import Flecha from "./Flecha.jsx";
import s from "./Nav.module.scss";
import { CONTACTO_DEMO } from "../contacto.js";

const ENLACES = [
    { href: "#como-funciona", texto: "¿Cómo funciona?" },
    { href: "#preguntas", texto: "Preguntas" },
    { href: "#precio", texto: "Precio" },
];

export default function Nav() {
    return (
        <nav className={s.nav} aria-label="Principal">
            <a href="/" className={s.logo} aria-label="ERMO">
                <img src="/landing/logo-ermo.svg" width={106} height={26} alt="" />
            </a>

            <ul className={s.enlaces}>
                {ENLACES.map((e) => (
                    <li key={e.href}>
                        <a href={e.href} className={s.enlace}>{e.texto}</a>
                    </li>
                ))}
            </ul>

            <a href={CONTACTO_DEMO} className={s.cta}>
                Hablemos
                <Flecha />
            </a>
        </nav>
    );
}
