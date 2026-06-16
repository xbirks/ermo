export default function robots() {
    return {
      rules: [
        {
          userAgent: ['Googlebot', 'Applebot', 'Bingbot'],
          allow: ['/'],
          disallow: ['/interno/'],
        },
      ],
      sitemap: 'https://ermo.es/sitemap.xml',
    }
  }