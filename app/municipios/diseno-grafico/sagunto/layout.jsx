import "@/app/style.scss";

const municipio = "Sagunto";

export const metadata = {
  //GENERIC
  title: `Identidad corporativa y logotipos para empresas en ${municipio}`,
  description: `Otorgamos personalidad y estilo a la identidad visual de tu empresa en ${municipio}. Desde el logotipo, hasta el diseño sonoro o las animaciones. E incluso las fotos de tu equipo.`,
  keywords: [
    `branding para pequeñas empresas en ${municipio}`, 
    `diseño de logotipo para autónomos en ${municipio}`, 
    `identidad visual para empresas medianas en ${municipio}`, 
    `diseño sonoro para marcas en ${municipio}`, 
    `creación de animaciones para negocios locales en ${municipio}`, 
    `fotografía profesional de equipos en ${municipio}`, 
    `branding y diseño para electricistas en ${municipio}`, 
    `identidad corporativa para fontaneros en ${municipio}`, 
    `servicios de diseño gráfico para jardineros en ${municipio}`, 
    `branding efectivo para pequeñas empresas en ${municipio}`, 
    `desarrollo de identidad visual para autónomos en ${municipio}`, 
    `estrategias de marca para negocios emergentes en ${municipio}`, 
    `animaciones personalizadas para pymes en ${municipio}`, 
    `diseño de logotipos creativos para comerciantes en ${municipio}`, 
    `consultoría de branding para empresas de servicios en ${municipio}`, 
    `creación de identidad de marca para profesionales independientes en ${municipio}`, 
    `diseño de marca y sonido para tiendas locales en ${municipio}`, 
    `fotografía de equipo para startups en ${municipio}`, 
    `branding y diseño para negocios en sector servicios en ${municipio}`, 
    `identidad visual completa desde logotipo hasta animaciones en ${municipio}`
  ],

  // META 
  openGraph: {
    title: `Identidad corporativa y logotipos para empresas en ${municipio}`,
    description: `Otorgamos personalidad y estilo a la identidad visual de tu empresa ${municipio}. Desde el logotipo, hasta el diseño sonoro o las animaciones. E incluso las fotos de tu equipo.`,
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
    site_name: `Identidad corporativa y logotipos para empresas en ${municipio}`,
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: `Identidad corporativa y logotipos para empresas en ${municipio}`,
    site: '@ermo.es',
    creator: '@ermo.es',
    title: `Identidad corporativa y logotipos para empresas en ${municipio}`,
    description: `Otorgamos personalidad y estilo a la identidad visual de tu empresa  ${municipio}. Desde el logotipo, hasta el diseño sonoro o las animaciones. E incluso las fotos de tu equipo.`,
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
