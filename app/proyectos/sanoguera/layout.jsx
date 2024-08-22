import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Sanoguera | Programación web | Branding',
  description: 'Actualización de la identidad corporativa de la empresa, diseño y desarrollo de la página web de Sanoguera Consultoría.',
  keywords: ['diseño web para asesorías', 'UI/UX para sitios de consultoría', 'branding para consultorías legales', 'creación de logotipo para asesores', 'identidad corporativa para asesorías', 'programación web para servicios legales', 'diseño de interfaz para asesorías fiscales', 'experiencia de usuario para asesorías contables', 'soluciones digitales para consultorías', 'consultoría de marca para empresas', 'optimización web para asesores', 'diseño gráfico para asesores legales', 'estrategias de identidad visual', 'consultoría UX para asesorías fiscales', 'asesoría en diseño digital']

  ,

  // META
  openGraph: {
    title: 'Sanoguera | Programación web | Branding',
    description: 'Actualización de la identidad corporativa de la empresa, diseño y desarrollo de la página web de Sanoguera Consultoría.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/sanoguera-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Actualización de la identidad corporativa de la empresa, diseño y desarrollo de la página web de Sanoguera Consultoría.',
      },
    ],
    site_name: 'Sanoguera | Programación web | Branding',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Sanoguera | Programación web | Branding',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Sanoguera | Programación web | Branding',
    description: 'Actualización de la identidad corporativa de la empresa, diseño y desarrollo de la página web de Sanoguera Consultoría.',
    image: 'https://ermo.es/seo/sanoguera-1200-600.jpg',
    imageAlt: 'Actualización de la identidad corporativa de la empresa, diseño y desarrollo de la página web de Sanoguera Consultoría.',
  },

 
  
};

export default function SanogueraLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}