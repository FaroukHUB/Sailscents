import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'
import type { Category, Product } from '@/types/content'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: string; category: string }> }

const LABELS: Record<Locale, { kicker: string; empty: string }> = {
  fr: { kicker: 'Univers', empty: 'Aucun produit publié dans cet univers pour le moment.' },
  en: { kicker: 'Range', empty: 'No product published in this range yet.' },
}

const getCategory = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
  return (docs[0] as Category) ?? null
}

export const generateMetadata = async ({ params }: Args) => {
  const { locale, category: slug } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const category = await getCategory(slug)
  if (!category) return {}

  return buildMetadata({
    seo: category.seo,
    fallbackTitle: category.name,
    fallbackImage: category.heroImage,
    path: `/boutique/${category.slug}`,
    locale: loc,
  })
}

export default async function CategoryPage({ params }: Args) {
  const { locale: raw, category: slug } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = LABELS[locale]
  const p = (path: string) => `/${locale}${path}`
  const category = await getCategory(slug)
  if (!category) notFound()

  const payload = await getPayloadClient()
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { category: { equals: category.id }, status: { equals: 'published' } },
    limit: 100,
  })

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-xs tracking-[0.3em] text-[color:var(--color-accent)] uppercase">{t.kicker}</p>
      <h1 className="mt-2 text-4xl">{category.name}</h1>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {(products as Product[]).map((product) => (
          <Link
            key={product.id}
            href={p(`/boutique/${category.slug}/${product.slug}`)}
            className="border border-[color:var(--color-border)] p-6 transition-colors hover:border-[color:var(--color-accent)]"
          >
            <h2 className="text-xl">{product.name}</h2>
            {product.shortDescription && (
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">{product.shortDescription}</p>
            )}
          </Link>
        ))}
        {products.length === 0 && <p className="text-[color:var(--color-muted)]">{t.empty}</p>}
      </div>
    </section>
  )
}
