import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/constants'
import { getPayloadClient } from '@/lib/payload'
import { locales, defaultLocale } from '@/i18n/config'
import type { Article, Category, Product, ProductCollection, StaticPage } from '@/types/content'

// Rendu dynamique : les donnees viennent de Payload/Postgres.
export const dynamic = 'force-dynamic'

// Chemins statiques, relatifs à la langue ('' = accueil).
const STATIC_PATHS = [
  '',
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
  '/contact',
  '/livraison-et-retours',
  '/cgv',
  '/confidentialite',
  '/mentions-legales',
]

// Une entrée par chemin, avec une URL par langue (hreflang).
const localized = (path: string, lastModified?: string | Date): MetadataRoute.Sitemap[number] => ({
  url: `${SITE_URL}/${defaultLocale}${path}`,
  lastModified,
  alternates: {
    languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
  },
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const [categories, products, productCollections, articles, pages] = await Promise.all([
    payload.find({ collection: 'categories', limit: 1000 }),
    payload.find({ collection: 'products', where: { status: { equals: 'published' } }, depth: 1, limit: 1000 }),
    payload.find({ collection: 'productCollections', limit: 1000 }),
    payload.find({ collection: 'articles', where: { status: { equals: 'published' } }, limit: 1000 }),
    payload.find({ collection: 'pages', limit: 1000 }),
  ])

  const paths: { path: string; lastModified?: string | Date }[] = STATIC_PATHS.map((path) => ({ path }))

  ;(categories.docs as Category[]).forEach((category) => {
    if (!category.seo?.noIndex) paths.push({ path: `/boutique/${category.slug}` })
  })
  ;(products.docs as Product[]).forEach((product) => {
    if (product.seo?.noIndex) return
    const categorySlug = typeof product.category === 'object' ? product.category.slug : ''
    paths.push({ path: `/boutique/${categorySlug}/${product.slug}` })
  })
  ;(productCollections.docs as ProductCollection[]).forEach((collection) => {
    if (!collection.seo?.noIndex) paths.push({ path: `/collections/${collection.slug}` })
  })
  ;(articles.docs as Article[]).forEach((article) => {
    if (article.seo?.noIndex) return
    paths.push({ path: `/journal/${article.slug}`, lastModified: article.publishedDate ?? undefined })
  })
  ;(pages.docs as StaticPage[]).forEach((page) => {
    if (!page.seo?.noIndex) paths.push({ path: `/${page.slug}` })
  })

  return paths.map(({ path, lastModified }) => localized(path, lastModified))
}
