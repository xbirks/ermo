import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Política de cookies | ERMO Estudio',
  description: 'Consulta nuestra política de cookies para entender cómo utilizamos las cookies en nuestro sitio web y cómo puedes gestionar tus preferencias de navegación. Garantizamos la protección de tu privacidad online.',
  keywords: ['política de cookies', 'uso de cookies en el sitio web', 'gestión de cookies', 'cookies y privacidad', 'configuración de cookies', 'tipos de cookies utilizadas', 'control de cookies en la web', 'funcionamiento de las cookies', 'cookies de terceros', 'preferencias de cookies y privacidad']





  ,

  // META 
  openGraph: {
    title: 'Política de cookies | ERMO Estudio',
    description: 'Consulta nuestra política de cookies para entender cómo utilizamos las cookies en nuestro sitio web y cómo puedes gestionar tus preferencias de navegación. Garantizamos la protección de tu privacidad online.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/meta-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Política de cookies | ERMO Estudio',
      },
    ],
    site_name: 'Política de cookies | ERMO Estudio',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Política de cookies | ERMO Estudio',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Política de cookies | ERMO Estudio',
    description: 'Consulta nuestra política de cookies para entender cómo utilizamos las cookies en nuestro sitio web y cómo puedes gestionar tus preferencias de navegación. Garantizamos la protección de tu privacidad online.',
    image: 'https://ermo.es/seo/meta-1200-600.jpg',
    imageAlt: 'Política de cookies | ERMO Estudio',
  },

 
  
};

export default function ServiciosPrincipalLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}