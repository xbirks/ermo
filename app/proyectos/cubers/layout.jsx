import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'IceBalls by Cubers | Fotografía de producto',
  description: 'Fotografía de producto para IceBalls by Cubers hechas en 2023.',
  keywords: ['fotografía de producto de hielo', 'fotografía de IceBalls de Cubers', 'fotografía de hielo para restaurantes', 'fotografía de cubitos de hielo', 'fotografía de producto para ProCubitos Europe', 'fotografía de hielo en Valencia', 'fotografía de productos de restauración', 'fotografía de cubitos de hielo IceBalls', 'fotografía profesional de hielo', 'fotografía de hielo en bares y restaurantes', 'fotografía de producto para empresas de restauración', 'fotografía de producto para Cubers', 'fotografía de productos de hostelería', 'fotos para ProCubitos Europe', 'fotografía creativa de hielo', 'fotografía comercial para productos de hielo', 'fotografía publicitaria de cubitos de hielo', 'fotografía de alimentos congelados para restaurantes', 'fotografía de producto para empresas de hielo', 'fotos de producto para IceBalls de ProCubitos Europe']

  ,

  // META
  openGraph: {
    title: 'IceBalls by Cubers | Fotografía de producto',
    description: 'Fotografía de producto para IceBalls by Cubers hechas en 2023.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/cubers-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Fotografía de producto para IceBalls by Cubers hechas en 2023.',
      },
    ],
    site_name: 'IceBalls by Cubers | Fotografía de producto',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'IceBalls by Cubers | Fotografía de producto',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'IceBalls by Cubers | Fotografía de producto',
    description: 'Fotografía de producto para IceBalls by Cubers hechas en 2023.',
    image: 'https://ermo.es/seo/cubers-1200-600.jpg',
    imageAlt: 'Fotografía de producto para IceBalls by Cubers hechas en 2023 por Andrés Ortega Montoya.',
  },

 
  
};

export default function BsnLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}