import "./style.scss";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
// El header, el footer y el banner de cookies se pintan
// desde aquí salvo en las herramientas internas. Ver cromo-publico.jsx.
import { CabeceraPublica, PiePublico } from "./components/cromo-publico.jsx";
import AplicarConsentimiento from "./components/cookies/aplicar-consentimiento.jsx";

 

export const metadata = {

  //GENERIC
   title: 'ERMO | Diseño y programación web en Valencia',
  description: 'Programación y diseño web, motion graphics y generación de imágenes con inteligencia artificial.',
  applicationName: 'ERMO',
    keywords: [
    'diseño gráfico en Valencia',
    'branding en Valencia',
    'diseño web en Valencia',
    'diseñador gráfico en Valencia',
    'diseñador web en Valencia',
  ],
  authors: [{ name: 'Andrés Ortega', url: 'https://ermo.es' }],
  creator: 'Andrés Ortega',
  publisher: 'Andrés Ortega',
    robots: {
    index: true,
    follow: true,
    googleBot: {
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
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
        alt: 'Proyectos del estudio ERMO: fotografía, branding, web, 3D.',
      },
    ],
    siteName: 'ERMO',
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

  



}


 

export default function RootLayout({ children }) {


  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />

        {/* Adobe Fonts */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/ury2gea.css" />
        {/* Aktiv Grotesk (tirita de estilo): de momento sale del kit de
            Medworld, que vale en local. Antes de publicar hay que añadirla
            al kit de ERMO (ury2gea) y quitar esta línea. */}
        <link rel="stylesheet" href="https://use.typekit.net/cbv1cvv.css" />

        {/* LCP poster (si aplica) */}
        <link rel="preload" as="image" href="/assets/test_vid_poster.jpg" />

        {/* Sin preconnect a Google: abrir la conexión ya le pasa la IP
            antes de que la persona acepte las cookies. */}

        {/* UI meta */}
        <meta name="theme-color" content="#14394B" />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://ermo.es",
                "name": "ERMO ESTUDIO"
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Ermo",
                "description": "Programación y diseño web, motion graphics y generación de imágenes con inteligencia artificial.",
                "email": "andresortega@ermo.es",
                "logo": "https://ermo.es/favicon_500x500.png",
                "url": "https://ermo.es",
                "sameAs": [
                  "https://www.instagram.com/ermo.es",
                  "https://www.linkedin.com/in/andres-ermo",
                  "https://www.behance.net/ermo"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Ermo",
                "description": "Programación y diseño web, motion graphics y generación de imágenes con inteligencia artificial.",
                "image": "https://ermo.es/seo/meta-1200x630.jpg",
                "url": "https://ermo.es",
                "telephone": "+34675392216",
                "priceRange": "$$$",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Pl. Rafael Atard, 20A",
                  "addressLocality": "Manises",
                  "addressRegion": "Valencia",
                  "postalCode": "46940",
                  "addressCountry": "ES"
                }
              }
            ])
          }}
        />




        {/* Google Analytics y Google Ads ya no se cargan aquí: solo se
            descargan si la persona los acepta. Ver app/lib/consentimiento.js. */}

      </head>

      <body>



        <CabeceraPublica />
          {children}
        <PiePublico />
        <AplicarConsentimiento />
        {/* Vercel Analytics y Speed Insights no usan cookies ni guardan
            nada en el dispositivo: van sin consentimiento (interés
            legítimo, explicado en la política de privacidad). */}
        <Analytics /><SpeedInsights />

      </body>
    </html>
  );
}