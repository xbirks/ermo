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
import Medicion from "./Medicion.jsx";
import "./aislamiento.scss";

// Landing comercial de Automaker. Trae su propia cabecera; la cabecera,
// el pie y el cursor de la web de ERMO se quitan en esta ruta (ver
// components/cromo-publico.jsx).
export const metadata = {
    title: "Automaker | Campañas semanales maquetadas en minutos",
    description:
        "Entra el brief de una semana y salen todas las piezas en todos los formatos. Sin IA, respetando la identidad del cliente.",
    // Oculta a los buscadores hasta limpiar imágenes y textos de clientes.
    robots: { index: false, follow: false },
};

export default function PaginaAutomaker() {
    return (
        <div className="landing-automaker">
            {/* Aktiv Grotesk: de momento sale del kit de Medworld, que solo
                vale en local. Cuando esté en el kit de ERMO (ury2gea, que ya
                carga el layout), esta línea sobra. */}
            <link rel="stylesheet" href="https://use.typekit.net/cbv1cvv.css" precedence="default" />

            {/* Sin JavaScript no hay animación: se muestra todo quieto. */}
            <noscript
                dangerouslySetInnerHTML={{ __html: "<style>[data-entra]{visibility:visible!important}</style>" }}
            />

            <Medicion />
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
