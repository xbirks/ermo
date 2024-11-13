import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Consum | Animación 2D para televisión',
  description: 'Animación en 2D para que Consum promocione sus frutas y verduras de temporada en las diferentes cadenas de televisión autonómicas como A Punt o 7TV',
  keywords: ['Animación 2D para televisión', 'Animación 2D para Consum', 'Promoción de frutas y verduras de temporada', 'Animación para cadenas autonómicas', 'Animación 2D en A Punt', 'Animación 2D en 7TV', 'Publicidad animada para televisión', 'Animación de productos para Consum', 'Campaña televisiva de Consum', 'Animación para promocionar frutas y verduras', 'Publicidad en televisión autonómica', 'Animación 2D para publicidad de alimentos', 'Spot publicitario animado para Consum', 'Promoción de productos de temporada en TV', 'Animación para promoción en A Punt y 7TV', 'Producción de animación 2D para televisión', 'Anuncios animados para Consum', 'Animación 2D para campañas de televisión', 'Publicidad de frutas y verduras en TV', 'Animación publicitaria para cadenas autonómicas']


  ,

  // META
  openGraph: {
    title: 'Consum | Animación 2D para televisión',
    description: 'Animación en 2D para que Consum promocione sus frutas y verduras de temporada en las diferentes cadenas de televisión autonómicas como A Punt o 7TV',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/consum-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Animación en 2D para que Consum promocione sus frutas y verduras de temporada en las diferentes cadenas de televisión autonómicas como A Punt o 7TV',
      },
    ],
    site_name: 'Consum | Animación 2D para televisión',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Consum | Animación 2D para televisión',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Consum | Animación 2D para televisión',
    description: 'Animación en 2D para que Consum promocione sus frutas y verduras de temporada en las diferentes cadenas de televisión autonómicas como A Punt o 7TV',
    image: 'https://ermo.es/seo/consum-1200-600.jpg',
    imageAlt: 'Animación en 2D para que Consum promocione sus frutas y verduras de temporada en las diferentes cadenas de televisión autonómicas como A Punt o 7TV.',
  },

 
  
};

export default function BsnLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}