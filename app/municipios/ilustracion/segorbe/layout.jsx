import "@/app/style.scss";

const municipio = "Segorbe"; 

export const metadata = {

  //GENERIC
  title: `Ilustradores creativos en ${municipio}: personajes y conceptos visuales`,
  description: `Ilustramos con diversas técnicas que nos permiten ofrecer soluciones artísticas diferentes. Desde publicidad hasta campañas para ayuntamientos y entes públicos en ${municipio}.`,
  keywords: [
    `ilustradores en ${municipio}`, 
    `ilustración de personajes en ${municipio}`, 
    `creación de conceptos visuales 3D en ${municipio}`,
    `ilustradores para ayuntamientos y entes públicos en ${municipio}`,
    `arte realista para restaurantes en ${municipio}`, 
    `ilustración abstracta en ${municipio}`, 
    `retratos personalizados por ilustradores en ${municipio}`, 
    `ilustración de comida para menús y marketing en ${municipio}`,
    `diseño de personajes 3D para videojuegos en ${municipio}`,
    `ilustradores de conceptos para eventos culturales en ${municipio}`,
    `arte visual para proyectos públicos en ${municipio}`, 
    `creación de murales realistas para espacios urbanos en ${municipio}`, 
    `servicios de ilustración abstracta para decoración de interiores en ${municipio}`,
    `ilustradores de retratos para proyectos personales en ${municipio}`,
    `arte conceptual para libros y publicaciones en ${municipio}`,
    `ilustración temática de comida para restaurantes en ${municipio}`,
    `personajes ilustrados para campañas de marketing en ${municipio}`,
    `ilustradores freelance para entes culturales en ${municipio}`,
    `diseño de personajes y escenarios para animación en ${municipio}`,
    `creativos visuales para publicidad en ${municipio}`,
  ],

  // META 
  openGraph: {
    title: `Ilustradores creativos en ${municipio}: personajes y conceptos visuales`,
    description: `Ilustramos con diversas técnicas que nos permiten ofrecer soluciones artísticas diferentes. Desde publicidad hasta campañas para ayuntamientos y entes públicos en ${municipio}.`,
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/ilustracion-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: `Ilustración digital de dos granadas rojas con pepitas sobre fondo azul dibujada por Sara Ortega Montoya en ${municipio}`,
      },
    ],
    site_name: `Ilustradores creativos en ${municipio}: personajes y conceptos visuales`,
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: `Ilustradores creativos en ${municipio}: personajes y conceptos visuales`,
    site: '@ermo.es',
    creator: '@ermo.es',
    title: `Ilustradores creativos en ${municipio}: personajes y conceptos visuales`,
    description: `Ilustramos con diversas técnicas que nos permite ofrecer soluciones artísticas diferentes. Desde publicidad hasta campañas para ayuntamientos y entes públicos en ${municipio}.`,
    image: 'https://ermo.es/seo/ilustracion-1200-600.jpg',
    imageAlt: `Ilustración digital de dos granadas rojas con pepitas sobre fondo azul dibujada por Sara Ortega Montoya en ${municipio}`,
  },
};

export default function IlustracionLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
