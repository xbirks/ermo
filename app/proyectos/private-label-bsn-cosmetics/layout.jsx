import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'BSN Cosmetics | Fotografía de producto',
  description: 'Fotografía de producto para Private Label BSN Cosmetics realizada en 2023.',
  keywords: ['fotografía de cremas hidratantes', 'fotografía de productos de belleza', 'fotografía de cremas antiarrugas', 'fotografía de serums faciales', 'fotografía de productos antienvejecimiento', 'fotografía de tratamientos para la piel', 'fotografía de productos para el cuidado de la piel', 'fotografía de lociones corporales', 'fotografía de productos de cuidado facial', 'fotografía de mascarillas faciales', 'fotografía de exfoliantes de piel', 'fotografía de aceites esenciales', 'fotografía de productos para el acné', 'fotografía de kits de cuidado de la piel', 'fotografía de cosméticos naturales', 'fotografía de cremas para ojos', 'fotografía de bálsamos labiales', 'fotografía de productos de spa', 'fotografía de artículos de dermatología', 'fotografía de protectores solares']
  ,

  // META
  openGraph: {
    title: 'BSN Cosmetics | Fotografía de producto',
    description: 'Fotografía de producto para Private Label BSN Cosmetics realizada en 2023.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/bsn-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Diferentes proyectos hechos por el estudio Ermo. Fotografía, branding, web, 3D.',
      },
    ],
    site_name: 'BSN Cosmetics | Fotografía de producto',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'BSN Cosmetics | Fotografía de producto',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'BSN Cosmetics | Fotografía de producto',
    description: 'Fotografía de producto para Private Label BSN Cosmetics realizada en 2023.',
    image: 'https://ermo.es/seo/bsn-1200-600.jpg',
    imageAlt: 'Fotografía de producto para Private Label BSN Cosmetics realizada por Andrés Ortega Montoya.',
  },

 
  
};

export default function BsnLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}