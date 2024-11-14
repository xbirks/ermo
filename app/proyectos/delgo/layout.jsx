import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Delgo | Fotografía de arquitectura',
  description: 'Sesión de fotografía de arquitectura e interiorismo para la empresa logística Delgo.',
  keywords: ['fotografía de arquitectura para Delgo', 'fotografía de interiorismo para empresas logísticas', 'fotografía profesional de arquitectura', 'sesión de fotos de arquitectura e interiorismo', 'fotografía de espacios para Delgo', 'fotografía de interiores para empresas', 'fotografía comercial de arquitectura', 'fotografía de arquitectura para empresas logísticas', 'fotografía de edificios para Delgo', 'fotografía de interiorismo profesional', 'fotos de arquitectura para compañías logísticas', 'fotografía arquitectónica para Delgo', 'fotografía de interiorismo comercial', 'fotografía de arquitectura e interiores', 'servicios de fotografía de arquitectura', 'fotografía de instalaciones logísticas', 'sesión de fotografía para Delgo', 'imágenes de arquitectura e interiorismo', 'fotografía de espacios interiores para empresas']



  ,

  // META
  openGraph: {
    title: 'Delgo | Fotografía de arquitectura',
    description: 'Sesión de fotografía de arquitectura e interiorismo para la empresa logística Delgo.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/delgo-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Sesión de fotografía de arquitectura e interiorismo para la empresa logística Delgo.',
      },
    ],
    site_name: 'Delgo | Fotografía de arquitectura',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Delgo | Fotografía de arquitectura',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Delgo | Fotografía de arquitectura',
    description: 'Sesión de fotografía de arquitectura e interiorismo para la empresa logística Delgo.',
    image: 'https://ermo.es/seo/delgo-1200-600.jpg',
    imageAlt: 'Sesión de fotografía de arquitectura e interiorismo para la empresa logística Delgo.',
  },

 
  
};

export default function BsnLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}