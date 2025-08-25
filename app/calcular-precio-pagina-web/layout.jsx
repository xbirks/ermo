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
  tool: [{ "@type": "HowToTool", name: "Calculadora de precio web gratuita" }],
  step: [
    {
      "@type": "HowToStep",
      name: "Selecciona el tipo de web",
      text:
        "Elige entre corporativa, ecommerce, blog u otro proyecto según tus necesidades. Si no encuentras un encaje exacto, marca «Otros» y lo ajustamos en la llamada para cerrar el presupuesto. Así partimos del escalón correcto desde el principio.",
      image: "https://www.ermo.es/assets/tipoweb.png"
    },
    {
      "@type": "HowToStep",
      name: "Define el tamaño y el diseño",
      text:
        "Indica si tu web será pequeña, mediana o grande según el número de páginas que necesitas. Después, escoge la complejidad del diseño: básico para algo funcional y económico, intermedio si quieres más personalidad, o avanzado si buscas un resultado espectacular.",
      image: "https://www.ermo.es/assets/tamanositio.png"
    },
    {
      "@type": "HowToStep",
      name: "Añade funcionalidades y contenidos",
      text:
        "Activa lo que necesites: formularios, multiidioma, pasarela de pago, SEO, mantenimiento, redacción profesional, traducciones, iconografía propia, fotografía o incluso vídeo. Cada extra aporta valor y verás al instante cómo afecta al presupuesto.",
      image: "https://www.ermo.es/assets/funcionalidades.png"
    },
    {
      "@type": "HowToStep",
      name: "Activa el SEO que necesitas",
      text:
        "De base incluimos lo esencial para una web correcta a nivel SEO. Si quieres ir a por primeras posiciones, marca el SEO técnico avanzado y la optimización de contenidos. Es la diferencia entre estar y que te encuentren.",
      image: "https://www.ermo.es/assets/seoweb.png"
    },
    {
      "@type": "HowToStep",
      name: "Obtén tu presupuesto al instante",
      text:
        "La calculadora muestra un desglose actualizado en tiempo real con cada clic. Cuando lo tengas, descarga el PDF y envíamelo; lo revisamos juntos para afinar el alcance y darte un precio cerrado.",
      image: "https://www.ermo.es/assets/resumen.png"
    }
  ]
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
            "Lo que vemos con más frecuencia es un rango entre 800 y 1.500 €. Depende del alcance: número de páginas, funciones (blog, multiidioma, reservas), nivel de diseño y si añadimos contenidos, fotos o SEO avanzado. En resumen: cuanto más azúcar, más dulce.",
        },
      },
      {
        "@type": "Question",
        name: "¿En qué tecnología desarrolláis las webs?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Las tiendas online las desarrollamos en Shopify por su estabilidad, ecosistema de apps y checkout optimizado. El resto (corporativas, portfolios y landings) las hacemos con código para lograr más rendimiento, diseño a medida y mejores Core Web Vitals que las plantillas pesadas.",
        },
      },
      {
        "@type": "Question",
        name: "¿El precio incluye dominio y hosting?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Sí. Si no los tienes, los incluimos en el presupuesto y te asesoramos para elegir una opción rápida y segura. Preferimos proveedores con buen soporte y servidores en la UE para cumplir RGPD.",
        },
      },
      {
        "@type": "Question",
        name: "¿Necesito dejar datos para calcular el precio?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. La calculadora es gratuita y sin registro: ni correo ni teléfono. Buscamos transparencia real; pruebas la herramienta, comparas y, si te encaja, nos llamas o nos escribes por WhatsApp o email.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué plazos manejáis y cómo se trabaja?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Para una web corporativa sencilla, solemos estar entre 2 y 4 semanas. Si añadimos SEO avanzado, multiidioma o integraciones, el rango típico es 4–8 semanas. Trabajamos por fases: alcance, wireframe, diseño, contenidos, desarrollo, pruebas y publicación.",
        },
      },
      {
        "@type": "Question",
        name: "¿Ofrecéis mantenimiento y soporte?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Sí. Podemos encargarnos de actualizaciones, copias de seguridad, seguridad y pequeñas mejoras. Tenemos plan anual y bolsa de horas para que no tengas que preocuparte por el día a día técnico.",
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
