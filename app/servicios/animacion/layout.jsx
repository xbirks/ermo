import "../../style.scss"; 


export const metadata = {

  //GENERIC
  title: 'Animación 2D y motion graphics en Valencia para emprendedores y empresas',
  description: 'Hacemos animaciones visuales, claras y atractivas que captarán la atención del espectador e impactarán en tu audiencia.',
  keywords: ['animación 2D con After Effects para logotipos en Valencia', 'creación de motion graphics para Reels de Instagram', 'diseño de animaciones para presentaciones de producto en YouTube', 'desarrollo de videotutoriales con animación 2D', 'creación de cursos online con motion graphics', 'producción de infoproductos animados en After Effects', 'animación 2D para mejorar la identidad visual en Valencia', 'servicios de motion graphics para empresas en YouTube', 'diseño de animaciones para presentaciones corporativas', 'personalización de logotipos con animación 2D', 'creación de reels de Instagram usando motion graphics', 'desarrollo de contenidos animados para cursos de formación', 'animación 2D y motion graphics para campañas publicitarias', 'elaboración de videotutoriales en After Effects', 'uso de animación 2D en infoproductos y cursos online', 'servicios profesionales de animación en Valencia', 'creación de contenidos visuales animados para YouTube', 'motion graphics para explicar servicios y productos', 'técnicas avanzadas en After Effects para animación 2D', 'estrategias de marketing visual con motion graphics']

  ,

  // META 
  openGraph: {
    title: 'Animación 2D y motion graphics en Valencia para emprendedores y empresas',
    description: 'Hacemos animaciones visuales, claras y atractivas que captarán la atención del espectador e impactarán en tu audiencia.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/animacion-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Animación de entrada para la empresa Supermercados Consum que ha sido proyectada en Á Punt Televisió Valenciana animado por Andrés Ortega Montoya',
      },
    ],
    site_name: 'Animación 2D y motion graphics en Valencia para emprendedores y empresas',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Programación web, UI/UX y SEO para emprendedores y startups en Valencia',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Animación 2D y motion graphics en Valencia para emprendedores y empresas',
    description: 'Hacemos animaciones visuales, claras y atractivas que captarán la atención del espectador e impactarán en tu audiencia.',
    image: 'https://ermo.es/seo/animacion-1200-600.jpg',
    imageAlt: 'Animación de entrada para la empresa Supermercados Consum que ha sido proyectada en Á Punt Televisió Valenciana animado por Andrés Ortega Montoya',
  },

 
  
};

export default function AnimacionLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}