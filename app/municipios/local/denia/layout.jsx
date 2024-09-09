import "@/app/style.scss";


const municipio = "Denia"; 

export const metadata = {
  title: `ERMO | Estudio de diseño gráfico en ${municipio}`,
  description: `Branding, ilustración, animación 2D/3D, diseño web y fotografía de producto en ${municipio}. Creatividad y compromiso.`,
  applicationName: 'ERMO',
  keywords: [
    `diseño gráfico en ${municipio}`, 
    `estudio de diseño gráfico en ${municipio}`, 
    `branding en ${municipio}`, 
    `ilustración en ${municipio}`, 
    `animación 2D en ${municipio}`, 
    `animación 3D en ${municipio}`, 
    `diseño web en ${municipio}`, 
    `fotografía de producto en ${municipio}`, 
    `diseñador gráfico en ${municipio}`,
    `creatividad en ${municipio}`, 
    `marketing digital en ${municipio}`, 
    `diseño de logos en ${municipio}`, 
    `identidad corporativa en ${municipio}`, 
    `diseño de interiores en ${municipio}`, 
    `diseño de packaging en ${municipio}`, 
    `diseño de folletos en ${municipio}`, 
    `diseño de carteles en ${municipio}`, 
    `desarrollo de marca en ${municipio}`, 
    `consultoría de diseño en ${municipio}`, 
    `diseñador gráfico ${municipio}`
  ],
  

  // META
  openGraph: {
    title: `ERMO | Estudio de diseño gráfico en ${municipio}`,
    description: `Estudio de diseño gráfico en ${municipio}: branding, ilustración, animación 2D/3D, diseño web y fotografía de producto.`,
    url: `https://ermo.es/municipios/local/${municipio}`,
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/meta-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: `Proyectos de diseño gráfico realizados por Ermo en ${municipio}.`,
      },
    ],
    site_name: `ERMO | Estudio de diseño gráfico en ${municipio}`,
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: `ERMO | Estudio de diseño gráfico en ${municipio}`,
    site: '@ermo.es',
    creator: '@ermo.es',
    title: `ERMO | Estudio de diseño gráfico en ${municipio}`,
    description: `Estudio de diseño gráfico en ${municipio}: branding, ilustración, animación 2D/3D, diseño web y fotografía de producto.`,
    image: 'https://ermo.es/seo/twitter-1200-600.jpg',
    imageAlt: `Proyectos de diseño gráfico realizados por Ermo en ${municipio}.`,
  },
 
};

export default function RootLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
