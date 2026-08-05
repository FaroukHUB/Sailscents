import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductBuyBox } from '@/components/cart/ProductBuyBox'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'
import { localizeCategoryName, localizeProduct } from '@/i18n/productTranslations'
import type { Category, Media, Product } from '@/types/content'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: string; category: string; product: string }> }

const LABELS: Record<Locale, {
  shop: string
  notesTitle: string
  detailsTitle: string
  noteLabels: { top: string; heart: string; base: string }
  univers: string
  origine: string
  methode: string
  contenances: string
  prix: string
  fromPrice: string
  buybox: { size: string; quantity: string; decrease: string; increase: string; outOfStock: string; added: string; addToCart: string }
}> = {
  fr: {
    shop: 'Boutique',
    notesTitle: 'Notes olfactives',
    detailsTitle: 'Détails',
    noteLabels: { top: 'Tête', heart: 'Cœur', base: 'Fond' },
    univers: 'Univers',
    origine: 'Origine',
    methode: 'Méthode',
    contenances: 'Contenances',
    prix: 'Prix',
    fromPrice: 'à partir de',
    buybox: { size: 'Contenance', quantity: 'Quantité', decrease: 'Diminuer', increase: 'Augmenter', outOfStock: 'Rupture de stock', added: 'Ajouté ✓', addToCart: 'Ajouter au panier' },
  },
  en: {
    shop: 'Boutique',
    notesTitle: 'Olfactive notes',
    detailsTitle: 'Details',
    noteLabels: { top: 'Top', heart: 'Heart', base: 'Base' },
    univers: 'Range',
    origine: 'Origin',
    methode: 'Method',
    contenances: 'Sizes',
    prix: 'Price',
    fromPrice: 'from',
    buybox: { size: 'Size', quantity: 'Quantity', decrease: 'Decrease', increase: 'Increase', outOfStock: 'Out of stock', added: 'Added ✓', addToCart: 'Add to cart' },
  },
}

const getProduct = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, depth: 1, limit: 1 })
  return (docs[0] as Product) ?? null
}

const mediaUrl = (m: Media | number | null | undefined): string | undefined =>
  m && typeof m === 'object' ? (m.url ?? undefined) : undefined

export const generateMetadata = async ({ params }: Args) => {
  const { locale, category, product: slug } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const raw = await getProduct(slug)
  if (!raw) return {}
  const product = localizeProduct(raw, loc)
  return buildMetadata({
    seo: product.seo,
    fallbackTitle: product.name,
    fallbackDescription: product.shortDescription ?? undefined,
    fallbackImage: product.mainImage,
    path: `/boutique/${category}/${product.slug}`,
    locale: loc,
  })
}

export default async function ProductPage({ params }: Args) {
  const { locale: raw, category: categorySlug, product: slug } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = LABELS[locale]
  const p = (path: string) => `/${locale}${path}`
  const rawProduct = await getProduct(slug)
  if (!rawProduct) notFound()
  const product = localizeProduct(rawProduct, locale)

  const category = typeof product.category === 'object' ? (product.category as Category) : null
  const categoryName = category ? localizeCategoryName(category, locale) : ''
  const mainImageUrl = mediaUrl(product.mainImage)
  const variants = product.variants ?? []
  const lowestPrice = variants.length ? Math.min(...variants.map((v) => v.price)) : undefined

  const notes = product.olfactiveNotes
  const noteRows = [
    { label: t.noteLabels.top, value: notes?.top },
    { label: t.noteLabels.heart, value: notes?.heart },
    { label: t.noteLabels.base, value: notes?.base },
  ].filter((n) => n.value)

  const contenances = variants.map((v) => v.label).filter(Boolean).join('   ·   ')
  const priceLabel =
    lowestPrice !== undefined ? (variants.length > 1 ? `${t.fromPrice} ${lowestPrice} €` : `${lowestPrice} €`) : undefined
  const detailRows = [
    { label: t.univers, value: categoryName || undefined },
    { label: t.origine, value: product.origin?.country ?? undefined },
    { label: t.methode, value: product.origin?.method ?? undefined },
    { label: t.contenances, value: contenances || undefined },
    { label: t.prix, value: priceLabel },
  ].filter((r) => r.value)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? undefined,
    category: categoryName,
    image: mainImageUrl ?? undefined,
    offers: variants.map((v) => ({
      '@type': 'Offer',
      name: v.label,
      price: v.price,
      priceCurrency: 'EUR',
      availability: v.stock && v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    })),
  }

  return (
    <article className="product-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <Link href={p('/boutique')}>{t.shop}</Link> <span aria-hidden="true">·</span>{' '}
        <Link href={p(`/boutique/${categorySlug}`)}>{categoryName}</Link> <span aria-hidden="true">·</span>{' '}
        {product.name}
      </nav>

      <div className="product-hero">
        <div className={`product-hero__media${mainImageUrl ? ' has-image' : ''}`}>
          {mainImageUrl && (
            <Image src={mainImageUrl} alt={product.name} fill sizes="(min-width: 860px) 40vw, 100vw" priority />
          )}
        </div>

        <div className="product-hero__intro">
          {categoryName && (
            <p className="kicker">
              {categoryName}
              {product.origin?.country ? ` · ${product.origin.country}` : ''}
            </p>
          )}
          <h1 className="product-title">{product.name}</h1>
          {product.shortDescription && <p className="product-lede">{product.shortDescription}</p>}

          {product.description ? (
            <div className="product-story">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <RichText data={product.description as any} />
            </div>
          ) : null}

          {variants.length > 0 ? (
            <div className="mt-8">
              <ProductBuyBox
                productId={product.id}
                productSlug={product.slug}
                productName={product.name}
                imageUrl={mainImageUrl}
                variants={variants}
                labels={t.buybox}
              />
            </div>
          ) : (
            lowestPrice !== undefined && <p className="mt-8 text-2xl">{t.fromPrice} {lowestPrice} €</p>
          )}
        </div>
      </div>

      {noteRows.length > 0 && (
        <section className="spec-block" aria-labelledby="notes-title">
          <h2 id="notes-title" className="spec-block__title">{t.notesTitle}</h2>
          <div className="spec-list">
            {noteRows.map((n) => (
              <div key={n.label} className="spec-row">
                <span className="spec-label">{n.label}</span>
                <span className="spec-value">{n.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {detailRows.length > 0 && (
        <section className="spec-block" aria-labelledby="details-title">
          <h2 id="details-title" className="spec-block__title">{t.detailsTitle}</h2>
          <div className="spec-list">
            {detailRows.map((r) => (
              <div key={r.label} className="spec-row">
                <span className="spec-label">{r.label}</span>
                <span className="spec-value">{r.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
