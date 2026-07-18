import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/constants'
import { getPayloadClient } from '@/lib/payload'
import type { Article, Category, Product, ProductCollection, StaticPage } from '@/types/content'

// Rendu dynamique : les donnees viennent de Payload/Postgres, pas de build statique tant que la base n'est pas connectee.
export const dynamic = 'force-dynamic'

const STATIC_ROUTES = [
  '/',
  '/parfums',
  '/encens',
  '/raretes',
  '/nos-boutiques',
  '/maison',
  '/rituel',
  '/boutique',
  '/collections',
  '/journal',
  '/faq',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const [categories, products, productCollections, articles, pages] = await Promise.all([
    payload.find({ collection: 'categories', limit: 1000 }),
    payload.find({ collection: 'products', where: { status: { equals: 'published' } }, depth: 1, limit: 1000 }),
    payload.find({ collection: 'productCollections', limit: 1000 }),
    payload.find({ collection: 'articles', where: { status: { equals: 'published' } }, limit: 1000 }),
    payload.find({ collection: 'pages', limit: 1000 }),
  ])

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
  }))

  ;(categories.docs as Category[]).forEach((category) => {
    if (!category.seo?.noIndex) entries.push({ url: `${SITE_URL}/boutique/${category.slug}` })
  })
  ;(products.docs as Product[]).forEach((product) => {
    if (product.seo?.noIndex) return
    const categorySlug = typeof product.category === 'object' ? product.category.slug : ''
    entries.push({ url: `${SITE_URL}/boutique/${categorySlug}/${product.slug}` })
  })
  ;(productCollections.docs as ProductCollection[]).forEach((collection) => {
    if (!collection.seo?.noIndex) entries.push({ url: `${SITE_URL}/collections/${collection.slug}` })
  })
  ;(articles.docs as Article[]).forEach((article) => {
    if (article.seo?.noIndex) return
    entries.push({
      url: `${SITE_URL}/journal/${article.slug}`,
      lastModified: article.publishedDate ?? undefined,
    })
  })
  ;(pages.docs as StaticPage[]).forEach((page) => {
    if (!page.seo?.noIndex) entries.push({ url: `${SITE_URL}/${page.slug}` })
  })

  return entries
}
