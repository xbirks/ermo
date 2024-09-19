import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Hacemos logotipos y brandings para empresas en Valencia',
  description: 'Otorgamos personalidad y estilo a la identidad visual de tu empresa. Desde el logotipo, hasta el diseño sonoro o las animaciones. E incluso las fotos de tu equipo.',
  keywords: ['branding para pequeñas empresas en Valencia', 'diseño de logotipo para autónomos en Valencia', 'identidad visual para empresas medianas', 'diseño sonoro para marcas en Valencia', 'creación de animaciones para negocios locales', 'fotografía profesional de equipos en Valencia', 'branding y diseño para electricistas en Valencia', 'identidad corporativa para fontaneros', 'servicios de diseño gráfico para jardineros', 'branding efectivo para pequeñas empresas', 'desarrollo de identidad visual para autónomos', 'estrategias de marca para negocios emergentes en Valencia', 'animaciones personalizadas para pymes', 'diseño de logotipos creativos para comerciantes', 'consultoría de branding para empresas de servicios en Valencia', 'creación de identidad de marca para profesionales independientes', 'diseño de marca y sonido para tiendas locales', 'fotografía de equipo para startups en Valencia', 'branding y diseño para negocios en sector servicios', 'identidad visual completa desde logotipo hasta animaciones']

  ,

  // META 
  openGraph: {
    title: 'Hacemos logotipos y brandings para empresas en Valencia',
    description: 'Otorgamos personalidad y estilo a la identidad visual de tu empresa. Desde el logotipo, hasta el diseño sonoro o las animaciones. E incluso las fotos de tu equipo.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/branding-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Diferentes logotipos diseñados por Andrés Ortega Montoya en ERMO Estudio. Logotipos de Sanoguera Consulting, Gartalia Jardineros y Valencia Dance Festival',
      },
    ],
    site_name: 'Hacemos logotipos y brandings para empresas en Valencia',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Hacemos logotipos y brandings para empresas en Valencia',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Hacemos logotipos y brandings para empresas en Valencia',
    description: 'Otorgamos personalidad y estilo a la identidad visual de tu empresa. Desde el logotipo, hasta el diseño sonoro o las animaciones. E incluso las fotos de tu equipo.',
    image: 'https://ermo.es/seo/branding-1200-600.jpg',
    imageAlt: 'Diferentes logotipos diseñados por Andrés Ortega Montoya en ERMO Estudio. Logotipos de Sanoguera Consulting, Gartalia Jardineros y Valencia Dance Festival',
  },

 
  
};

export default function BrandingLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}