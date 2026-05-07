// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/login', '/maintenance'],
    },
    sitemap: 'https://backstagers-jawabarat.vercel.app/sitemap.xml',
  }
}
