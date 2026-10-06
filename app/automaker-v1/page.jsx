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

// Versión anterior de la landing de Automaker (modelo de pago único de
// 6.000 €), archivada aquí el 6/10/2026 cuando la V3 pasó a /automaker.
// Sin Medicion.jsx a propósito: sus visitas no deben mezclarse con las
// estadísticas de la landing principal. La cabecera, el pie y el cursor de
// ERMO se quitan porque la ruta empieza por /automaker (ver
// components/cromo-publico.jsx).
const TITULO = "Automaker | Campañas semanales maquetadas en minutos";
const DESCRIPCION =
    "Entra el brief de una semana y salen todas las piezas en todos los formatos. Sin IA, respetando la identidad del cliente.";
const URL = "https://www.ermo.es/automaker-v1";

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
// la landing.
export const viewport = { themeColor: "#14394B" };

export default function PaginaAutomakerV1() {
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
