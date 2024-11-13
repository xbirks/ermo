import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Delibreads | Fotografía gastronómica comercial',
  description: 'Animación en 2D para que Consum promocione sus frutas y verduras de temporada en las diferentes cadenas de televisión autonómicas como A Punt o 7TV',
  keywords: ['fotografía gastronómica Delibreads', 'tortillas Mercadona en recetas', 'videos para Reels y TikTok de Delibreads', 'fotografía de recetas con tortillas', 'Delibreads y Mercadona', 'fotografía comercial para Delibreads', 'recetas con tortillas de trigo', 'fotografía de platos Tex-Mex', 'videos cortos para redes sociales', 'fotografía de comida vegana', 'fotografía de postres con tortillas', 'producción de videos para Instagram y TikTok', 'marketing visual para productos de Mercadona', 'fotografía profesional de alimentos', 'Delibreads en recetas creativas']



  ,

  // META
  openGraph: {
    title: 'Delibreads | Fotografía gastronómica comercial',
    description: 'Proyecto de fotografía gastronómica comercial y videos de recetas para Delibreads, el distribuidor de tortillas de trigo de Mercadona.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/delibreads-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Proyecto de fotografía gastronómica comercial y videos de recetas para Delibreads, el distribuidor de tortillas de trigo de Mercadona.',
      },
    ],
    site_name: 'Delibreads | Fotografía gastronómica comercial',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Delibreads | Fotografía gastronómica comercial',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Delibreads | Fotografía gastronómica comercial',
    description: 'Proyecto de fotografía gastronómica comercial y videos de recetas para Delibreads, el distribuidor de tortillas de trigo de Mercadona.',
    image: 'https://ermo.es/seo/delibreads-1200-600.jpg',
    imageAlt: 'Proyecto de fotografía gastronómica comercial y videos de recetas para Delibreads, el distribuidor de tortillas de trigo de Mercadona.',
  },

 
  
};

export default function BsnLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}