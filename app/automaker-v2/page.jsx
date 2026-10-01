import Nav from "./componentes/Nav.jsx";
import Hero from "./componentes/Hero.jsx";
import Demo from "./componentes/Demo.jsx";
import Ahorro from "./componentes/Ahorro.jsx";
import Funciona from "./componentes/Funciona.jsx";
import Referencias from "./componentes/Referencias.jsx";
import NoHace from "./componentes/NoHace.jsx";
import Comparativa from "./componentes/Comparativa.jsx";
import Precio from "./componentes/Precio.jsx";
import ParaQuien from "./componentes/ParaQuien.jsx";
import Preguntas from "./componentes/Preguntas.jsx";
import "./aislamiento.scss";

// Borrador de la landing nueva de Automaker (modelo de autoservicio: alta
// con formación + cuota por diseñador). Es una copia independiente de
// /automaker: nada de lo que se cambie aquí afecta a la landing publicada.
//
// A propósito, sin Medicion.jsx: los clics de este borrador no deben
// mezclarse con las estadísticas de la landing real. La cabecera, el pie y
// las cookies de ERMO ya se quitan aquí porque la ruta empieza por
// /automaker (ver app/components/cromo-publico.jsx).
const TITULO = "Automaker | La repetición la hace Automaker. El diseño, tu equipo.";
const DESCRIPCION =
    "Tu diseñador diseña cada formato una vez en Figma. Una hoja de cálculo y un clic: salen todas las piezas de la campaña. Sin IA.";
const URL = "https://www.ermo.es/automaker-v2";

export const metadata = {
    title: TITULO,
    description: DESCRIPCION,
    alternates: { canonical: URL },
    // Borrador: fuera de los buscadores siempre.
    robots: { index: false, follow: false },
};

export const viewport = { themeColor: "#14394B" };

export default function PaginaAutomakerV2() {
    return (
        <div className="landing-automaker">
            {/* Aktiv Grotesk: igual que en /automaker. */}
            <link rel="stylesheet" href="https://use.typekit.net/cbv1cvv.css" precedence="default" />

            <noscript
                dangerouslySetInnerHTML={{ __html: "<style>[data-entra]{visibility:visible!important}</style>" }}
            />

            <Nav />
            <main>
                <Hero />
                <Demo />
                <Ahorro />
                <Funciona />
                <Referencias />
                <NoHace />
                <Comparativa />
                <Precio />
                <ParaQuien />
                <Preguntas />
            </main>
        </div>
    );
}
