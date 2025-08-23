// next.config.js
const withVideos = require('next-videos');

const isDev = process.env.NODE_ENV !== 'production';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' data: blob: https://i.ytimg.com https://*.ggpht.com https:",
      `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}https:`,
      "connect-src 'self' https://*.youtube.com https://*.youtube-nocookie.com https://*.googlevideo.com https:",
      "style-src 'self' 'unsafe-inline' https:",
      "style-src-attr 'unsafe-inline'",
      "font-src 'self' data: https:",
      "media-src * data: blob:",
      "frame-src https://www.youtube-nocookie.com https://*.youtube.com",
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


  async redirects() {
  return [
    // --- MUNICIPIOS: LOCAL ---
    { source: '/municipios/local/alboraya/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/almussafes/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/altea/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/betera/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/calpe/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/catarroja/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/denia/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/elche/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/eliana/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/gandia/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/godella/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/javea/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/manises/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/mas-camarena/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/mislata/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/moraira/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/paterna/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/riba-roja/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/rocafort/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/sagunto/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/segorbe/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/torrente/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/municipios/local/xirivella/:path*', destination: '/diseno-web-manises', permanent: true },

    // --- MUNICIPIOS: FOTOGRAFO ---
    { source: '/municipios/fotografo/:city*', destination: '/servicios/fotografia', permanent: true },

    // --- MUNICIPIOS: DISEÑO GRÁFICO ---
    { source: '/municipios/diseno-grafico/:city*', destination: '/servicios/branding', permanent: true },

    // --- MUNICIPIOS: fallback general ---
    { source: '/municipios/:path*', destination: '/', permanent: true },

    // --- WEB: ciudades ---
    { source: '/web/alboraya/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/almussafes/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/altea/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/betera/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/calpe/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/catarroja/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/denia/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/elche/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/eliana/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/gandia/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/godella/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/javea/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/manises/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/mas-camarena/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/mislata/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/moraira/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/paterna/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/riba-roja/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/rocafort/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/sagunto/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/segorbe/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/torrente/:path*', destination: '/diseno-web-manises', permanent: true },
    { source: '/web/xirivella/:path*', destination: '/diseno-web-manises', permanent: true },
     {source: '/jardineria', destination: '/hacer-web-jardinero', permanent: true},

    // --- fallback general de /web por seguridad ---
    { source: '/web/:city/:path*', destination: '/diseno-web-manises', permanent: true },
  ];
}


};

module.exports = withVideos(nextConfig);
