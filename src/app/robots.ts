import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/panier', '/commande', '/compte', '/recherche'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
