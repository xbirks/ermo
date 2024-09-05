import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Servicios creativos digitales para empresas en Valencia',
  description: 'Ofrecemos servicios completos de diseño gráfico, branding, desarrollo web, y marketing digital en Valencia. Especialistas en animación 2D y 3D, creación de logotipos, identidad corporativa, y fotografía de producto para potenciar tu negocio.',
  keywords: ['servicios de diseño gráfico en Valencia', 'soluciones de branding y marketing digital', 'diseño web y desarrollo en Valencia', 'creación de logotipos y branding para empresas', 'animación 2D y 3D para proyectos visuales', 'ilustración y diseño gráfico personalizado', 'fotografía de producto y marketing visual', 'identidad corporativa y desarrollo de marca', 'consultoría de diseño para pequeñas empresas', 'diseño de interiores y espacios comerciales', 'estrategias de marketing digital en Valencia', 'diseño de packaging y material promocional', 'diseño gráfico y web para empresas en Valencia', 'creación de contenido visual y branding', 'servicios completos de identidad corporativa', 'fotografía y videografía para empresas', 'diseño gráfico y desarrollo de branding en Valencia', 'soluciones creativas de diseño gráfico', 'desarrollo de identidad visual y digital para empresas', 'consultoría y diseño integral para negocios']


  ,

  // META 
  openGraph: {
    title: 'Servicios creativos digitales para empresas en Valencia',
    description: 'Ofrecemos servicios completos de diseño gráfico, branding, desarrollo web, y marketing digital en Valencia. Especialistas en animación 2D y 3D, creación de logotipos, identidad corporativa, y fotografía de producto para potenciar tu negocio.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/meta-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Servicios creativos digitales para empresas en Valencia',
      },
    ],
    site_name: 'Servicios creativos digitales para empresas en Valencia',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Servicios creativos digitales para empresas en Valencia',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Servicios creativos digitales para empresas en Valencia',
    description: 'Ofrecemos servicios completos de diseño gráfico, branding, desarrollo web, y marketing digital en Valencia. Especialistas en animación 2D y 3D, creación de logotipos, identidad corporativa, y fotografía de producto para potenciar tu negocio.',
    image: 'https://ermo.es/seo/meta-1200-600.jpg',
    imageAlt: 'Servicios creativos digitales para empresas en Valencia',
  },

 
  
};

export default function ServiciosPrincipalLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}