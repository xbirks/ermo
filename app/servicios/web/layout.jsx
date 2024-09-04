import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Programación web, UI/UX y SEO para emprendedores y startups en Valencia',
  description: 'Somos diseñadores UI / UX y programadores especializados en React con Next.js. También podemos ofrecerte una web hecha con Wordpress para autogestionarla y SEO profesional.',
  keywords: ['diseño web para startups en Valencia', 'UI/UX para emprendedores en Valencia', 'desarrollo web y UI/UX para restaurantes en Valencia', 'optimización SEO para sitios web de startups', 'programación web para emprendedores en el sector de restaurantes', 'soluciones de UI/UX para jardineros en Valencia', 'diseño de sitios web para electricistas en Valencia', 'servicios de programación web para fontaneros', 'desarrollo web optimizado para SEO en Valencia', 'creación de UX para cerrajeros en Valencia', 'estrategias de UI para mejorar la experiencia del cliente en restaurantes', 'diseño web a medida para startups y pequeños negocios', 'programación web y UI/UX para mejorar la visibilidad online de oficios', 'soluciones web completas para emprendedores en Valencia', 'diseño UX para aplicaciones de gestión para restaurantes', 'servicios de programación y diseño web para fontaneros y electricistas', 'implementación de UI/UX para mejorar la conversión en sitios de startups', 'consultoría de UI/UX para startups tecnológicas en Valencia', 'diseño web personalizado para cerrajeros y otros oficios', 'mejora de la presencia online de emprendedores mediante SEO y diseño web']
  ,

  // META 
  openGraph: {
    title: 'Programación web, UI/UX y SEO para emprendedores y startups en Valencia',
    description: 'Somos diseñadores UI / UX y programadores especializados en React con Next.js. También podemos ofrecerte una web hecha con Wordpress para autogestionarla.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/web-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Página web de Gartalia Jardineros programada en Next.js por Andrés Ortega Montoya',
      },
    ],
    site_name: 'Programación web y UI / UX para emprendedores y startups en Valencia',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Programación web, UI/UX y SEO para emprendedores y startups en Valencia',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Programación web y UI / UX para emprendedores y startups en Valencia',
    description: 'Somos diseñadores UI / UX y programadores especializados en React con Next.js. También podemos ofrecerte una web hecha con Wordpress para autogestionarla.',
    image: 'https://ermo.es/seo/web-1200-600.jpg',
    imageAlt: 'Página web de Gartalia Jardineros programada en Next.js por Andrés Ortega Montoya',
  },

 
  
};

export default function WebLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}