// app/camara/layout.jsx
import "@/app/style.scss";
import Script from "next/script";

export const metadata = {
    metadataBase: new URL("https://www.ermo.es"),
    title: "Cámara con Filtro Rojo | ERMO",
    description:
        "Herramienta web gratuita que aplica un filtro rojo puro a la cámara de tu dispositivo para revelar mensajes ocultos o simular el efecto de un acetato rojo.",
    keywords: [
        "filtro rojo cámara",
        "cámara web filtro rojo",
        "revelar mensajes ocultos",
        "acetato rojo digital",
        "decodificador rojo",
        "filtro rojo online",
        "efecto accesibilidad rojo"
    ],
    alternates: {
        canonical: "https://www.ermo.es/camara"
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            maxSnippet: -1,
            maxImagePreview: "large",
            maxVideoPreview: -1
        }
    },
    openGraph: {
        title: "Cámara con Filtro Rojo | ERMO",
        description:
            "Usa tu móvil como un decodificador. Aplica un filtro rojo extremo a tu cámara para ocultar colores cálidos y leer mensajes secretos.",
        url: "https://www.ermo.es/camara",
        type: "website",
        siteName: "ERMO",
        locale: "es_ES",
        images: [
            {
                // Cambia esta URL por una imagen real tuya si tienes una miniatura para esta herramienta
                url: "https://www.ermo.es/seo/camara-filtro-rojo-1200x630.jpg",
                width: 1200,
                height: 630,
                alt: "Cámara web con filtro rojo digital (ERMO)"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Cámara con Filtro Rojo | ERMO",
        description:
            "Aplica un filtro rojo puro a la cámara de tu móvil directamente desde el navegador para revelar diseños ocultos.",
        images: ["https://www.ermo.es/seo/camara-filtro-rojo-1200x630.jpg"]
    },
    authors: [{ name: "ERMO" }],
    category: "Herramientas"
};

export default function CamaraLayout({ children }) {
    const softwareApp = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Cámara con Filtro Rojo",
        description:
            "Herramienta online que utiliza la cámara del dispositivo móvil o de escritorio aplicando un filtro SVG rojo puro para revelar mensajes ocultos o simular un acetato decodificador.",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Cualquiera con navegador moderno",
        url: "https://www.ermo.es/camara",
        author: { "@type": "Organization", name: "ERMO" },
        publisher: {
            "@type": "Organization",
            name: "ERMO",
            logo: {
                "@type": "ImageObject",
                url: "https://www.ermo.es/seo/ermo.png"
            }
        }
    };

    const faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "¿Para qué sirve esta cámara con filtro rojo?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text:
                        "Funciona como un acetato rojo digital. Al aplicarlo sobre la lente de tu cámara, neutraliza colores cálidos como el naranja o el amarillo, permitiendo revelar mensajes ocultos impresos en tonos azules o cian."
                }
            },
            {
                "@type": "Question",
                name: "¿Necesito instalar alguna aplicación?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text:
                        "No. Es una herramienta 100% web. Solo tienes que acceder a la página, aceptar los permisos de la cámara de tu navegador y empezará a funcionar al instante."
                }
            },
            {
                "@type": "Question",
                name: "¿Es seguro dar permisos a la cámara?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text:
                        "Sí, es totalmente seguro. El procesamiento de la imagen se realiza localmente en tu dispositivo. No grabamos, guardamos ni enviamos ningún vídeo o fotografía a nuestros servidores."
                }
            }
        ]
    };

    return (
        <>
            <Script
                id="ld-software"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
            />
            <Script
                id="ld-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
            />
            <a className="skip-link" href="#contenido">
                Saltar al contenido
            </a>
            <main id="contenido" role="main">
                {children}
            </main>
        </>
    );
}