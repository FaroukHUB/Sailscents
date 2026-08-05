import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductBuyBox } from '@/components/cart/ProductBuyBox'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Category, Media, Product } from '@/types/content'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ category: string; product: string }> }

const getProduct = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return (docs[0] as Product) ?? null
}

const mediaUrl = (m: Media | number | null | undefined): string | undefined =>
  m && typeof m === 'object' ? (m.url ?? undefined) : undefined

export const generateMetadata = async ({ params }: Args) => {
  const { category, product: slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return buildMetadata({
    seo: product.seo,
    fallbackTitle: product.name,
    fallbackDescription: product.shortDescription ?? undefined,
    fallbackImage: product.mainImage,
    path: `/boutique/${category}/${product.slug}`,
  })
}

export default async function ProductPage({ params }: Args) {
  const { category: categorySlug, product: slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const category = typeof product.category === 'object' ? (product.category as Category) : null
  const categoryName = category?.name ?? ''
  const mainImageUrl = mediaUrl(product.mainImage)
  const variants = product.variants ?? []
  const lowestPrice = variants.length ? Math.min(...variants.map((v) => v.price)) : undefined

  const notes = product.olfactiveNotes
  const noteRows = [
    { label: 'Tête', value: notes?.top },
    { label: 'Cœur', value: notes?.heart },
    { label: 'Fond', value: notes?.base },
  ].filter((n) => n.value)

  const contenances = variants.map((v) => v.label).filter(Boolean).join('   ·   ')
  const priceLabel =
    lowestPrice !== undefined ? (variants.length > 1 ? `à partir de ${lowestPrice} €` : `${lowestPrice} €`) : undefined
  const detailRows = [
    { label: 'Univers', value: categoryName || undefined },
    { label: 'Origine', value: product.origin?.country ?? undefined },
    { label: 'Méthode', value: product.origin?.method ?? undefined },
    { label: 'Contenances', value: contenances || undefined },
    { label: 'Prix', value: priceLabel },
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
        <Link href="/parfums">Boutique</Link> <span aria-hidden="true">·</span>{' '}
        <Link href={`/boutique/${categorySlug}`}>{categoryName}</Link> <span aria-hidden="true">·</span>{' '}
        {product.name}
      </nav>

      {/* En-tête : grande image à gauche, nom + récit + achat à droite. */}
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
              />
            </div>
          ) : (
            lowestPrice !== undefined && <p className="mt-8 text-2xl">à partir de {lowestPrice} €</p>
          )}
        </div>
      </div>

      {/* Notes olfactives — lignes étiquetées. */}
      {noteRows.length > 0 && (
        <section className="spec-block" aria-labelledby="notes-title">
          <h2 id="notes-title" className="spec-block__title">
            Notes olfactives
          </h2>
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

      {/* Détails — lignes étiquetées. */}
      {detailRows.length > 0 && (
        <section className="spec-block" aria-labelledby="details-title">
          <h2 id="details-title" className="spec-block__title">
            Détails
          </h2>
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
