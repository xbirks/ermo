import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Política de privacidad | ERMO Estudio',
  description: 'Qué datos personales trata ERMO, para qué, con qué base legal, durante cuánto tiempo, con quién los comparte y cómo ejercer tus derechos.',
  keywords: ['política de privacidad', 'protección de datos personales', 'uso de datos personales', 'recopilación de datos en el sitio web', 'privacidad y seguridad', 'gestión de información personal', 'política de privacidad y cookies', 'tratamiento de datos personales', 'confidencialidad de datos', 'uso de información personal en la web']




  ,

  // META 
  openGraph: {
    title: 'Política de privacidad | ERMO Estudio',
    description: 'Qué datos personales trata ERMO, para qué, con qué base legal, durante cuánto tiempo, con quién los comparte y cómo ejercer tus derechos.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/meta-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Política de privacidad | ERMO Estudio',
      },
    ],
    site_name: 'Política de privacidad | ERMO Estudio',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Política de privacidad | ERMO Estudio',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Política de privacidad | ERMO Estudio',
    description: 'Qué datos personales trata ERMO, para qué, con qué base legal, durante cuánto tiempo, con quién los comparte y cómo ejercer tus derechos.',
    image: 'https://ermo.es/seo/meta-1200-600.jpg',
    imageAlt: 'Política de privacidad | ERMO Estudio',
  },

 
  
};

export default function ServiciosPrincipalLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}