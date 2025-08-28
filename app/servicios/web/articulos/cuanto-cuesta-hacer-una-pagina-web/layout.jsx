import "@/app/style.scss";
import Script from "next/script";

export const metadata = {
  // BASE
  metadataBase: new URL("https://www.ermo.es"),

  // SEO
  title: "¿Cuánto cuesta hacer una página web conmigo? | Calculadora y precios claros",
  description:
    "Precios reales para webs hechas a medida: corporativa, portfolio, restaurante, e-commerce, reservas y landings. Calculadora gratuita y factores que suben o bajan el presupuesto.",
  keywords: [
    "cuánto cuesta hacer una página web",
    "precio página web",
    "tarifas diseño web",
    "presupuesto web online",
    "precio web corporativa",
    "precio ecommerce",
    "diseño web profesional",
    "React Next.js desarrollo web"
  ],
  alternates: {
    canonical: "https://www.ermo.es/cuanto-cuesta-hacer-una-pagina-web",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },

  // OPEN GRAPH
  openGraph: {
    title: "¿Cuánto cuesta hacer una página web conmigo? | Precios y calculadora",
    description:
      "Desglose de precios, factores de coste y calculadora gratuita para saber cuánto te costaría tu web conmigo.",
    url: "https://www.ermo.es/cuanto-cuesta-hacer-una-pagina-web",
    type: "article",
    siteName: "ERMO",
    locale: "es_ES",
    images: [
      {
        url: "https://www.ermo.es/seo/cuanto-cuesta-una-web-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "¿Cuánto cuesta hacer una página web? (ERMO)",
      },
    ],
  },

  // TWITTER
  twitter: {
    card: "summary_large_image",
    title: "¿Cuánto cuesta hacer una página web conmigo? | Precios y calculadora",
    description:
      "Consulta precios base, factores de coste y usa mi calculadora gratuita para tu presupuesto web.",
    images: ["https://www.ermo.es/seo/cuanto-cuesta-una-web-1200x630.jpg"],
  },
};

export default function PrecioWebLayout({ children }) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "¿Cuánto cuesta hacer una página web conmigo?",
    description:
      "Precios base por tipo de web, factores que influyen en el presupuesto y calculadora online gratuita para estimar tu coste.",
    inLanguage: "es-ES",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.ermo.es/cuanto-cuesta-hacer-una-pagina-web"
    },
    author: { "@type": "Organization", name: "ERMO" },
    publisher: {
      "@type": "Organization",
      name: "ERMO",
      logo: {
        "@type": "ImageObject",
        url: "https://www.ermo.es/seo/logo-ermo-600x600.png"
      }
    },
    image: "https://www.ermo.es/seo/cuanto-cuesta-una-web-1200x630.jpg",
    datePublished: "2025-08-28",
    dateModified: "2025-08-28"
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuál es el precio medio de una página web conmigo?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Depende del alcance, pero el rango que más veo para una web profesional está entre 500 € y 1.500 €. Tienda online o reservas suben más. En mi calculadora gratuita puedes ver tu caso en segundos."
        }
      },
      {
        "@type": "Question",
        name: "¿Qué incluye el precio base?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Diseño a medida, desarrollo con foco en rendimiento, estructura SEO básica y optimización de velocidad. Redacción, fotografía, multiidioma y mantenimiento se presupuestan aparte según necesidad."
        }
      },
      {
        "@type": "Question",
        name: "¿Qué factores hacen subir o bajar el presupuesto?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Número de páginas, tipo y calidad del contenido (texto, fotos, vídeo), idiomas, nivel de diseño y funcionalidades (blog, e-commerce, reservas). También el mantenimiento que quieras después del lanzamiento."
        }
      },
      {
        "@type": "Question",
        name: "¿Por qué no trabajas con plantillas de WordPress baratas?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Porque plantilla + plugins no es desarrollo profesional y suele terminar en webs lentas, inseguras y clónicas. Yo trabajo con React y Next.js para darte una web rápida, segura, única y escalable."
        }
      },
      {
        "@type": "Question",
        name: "¿Cuánto tardas en entregar una web?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Con contenido listo, entre 2 y 4 semanas para una corporativa. Si añadimos multiidioma, SEO avanzado o integraciones, puede irse a 4–8 semanas."
        }
      },
      {
        "@type": "Question",
        name: "¿Ofreces mantenimiento?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Sí. Desde hosting y copias de seguridad hasta actualizaciones, seguridad y pequeñas mejoras. Tengo planes mensuales y bolsa de horas para que te olvides del día a día técnico."
        }
      },
      {
        "@type": "Question",
        name: "¿Dónde puedo calcular mi presupuesto ahora mismo?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "En mi calculadora online gratuita, sin registro y con desglose por partidas. La tienes enlazada en el artículo."
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <main>{children}</main>
    </>
  );
}
