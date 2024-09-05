import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Nuestros proyectos creativos | ERMO estudio portfolio',
  description: 'Explora nuestro portafolio de diseño con proyectos para marcas como Consum y Procubitos Europe. Soluciones creativas y estratégicas para potenciar tu negocio.',
  keywords: ['proyectos de diseño gráfico para supermercados Consum', 'trabajos realizados para Procubitos Europe', 'branding y diseño para Cubers', 'proyectos de identidad visual para IceBalls', 'trabajos de diseño web para Sanoguera', 'branding y packaging para Private Label BSN', 'diseño gráfico para Empanadas Malvón', 'creación de identidad visual para Franuí', 'diseño de packaging para Delgo', 'proyectos de diseño para Delibreads', 'trabajos de branding para Helados Estiu', 'proyectos de diseño web para pequeñas empresas', 'trabajos de animación 2D para campañas publicitarias', 'ilustraciones para empresas del sector alimentario', 'creación de logotipos para empresas locales', 'proyectos de fotografía de producto para ecommerce', 'proyectos de identidad corporativa para pymes', 'trabajos realizados para marcas de alimentación', 'diseño gráfico y branding para empresas como Franuí y Delgo', 'proyectos de diseño gráfico para empresas de Valencia']



  ,

  // META 
  openGraph: {
    title: 'Nuestros proyectos creativos | ERMO estudio portfolio',
    description: 'Explora nuestro portafolio de diseño con proyectos para marcas como Consum y Procubitos Europe. Soluciones creativas y estratégicas para potenciar tu negocio.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/meta-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Nuestros proyectos creativos | ERMO estudio portfolio',
      },
    ],
    site_name: 'Nuestros proyectos creativos | ERMO estudio portfolio',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Nuestros proyectos creativos | ERMO estudio portfolio',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Nuestros proyectos creativos | ERMO estudio portfolio',
    description: 'Explora nuestro portafolio de diseño con proyectos para marcas como Consum y Procubitos Europe. Soluciones creativas y estratégicas para potenciar tu negocio.',
    image: 'https://ermo.es/seo/meta-1200-600.jpg',
    imageAlt: 'Nuestros proyectos creativos | ERMO estudio portfolio',
  },

 
  
};

export default function ProyectosPrincipalLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}