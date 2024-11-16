import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Helados Estiu | WaoMochi | Fotografía comercial',
  description: 'Fotografía comercial y de producto para la empresa Helados Estiu, proveedora de helados de Mercadona. Fotografía de mochis helados.',
  keywords: ['fotografía comercial para Helados Estiu', 
    'fotografía de producto Helados Estiu', 
    'fotografía de mochis helados', 
    'fotografía de helados para Mercadona', 
    'fotografía comercial de mochis', 
    'fotografía de producto para empresas de helados', 
    'fotos de mochis helados para Helados Estiu', 
    'fotografía de alimentos congelados', 
    'fotografía profesional de mochis', 
    'fotografía de producto WaoMochi', 
    'fotografía comercial WaoMochi', 
    'fotografía de producto para heladerías', 
    'fotografía publicitaria de mochis helados', 
    'fotografía comercial de alimentos congelados', 
    'fotos para Helados Estiu Mercadona', 
    'fotografía creativa de mochis helados', 
    'imágenes de mochis helados WaoMochi', 
    'fotografía de alimentos para Mercadona', 
    'fotografía comercial de postres congelados', 
    'fotografía de mochis helados Mercadona']


  ,

  // META
  openGraph: {
    title: 'Helados Estiu | WaoMochi | Fotografía comercial',
    description: 'Fotografía comercial y de producto para la empresa Helados Estiu, proveedora de helados de Mercadona. Fotografía de mochis helados.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/estiu-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Fotografía comercial y de producto para la empresa Helados Estiu, proveedora de helados de Mercadona. Fotografía de mochis helados.',
      },
    ],
    site_name: 'Helados Estiu | WaoMochi | Fotografía comercial',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Helados Estiu | WaoMochi | Fotografía comercial',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Helados Estiu | WaoMochi | Fotografía comercial',
    description: 'Fotografía comercial y de producto para la empresa Helados Estiu, proveedora de helados de Mercadona. Fotografía de mochis helados.',
    image: 'https://ermo.es/seo/estiu-1200-600.jpg',
    imageAlt: 'Fotografía comercial y de producto para la empresa Helados Estiu, proveedora de helados de Mercadona. Fotografía de mochis helados.',
  },

 
  
};

export default function BsnLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}