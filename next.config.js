// next.config.js
const withVideos = require('next-videos');

const isDev = process.env.NODE_ENV !== 'production';

// CSP mínima para DEV (que no bloquee cursor, Typekit ni Next/Webpack)
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Cursor (data:/blob:) + tus dominios + GA
      "img-src 'self' data: blob: https://ermo.es https://www.ermo.es https://www.google-analytics.com https://www.googletagmanager.com",
      // Next (Webpack) necesita 'unsafe-eval' en DEV. En PROD lo quitaremos.
      `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}https://www.googletagmanager.com https://www.google-analytics.com`,
      // Conexiones (GA + Vercel vitals)
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://vitals.vercel-insights.com",
      // Typekit carga también desde p.typekit.net (CSS y fuentes)
      "style-src 'self' 'unsafe-inline' https://use.typekit.net https://p.typekit.net",
      "style-src-attr 'unsafe-inline'",
      "font-src 'self' data: https://use.typekit.net https://p.typekit.net",
      // Medios locales
      "media-src 'self'",
      // Evitar embebido
      "frame-ancestors 'none'",
    ].join('; '),
  },
  { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Permissions-Policy', value: 'geolocation=(self)' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ermo.es', 'www.ermo.es', 'soyandres.es', 'localhost'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
    ];
  },
};

module.exports = withVideos(nextConfig);
