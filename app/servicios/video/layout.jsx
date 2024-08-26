import "../../style.scss";


export const metadata = {

  //GENERIC
  title: 'Grabación de video comercial y educativo para empresas en Valencia',
  description: 'Grabamos y editamos potentes clips de video que te ayudarán a dar a conocer tu producto o a enseñar a tus potenciales clientes los beneficios de tus servicios.',
  keywords: ['grabación de video comercial en Valencia', 'videos educativos en 4K para empresas', 'producción de Reels y TikToks en Valencia', 'edición de clips cortos de video', 'grabación de video vertical para redes sociales', 'videos en 4K para promocionar productos', 'creación de contenido en video vertical', 'producción de videos comerciales para empresas', 'videos educativos para enseñar beneficios de servicios', 'grabación de videos para redes sociales en Valencia', 'clips de video cortos para marketing digital', 'edición profesional de videos en 4K', 'producción de Reels y videos para TikTok', 'videos verticales optimizados para redes sociales', 'grabación y edición de videos cortos para empresas', 'servicios de grabación de video en alta definición', 'creación de videos comerciales efectivos en Valencia', 'producción de videos educativos en formato corto', 'videos promocionales en 4K para empresas', 'grabación de clips de video vertical para Instagram y TikTok']

  ,

  // META 
  openGraph: {
    title: 'Grabación de video comercial y educativo para empresas en Valencia',
    description: 'Grabamos y editamos potentes clips de video que te ayudarán a dar a conocer tu producto o a enseñar a tus potenciales clientes los beneficios de tus servicios.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/video-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Frame de un video promocional de producto grabado para un e-commerce que vende a través de Amazon',
      },
    ],
    site_name: 'Grabación de video comercial y educativo para empresas en Valencia',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'Grabación de video comercial y educativo para empresas en Valencia',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'Grabación de video comercial y educativo para empresas en Valencia',
    description: 'Grabamos y editamos potentes clips de video que te ayudarán a dar a conocer tu producto o a enseñar a tus potenciales clientes los beneficios de tus servicios.',
    image: 'https://ermo.es/seo/video-1200-600.jpg',
    imageAlt: 'Frame de un video promocional de producto grabado para un e-commerce que vende a través de Amazon',
  },

 
  
};

export default function FotografiaLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}