import "@/app/style.scss";
import "./jardineria.scss";

export const metadata = {
  //GENERIC
  title: `Webs para jardineros que quieren ganar clientes - ERMO`,
  description: `Diseñamos tu web de jardinería para que te encuentren en Google y te llamen. Solo un jardinero por zona. Tú o tu competencia.`,
  keywords: 'web para jardineros, diseño web jardinería, página jardinero local, captar clientes jardinería, SEO jardinería autónomos',

  // META
  openGraph: {
    title: `Web para jardineros locales - Exclusividad por zona`,
    description: `Creamos tu web de jardinería para captar clientes en Google. Solo un jardinero por zona. Sin compartir clientes.`,
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/fotografia-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Web diseñada para jardineros locales por ERMO',
      },
    ],
    site_name: `Web para jardineros locales - ERMO`,
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'summary_large_image',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: `Web para jardineros locales - Exclusividad y SEO local`,
    description: `Página web para jardineros que quieren llamadas, no visitas. Solo uno por zona. Tú decides si eres tú o tu competencia.`,
    image: 'https://ermo.es/seo/fotografia-1200-600.jpg',
    imageAlt: 'Web diseñada por ERMO para jardineros locales',
  },
};

export default function FotografiaLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
