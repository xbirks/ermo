import "@/app/style.scss";
import "./jardineria.scss";

export const metadata = {
  //GENERIC
  title: 'Hacer web para jardineros | Diseño y SEO local - ERMO',
  description: 'Hacemos tu web de jardinero para aparecer en Google y conseguir llamadas reales. Exclusividad por zona. Sin plantillas ni humo.',
  keywords: [
    'hacer web jardinero',
    'página web jardinería',
    'diseño web jardineros',
    'SEO jardinería',
    'web para jardineros',
    'crear web jardinero autónomo',
  ],
  alternates: {
    canonical: 'https://www.ermo.es/hacer-web-jardinero',
  },

  //META
  openGraph: {
    title: 'Hacer web para jardineros | Diseño y SEO local - ERMO',
    description: 'Webs para jardineros que generan llamadas. Exclusividad por zona y SEO local.',
    url: 'https://www.ermo.es/hacer-web-jardinero',
    type: 'website',
    images: [{ url: 'https://www.ermo.es/seo/jardineria-1200x630.jpg', width: 1200, height: 630, alt: 'Ejemplo de web para jardineros (ERMO)' }],
    siteName: 'ERMO',
    locale: 'es_ES',
  },

  //TWITTER
  twitter: {
    card: 'summary_large_image',
    title: 'Hacer web para jardineros | Diseño y SEO local - ERMO',
    description: 'Aparece en Google y capta clientes. Exclusividad por zona.',
    images: ['https://www.ermo.es/seo/jardineria-1200-600.jpg'],
  },
};




export default function FotografiaLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
