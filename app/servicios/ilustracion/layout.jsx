import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Ilustradores creativos en Valencia: personajes y conceptos visuales',
  description: 'Ilustramos con diversas técnicas que nos permiten ofrecer soluciones artísticas diferentes. Desde publicidad hasta campañas para ayuntamientos y entes públicos.',
  keywords: ['ilustradores en Valencia', 'ilustración de personajes en Valencia', 'creación de conceptos visuales 3D', 'ilustradores para ayuntamientos y entes públicos', 'arte realista para restaurantes en Valencia', 'ilustración abstracta en Valencia', 'retratos personalizados por ilustradores en Valencia', 'ilustración de comida para menús y marketing', 'diseño de personajes 3D para videojuegos', 'ilustradores de conceptos para eventos culturales', 'arte visual para proyectos públicos en Valencia', 'creación de murales realistas para espacios urbanos', 'servicios de ilustración abstracta para decoración de interiores', 'ilustradores de retratos para proyectos personales', 'arte conceptual para libros y publicaciones', 'ilustración temática de comida para restaurantes', 'personajes ilustrados para campañas de marketing', 'ilustradores freelance para entes culturales', 'diseño de personajes y escenarios para animación', 'creativos visuales para publicidad en Valencia']

  ,

  // META 
  openGraph: {
    title: 'Ilustradores creativos en Valencia: personajes y conceptos visuales',
    description: 'Ilustramos con diversas técnicas que nos permiten ofrecer soluciones artísticas diferentes. Desde publicidad hasta campañas para ayuntamientos y entes públicos.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/ilustracion-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Ilustración digital de dos granadas rojas con pepitas sobre fondo azul dibujada por Sara Ortega Montoya',
      },
    ],
    site_name: 'Ilustradores creativos en Valencia: personajes y conceptos visuales',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Ilustradores creativos en Valencia: personajes y conceptos visuales',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Ilustradores creativos en Valencia: personajes y conceptos visuales',
    description: 'Ilustramos con diversas técnicas que nos permite ofrecer soluciones artísticas diferentes. Desde publicidad hasta campañas para ayuntamientos y entes públicos.',
    image: 'https://ermo.es/seo/ilustracion-1200-600.jpg',
    imageAlt: 'Ilustración digital de dos granadas rojas con pepitas sobre fondo azul dibujada por Sara Ortega Montoya',
  },

 
  
};

export default function FotografiaLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}