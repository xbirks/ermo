import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Aviso legal | ERMO Estudio',
  description: 'Consulta el aviso legal de nuestra web, donde detallamos la información sobre el uso de datos, propiedad intelectual, y los términos y condiciones que rigen el acceso y uso de nuestros servicios.',
  keywords: ['aviso legal', 'términos y condiciones', 'política de privacidad', 'uso de datos personales', 'propiedad intelectual', 'aviso legal sitio web', 'términos de uso', 'información legal y privacidad', 'aviso legal y protección de datos', 'uso de cookies y datos personales']



  ,

  // META 
  openGraph: {
    title: 'Aviso legal | ERMO Estudio',
    description: 'Consulta el aviso legal de nuestra web, donde detallamos la información sobre el uso de datos, propiedad intelectual, y los términos y condiciones que rigen el acceso y uso de nuestros servicios.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/meta-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Aviso legal | ERMO Estudio',
      },
    ],
    site_name: 'Aviso legal | ERMO Estudio',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Aviso legal | ERMO Estudio',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Aviso legal | ERMO Estudio',
    description: 'Consulta el aviso legal de nuestra web, donde detallamos la información sobre el uso de datos, propiedad intelectual, y los términos y condiciones que rigen el acceso y uso de nuestros servicios.',
    image: 'https://ermo.es/seo/meta-1200-600.jpg',
    imageAlt: 'Aviso legal | ERMO Estudio',
  },

 
  
};

export default function ServiciosPrincipalLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}