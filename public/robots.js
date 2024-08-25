export default function robots() {
    return {
      rules: [
        {
          userAgent: ['Googlebot', 'Applebot', 'Bingbot'],
          allow: ['/'],
        },
      ],
      sitemap: 'https://ermo.es/sitemap.xml',
    }
  }