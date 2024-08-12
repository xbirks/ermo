const withVideos = require('next-videos');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['soyandres.es'],
    domains: ['localhost'],
  },
};

module.exports = withVideos(nextConfig);
