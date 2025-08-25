import "@/app/style.scss";
import Script from "next/script";

export const metadata = {
  // BASE
  metadataBase: new URL("https://www.ermo.es"),
  // SEO
  title: "Calcular precio página web GRATIS – Presupuesto online inmediato",
  description:
    "Calcula online el precio de tu página web con una herramienta transparente: sin correo ni teléfono, resultado inmediato y desglose por partidas.",
  keywords: [
    "calcular precio página web",
    "presupuesto página web online",
    "cuánto cuesta una página web",
    "calculadora precio web",
    "precio web corporativa",
    "precio ecommerce",
  ],
  alternates: {
    canonical: "https://www.ermo.es/calcular-precio-pagina-web",
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
    title: "Calcular precio página web – Presupuesto online inmediato",
    description:
      "Calcula el precio de tu web en segundos. Sin datos personales. Desglose claro y opción de descargar PDF.",
    url: "https://www.ermo.es/calcular-precio-pagina-web",
    type: "website",
    siteName: "ERMO",
    locale: "es_ES",
    images: [
      {
        url: "https://www.ermo.es/seo/calculadora-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Calculadora de precio de página web (ERMO)",
      },
    ],
  },
  // TWITTER
  twitter: {
    card: "summary_large_image",
    title: "Calcular precio página web – Presupuesto online inmediato",
    description:
      "Herramienta transparente para calcular el precio de tu web. Sin formularios, resultado al instante.",
    images: ["https://www.ermo.es/seo/calculadora-1200x630.jpg"],
  },
};

export default function FotografiaLayout({ children }) {
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo calcular el precio de una página web",
    description:
      "Guía paso a paso para calcular online el precio de tu página web con una herramienta gratuita y transparente.",
    totalTime: "PT2M",
    supply: [{ "@type": "HowToSupply", name: "Acceso a Internet" }],
    tool: [{ "@type": "HowToTool", name: "Calculadora de precio web online" }],
    step: [
      {
        "@type": "HowToStep",
        name: "Selecciona el tipo de web",
        text:
          "Elige entre corporativa, ecommerce, blog u otro proyecto según tus necesidades.",
        image: "https://www.ermo.es/seo/paso1.jpg",
      },
      {
        "@type": "HowToStep",
        name: "Añade funcionalidades",
        text:
          "Incluye formularios, multiidioma, pasarela de pago, SEO, mantenimiento y otras opciones.",
        image: "https://www.ermo.es/seo/paso2.jpg",
      },
      {
        "@type": "HowToStep",
        name: "Obtén el presupuesto instantáneo",
        text:
          "Verás el desglose por partidas y el total. Puedes descargar un PDF con tu estimación.",
        image: "https://www.ermo.es/seo/paso3.jpg",
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿La calculadora es gratuita y sin registro?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Sí. No pedimos correo ni teléfono. Obtienes tu estimación al instante con desglose por partidas.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué factores influyen en el precio de una web?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "El tipo de web, número de páginas, funcionalidades (tienda, multiidioma, blog), diseño a medida, SEO y mantenimiento.",
        },
      },
      {
        "@type": "Question",
        name: "¿Los precios incluyen hosting y dominio?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Puedes incluirlos como partidas opcionales. La calculadora muestra el impacto en el total.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo descargar el presupuesto en PDF?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Sí. Tras calcular, podrás descargar un PDF con el detalle para guardarlo o compartirlo.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="ld-howto"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
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

