// app/(marketing)/cuanto-cuesta-hacer-una-pagina-web/layout.js
import "@/app/style.scss";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://www.ermo.es"),
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  title: "Calculadora de precios | ¿Cuánto cuesta hacer una página web?",
  description:
    "Precios reales para webs a medida (corporativa, portfolio, restaurante, e-commerce, reservas y landings). Calculadora gratuita y factores que suben o bajan el presupuesto.",
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
    canonical: "https://www.ermo.es/calcular-precio-pagina-web"
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
    title: "Calculadora de precios | ¿Cuánto cuesta hacer una página web?",
    description:
      "Desglose de precios, factores de coste y calculadora gratuita para estimar tu presupuesto web.",
    url: "https://www.ermo.es/calcular-precio-pagina-web",
    type: "article",
    siteName: "ERMO",
    locale: "es_ES",
    images: [
      {
        url: "https://www.ermo.es/seo/calculadora-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "¿Cuánto cuesta hacer una página web? (ERMO)"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de precios | ¿Cuánto cuesta hacer una página web?",
    description:
      "Consulta precios base, factores de coste y usa mi calculadora gratuita para tu presupuesto web.",
    images: ["https://www.ermo.es/seo/calculadora-1200x630.jpg"]
  },
  authors: [{ name: "ERMO" }],
  category: "Tecnología"
};

export default function PrecioWebLayout({ children }) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Calculadora de precios",
    description:
      "Precios base por tipo de web, factores que influyen en el presupuesto y calculadora online gratuita para estimar tu coste.",
    inLanguage: "es-ES",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.ermo.es/calcular-precio-pagina-web"
    },
    author: { "@type": "Organization", name: "ERMO" },
    publisher: {
      "@type": "Organization",
      name: "ERMO",
      logo: {
        "@type": "ImageObject",
        url: "https://www.ermo.es/seo/ermo.png"
      }
    },
    image: "https://www.ermo.es/seo/calculadora-1200x630.jpg",
    datePublished: "2025-08-28",
    dateModified: "2025-08-28"
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuánto cuesta hacer una página web?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Los proyectos más frecuentes se mueven entre 800 y 1.500 €. Depende de páginas, funcionalidades, nivel de diseño y si añadimos contenidos, fotos o SEO avanzado. La calculadora te da un importe orientativo al momento."
        }
      },
      {
        "@type": "Question",
        name: "¿En qué tecnología desarrolláis las webs?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Tiendas online en Shopify. El resto (corporativas, portfolios, landings) con React/Next.js, priorizando rendimiento y Core Web Vitals."
        }
      },
      {
        "@type": "Question",
        name: "¿El precio incluye dominio y hosting?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Si no los tienes, se incluyen en el presupuesto y se asesora la mejor opción con servidores en la UE para cumplir RGPD."
        }
      },
      {
        "@type": "Question",
        name: "¿Necesito dejar datos para calcular el precio?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. La calculadora es gratuita y sin registro: ni correo ni teléfono."
        }
      },
      {
        "@type": "Question",
        name: "¿Qué plazos manejáis y cómo se trabaja?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Web corporativa sencilla: 2–4 semanas; proyectos con SEO avanzado, multiidioma o integraciones: 4–8 semanas."
        }
      },
      {
        "@type": "Question",
        name: "¿Ofrecéis mantenimiento y soporte?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Sí: actualizaciones, copias, seguridad y mejoras. Plan anual y bolsa de horas."
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
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <main id="contenido" role="main">
        {children}
      </main>
    </>
  );
}
