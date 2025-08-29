import "../../style.scss";

const municipio = "Valencia"; 
const urlCanonical = "https://www.ermo.es/servicios/web";
const ogImage = "https://www.ermo.es/seo/web-1200x630.jpg";

export const metadata = {

  //GENERIC
  title: `Diseñador web en ${municipio} | Diseño y programación a medida`,
  description: `Webs rápidas, optimizadas para SEO y con diseño a medida en ${municipio}. Sin plantillas pesadas. Casos reales y resultados medibles.`,
  keywords: [
  `hacer web ${municipio}`,
  `diseño web ${municipio}`,
  `desarrollo web ${municipio}`,
  `SEO web ${municipio}`,
  `programación web ${municipio}`,
],

  alternates: {
    canonical: urlCanonical,
  },

  // Open Graph META
  openGraph: {
    title: `Hacer web en ${municipio} | Diseño y desarrollo a medida`,
    description:
      `Webs rápidas, optimizadas para SEO y con UI/UX a medida en ${municipio}. Sin plantillas pesadas. Casos reales y resultados medibles.`,
    url: urlCanonical,
    type: "website",
    siteName: "ERMO",
    locale: "es_ES",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `Caso real: web Next.js optimizada para SEO en ${municipio}`,
      },
    ],
  },

  // Twitter / X 
  twitter: {
    card: "summary_large_image",
    title: `Hacer web en ${municipio} | Diseño y desarrollo a medida`,
    description:
      `Diseño y programación web con SEO en ${municipio}. Rápidas, optimizadas y orientadas a negocio.`,
    images: [ogImage],
  },


  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};




export default function WebLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
