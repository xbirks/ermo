import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Política de privacidad | ERMO Estudio',
  description: 'Lee nuestra política de privacidad para conocer cómo recopilamos, utilizamos y protegemos tus datos personales. Nos comprometemos a garantizar la seguridad y confidencialidad de tu información.',
  keywords: ['política de privacidad', 'protección de datos personales', 'uso de datos personales', 'recopilación de datos en el sitio web', 'privacidad y seguridad', 'gestión de información personal', 'política de privacidad y cookies', 'tratamiento de datos personales', 'confidencialidad de datos', 'uso de información personal en la web']




  ,

  // META 
  openGraph: {
    title: 'Política de privacidad | ERMO Estudio',
    description: 'Lee nuestra política de privacidad para conocer cómo recopilamos, utilizamos y protegemos tus datos personales. Nos comprometemos a garantizar la seguridad y confidencialidad de tu información.',
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
    description: 'Lee nuestra política de privacidad para conocer cómo recopilamos, utilizamos y protegemos tus datos personales. Nos comprometemos a garantizar la seguridad y confidencialidad de tu información.',
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