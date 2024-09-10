import "@/app/style.scss";

const municipio = "Almussafes"; 

export const metadata = {
  //GENERIC
  title: `Fotografía profesional para empresas en ${municipio}`,
  description: `Desde ERMO estudio ofrecemos el servicio de fotografía profesional enfocada a la gastronomía y a la fotografía de producto y de e-commerce en ${municipio}.`,
  keywords: [
    `fotografía de producto para comercio electrónico en ${municipio}`, 
    `fotografía gastronómica para restaurantes en ${municipio}`, 
    `sesiones de fotografía corporativa en ${municipio}`, 
    `fotografía de alimentos en ${municipio}`, 
    `fotografía profesional de restaurantes en ${municipio}`, 
    `fotografía de producto en estudio en ${municipio}`, 
    `fotografía para menús de restaurantes en ${municipio}`, 
    `fotografía corporativa para empresas en ${municipio}`, 
    `fotografía de producto para catálogos online en ${municipio}`, 
    `fotografía de eventos corporativos en ${municipio}`, 
    `fotografía de producto para marcas de moda en ${municipio}`, 
    `fotografía para identidad de marca de restaurantes en ${municipio}`, 
    `fotografía de interiores para negocios gastronómicos en ${municipio}`, 
    `servicios de fotografía para lanzamientos de productos en ${municipio}`, 
    `fotografía de producto para campañas publicitarias en ${municipio}`, 
    `sesiones de fotografía para equipos corporativos en ${municipio}`, 
    `fotografía de producto para sitios web de comercio en ${municipio}`, 
    `fotografía gastronómica para blogs culinarios en ${municipio}`, 
    `fotografía de producto para redes sociales en ${municipio}`, 
    `fotografía corporativa para comunicados de prensa en ${municipio}`, 
    `fotografía para Amazon en ${municipio}`, 
    `hacer fotos de mis productos para Amazon en ${municipio}`, 
    `fotografía de productos para Amazon en ${municipio}`, 
    `sesiones de fotos profesionales para Amazon en ${municipio}`, 
    `mejorar imágenes de productos para Amazon en ${municipio}`, 
    `servicio de fotografía para listados de Amazon en ${municipio}`, 
    `optimización de imágenes para ventas en Amazon en ${municipio}`, 
    `fotografía de alta calidad para productos en Amazon en ${municipio}`, 
    `capturar imágenes efectivas para Amazon en ${municipio}`, 
    `fotografía especializada para vendedores en Amazon en ${municipio}`, 
    `fotografía de productos para eBay en ${municipio}`, 
    `fotografía de productos para Etsy en ${municipio}`, 
    `fotografía profesional para Shopify en ${municipio}`, 
    `imágenes de productos para Alibaba en ${municipio}`, 
    `sesiones de fotos para MercadoLibre en ${municipio}`, 
    `fotografía de productos para Amazon en ${municipio}`, 
    `fotografía de productos para Walmart Marketplace en ${municipio}`, 
    `fotografía optimizada para tiendas online en ${municipio}`, 
    `servicios de fotografía para vendedores en eBay en ${municipio}`, 
    `fotografía de calidad para páginas de productos en Shopify en ${municipio}`
  ],

  // META
  openGraph: {
    title: `Fotografía profesional para empresas en ${municipio}`,
    description: `Desde ERMO estudio ofrecemos el servicio de fotografía profesional enfocada a la gastronomía y a la fotografía de producto y de e-commerce en ${municipio}.`,
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
    site_name: `Fotografía profesional para empresas en ${municipio}`,
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: `Fotografía profesional para empresas en ${municipio}`,
    site: '@ermo.es',
    creator: '@ermo.es',
    title: `Fotografía profesional para empresas en ${municipio}`,
    description: `Desde ERMO estudio ofrecemos el servicio de fotografía profesional enfocada a la gastronomía y a la fotografía de producto y de e-commerce en ${municipio}.`,
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
