import "./style.scss";
import Header from "./components/header.jsx";
import Cursor from './buttons/cursor/cursor.jsx';
import Footer from './components/footer/footer.jsx';
import Spacer from './buttons/spacer.jsx';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
 

export const metadata = {

  //GENERIC
  title: 'ERMO | Diseño y programación web en Valencia',
  description: 'Programación y diseño web, motion graphics y generación de imágenes con inteligencia artificial.',
  applicationName: 'ERMO',
  keywords: ['diseño gráfico en Valencia', 'estudio de diseño gráfico en Manises', 'branding en Manises', 'animación 2D en Manises', 'diseño web en Manises', 'fotografía de producto en Manises', 'diseñador gráfico en Manises', 'diseñador gráfico en Valencia', 'creatividad en Manises', 'marketing digital en Manises', 'diseño de logos en Manises', 'identidad corporativa en Manises', 'diseño de interiores en Manises', 'diseño de packaging en Manises', 'diseño de folletos en Manises', 'diseño de carteles en Manises', 'desarrollo de marca en Manises', 'consultoría de diseño en Manises', 'diseñador gráfico Manises'],
  authors: [{ name: 'Andrés Ortega', url: 'https://soyandres.es' }],
  creator: 'Andrés Ortega',
  publisher: 'Andrés Ortega',
  robots: 'index, follow',
  revisitAfter: '1 days',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  contentLanguage: 'es',
  
  // META
  openGraph: {
    title: 'ERMO | Diseño y programación web en Valencia',
    description: 'Programación y diseño web, motion graphics y generación de imágenes con inteligencia artificial.',
    url: 'https://ermo.es',
    type: 'website',
    images: [
      {
        url: 'https://ermo.es/seo/meta-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'Diferentes proyectos hechos por el estudio de diseño gráfico Ermo. Fotografía, branding, web, 3D.',
      },
    ],
    site_name: 'ERMO | Diseño y programación web en Valencia',
    locale: 'es_ES',
  },

  // TWITTER
  twitter: {
    card: 'ERMO | Diseño y programación web en Valencia',
    site: '@ermo.es',
    creator: '@ermo.es',
    title: 'ERMO | Diseño y programación web en Valencia',
    description: 'Programación y diseño web, motion graphics y generación de imágenes con inteligencia artificial.',
    image: 'https://ermo.es/seo/twitter-1200-600.jpg',
    imageAlt: 'Diferentes proyectos hechos por el estudio de diseño gráfico Ermo. Fotografía, branding, web, 3D.',
  },

  //APPLE
  appleTouchIcon: 'https://ermo.es/favicon_500x500.png', 
  appleTouchStartupImage: 'https://ermo.es/favicon_500x500.png',

  



  //SECURITY
  contentSecurityPolicy: "default-src 'self'; img-src 'self' https://www.ermo.es; script-src 'self' https://apis.google.com",
  referrerPolicy: 'no-referrer-when-downgrade', 
  xContentTypeOptions: 'nosniff', 
  xFrameOptions: 'DENY', 
  xXssProtection: '1; mode=block',
  permissionsPolicy: "geolocation=(self)",

  
}
 

export default function RootLayout({ children }) {


  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://use.typekit.net/ury2gea.css"></link>
        <link rel="preload" href="https://use.typekit.net/ury2gea.css" as="font" type="font/woff2" crossOrigin="anonymous" />

       
        <meta name="theme-color" content="#3F52FF" />
        <meta name="background-color" content="#333333" />
        <link rel="canonical" href="https://ermo.es" hrefLang="es-ES" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="https://ermo.es/favicon_500x500.png" title="Ícono de la pestaña de la web Ermo" type="image/png" />
        <link rel="apple-touch-icon" sizes="500x500" href="https://ermo.es/favicon_500x500.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "http://schema.org",
                "@type": "WebSite",
                "url": "https://ermo.es",
                "name": "ERMO ESTUDIO"
              },
              {
                "@context": "http://schema.org",
                "@type": "Organization",
                "name": "Ermo",
                "description": "Programación y diseño web, motion graphics y generación de imágenes con inteligencia artificial.",
                "email": "estudio@ermo.es",
                "logo": "https://ermo.es/favicon_500x500.png",
                "url": "https://ermo.es"
              },
              {
                "@context": "http://schema.org",
                "@type": "LocalBusiness",
                "logo": "https://ermo.es/favicon_500x500.png",
                "name": "Ermo",
                "description": "Programación y diseño web, motion graphics y generación de imágenes con inteligencia artificial.",
                "image": "https://ermo.es/seo/meta-1200x630.jpg",
                "url": "https://ermo.es",
                "hasMap": "#",
                "telephone": "675392216",
                "priceRange": "$$$",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Pl. Rafael Atard, 20A",
                  "addressLocality": "Manises",
                  "addressRegion": "Valencia",
                  "postalCode": "46940"
                }
              }
            ])
          }}
        />
      </head>
      <body>
        
    
        <Header/>
          {children}
        <Spacer className="spacer-xl" />
        <Footer />
        <Spacer className="spacer-m" />
        <Cursor />
        <Analytics /><SpeedInsights />

      </body>
    </html>
  );
}