import "@/app/style.scss";

const municipio = "Catarroja"; 

export const metadata = {

  //GENERIC
  title: `Hacemos webs, UI/UX y SEO para emprendedores y startups en ${municipio}`,
  description: `Somos diseñadores UI / UX y programadores especializados en React con Next.js. También podemos ofrecerte una web hecha con Wordpress para autogestionarla y SEO profesional en ${municipio}.`,
  keywords: [
    `diseño web para startups en ${municipio}`, 
    `UI/UX para emprendedores en ${municipio}`, 
    `desarrollo web y UI/UX para restaurantes en ${municipio}`, 
    `optimización SEO para sitios web de startups en ${municipio}`, 
    `programación web para emprendedores en el sector de restaurantes en ${municipio}`, 
    `soluciones de UI/UX para jardineros en ${municipio}`, 
    `diseño de sitios web para electricistas en ${municipio}`, 
    `servicios de programación web para fontaneros en ${municipio}`, 
    `desarrollo web optimizado para SEO en ${municipio}`, 
    `creación de UX para cerrajeros en ${municipio}`, 
    `estrategias de UI para mejorar la experiencia del cliente en restaurantes en ${municipio}`,
    `diseño web a medida para startups y pequeños negocios en ${municipio}`, 
    `programación web y UI/UX para mejorar la visibilidad online de oficios en ${municipio}`,
    `soluciones web completas para emprendedores en ${municipio}`, 
    `diseño UX para aplicaciones de gestión para restaurantes en ${municipio}`, 
    `servicios de programación y diseño web para fontaneros y electricistas en ${municipio}`,
    `implementación de UI/UX para mejorar la conversión en sitios de startups en ${municipio}`,
    `consultoría de UI/UX para startups tecnológicas en ${municipio}`, 
    `diseño web personalizado para cerrajeros y otros oficios en ${municipio}`,
    `mejora de la presencia online de emprendedores mediante SEO y diseño web en ${municipio}`,
  ],

  // META 
  openGraph: {
    title: `Hacemos webs, UI/UX y SEO para emprendedores y startups en ${municipio}`,
    description: `Somos diseñadores UI / UX y programadores especializados en React con Next.js. También podemos ofrecerte una web hecha con Wordpress para autogestionarla en ${municipio}.`,
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/web-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: `Página web de Gartalia Jardineros programada en Next.js por Andrés Ortega Montoya en ${municipio}`,
      },
    ],
    site_name: `Hacemos webs y UI / UX para emprendedores y startups en ${municipio}`,
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: `Hacemos webs, UI/UX y SEO para emprendedores y startups en ${municipio}`,
    site: '@ermo.es',
    creator: '@ermo.es',
    title: `Hacemos webs y UI / UX para emprendedores y startups en ${municipio}`,
    description: `Somos diseñadores UI / UX y programadores especializados en React con Next.js. También podemos ofrecerte una web hecha con Wordpress para autogestionarla en ${municipio}.`,
    image: 'https://ermo.es/seo/web-1200-600.jpg',
    imageAlt: `Página web de Gartalia Jardineros programada en Next.js por Andrés Ortega Montoya en ${municipio}`,
  },
};

export default function WebLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
