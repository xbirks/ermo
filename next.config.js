// next.config.js
const withVideos = require('next-videos');

const isDev = process.env.NODE_ENV !== 'production';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src * data: blob:",                     // imágenes desde cualquier dominio
      `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}https:`, // scripts https y eval en dev
      "connect-src *",                             // APIs/analytics
      "style-src 'self' 'unsafe-inline' https:",   // CSS inline + cualquier https (Typekit, etc.)
      "style-src-attr 'unsafe-inline'",
      "font-src 'self' data: https:",              // fuentes de cualquier https
      "media-src * data: blob:",                   // video/audio desde cualquier dominio
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ermo.es', 'www.ermo.es', 'soyandres.es', 'localhost'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

module.exports = withVideos(nextConfig);
