import "../../style.scss";

export const metadata = {
  metadataBase: new URL("https://www.ermo.es"),
  title: "Servicios: diseño web, SEO, animación e IA en Valencia | ERMO",
  description:
    "Accede a las landings de web a medida, SEO, animación 2D e imágenes con IA.",
  keywords: [
    "diseño web Valencia",
    "SEO Valencia",
    "animación 2D",
    "imágenes con IA",
    "branding",
  ],
  alternates: {
    canonical: "/servicios/principal",
  },
  openGraph: {
    title: "Servicios ERMO: web, SEO, animación e IA",
    description:
      "Página de servicios: web a medida, SEO, animación 2D e IA.",
    url: "https://www.ermo.es/servicios/principal",
    type: "website",
    siteName: "ERMO",
    locale: "es_ES",
    images: [
      {
        url: "/seo/meta-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Servicios ERMO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Servicios ERMO",
    description:
      "Acceso directo a web a medida, SEO, animación 2D e imágenes con IA.",
    images: ["/seo/meta-1200x630.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ServiciosPrincipalLayout({ children }) {
  return <main>{children}</main>;
}
