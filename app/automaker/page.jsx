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
const TITULO = "Automaker | Campañas semanales maquetadas en minutos";
const DESCRIPCION =
    "Entra el brief de una semana y salen todas las piezas en todos los formatos. Sin IA, respetando la identidad del cliente.";
const URL = "https://www.ermo.es/automaker";

// Vista previa al compartir (WhatsApp, LinkedIn, Slack…): sin esto se
// heredaba la de ERMO desde el layout. La imagen va en 1200×630.
const IMAGEN = {
    url: "https://www.ermo.es/landing/og-automaker.jpg",
    width: 1200,
    height: 630,
    alt: "Automaker: de un brief semanal a todas las piezas de la campaña en minutos.",
};

export const metadata = {
    title: TITULO,
    description: DESCRIPCION,
    alternates: { canonical: URL },
    openGraph: {
        title: TITULO,
        description: DESCRIPCION,
        url: URL,
        type: "website",
        siteName: "Automaker · ERMO",
        locale: "es_ES",
        images: [IMAGEN],
    },
    twitter: {
        card: "summary_large_image",
        title: TITULO,
        description: DESCRIPCION,
        images: [IMAGEN.url],
    },
    // Oculta a los buscadores hasta limpiar imágenes y textos de clientes.
    robots: { index: false, follow: false },
};

// Color de la barra de Safari (y Chrome en Android): el azul petróleo de
// la landing. El layout de ERMO fija otro; Medicion.jsx lo sustituye en
// esta ruta por si el navegador lee primero el del layout.
export const viewport = { themeColor: "#14394B" };

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
