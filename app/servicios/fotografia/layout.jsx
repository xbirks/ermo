import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Fotografía profesional para empresas en Valencia',
  description: 'Desde ERMO estudio ofrecemos el servicio de fotografía profesional enfocada a la gastronomía y a la fotografía de producto y de e-commerce.',
  keywords: ['fotografía de producto para comercio electrónico', 'fotografía gastronómica para restaurantes', 'sesiones de fotografía corporativa', 'fotografía de alimentos en Valencia', 'fotografía profesional de restaurantes', 'fotografía de producto en estudio', 'fotografía para menús de restaurantes', 'fotografía corporativa para empresas', 'fotografía de producto para catálogos online', 'fotografía de eventos corporativos en Valencia', 'fotografía de producto para marcas de moda', 'fotografía para identidad de marca de restaurantes', 'fotografía de interiores para negocios gastronómicos', 'servicios de fotografía para lanzamientos de productos', 'fotografía de producto para campañas publicitarias', 'sesiones de fotografía para equipos corporativos', 'fotografía de producto para sitios web de comercio', 'fotografía gastronómica para blogs culinarios', 'fotografía de producto para redes sociales', 'fotografía corporativa para comunicados de prensa', 'fotografía para Amazon', 'hacer fotos de mis productos para Amazon', 'fotografía de productos para Amazon', 'sesiones de fotos profesionales para Amazon', 'mejorar imágenes de productos para Amazon', 'servicio de fotografía para listados de Amazon', 'optimización de imágenes para ventas en Amazon', 'fotografía de alta calidad para productos en Amazon', 'capturar imágenes efectivas para Amazon', 'fotografía especializada para vendedores en Amazon', 'fotografía de productos para eBay', 'fotografía de productos para Etsy', 'fotografía profesional para Shopify', 'imágenes de productos para Alibaba', 'sesiones de fotos para MercadoLibre', 'fotografía de productos para Amazon', 'fotografía de productos para Walmart Marketplace', 'fotografía optimizada para tiendas online', 'servicios de fotografía para vendedores en eBay', 'fotografía de calidad para páginas de productos en Shopify']


  ,

  // META
  openGraph: {
    title: 'Fotografía profesional para empresas en Valencia',
    description: 'Desde ERMO estudio ofrecemos el servicio de fotografía profesional enfocada a la gastronomía y a la fotografía de producto y de e-commerce.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/fotografia-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Fotografía de productos cosméticos sobre fondo gris neutro hecha por Andrés Ortega Montoya en ERMO estudio',
      },
    ],
    site_name: 'Fotografía profesional para empresas en Valencia',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Fotografía profesional para empresas en Valencia',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Fotografía profesional para empresas en Valencia',
    description: 'Desde ERMO estudio ofrecemos el servicio de fotografía profesional enfocada a la gastronomía y a la fotografía de producto y de e-commerce.',
    image: 'https://ermo.es/seo/fotografia-1200-600.jpg',
    imageAlt: 'Fotografía de productos cosméticos sobre fondo gris neutro hecha por Andrés Ortega Montoya en ERMO estudio',
  },

 
  
};

export default function FotografiaLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}