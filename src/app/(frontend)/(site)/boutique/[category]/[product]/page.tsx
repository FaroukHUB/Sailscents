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
    <article className="mx-auto max-w-6xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <Link href="/parfums">Boutique</Link> <span aria-hidden="true">·</span>{' '}
        <Link href={`/boutique/${categorySlug}`}>{categoryName}</Link> <span aria-hidden="true">·</span>{' '}
        {product.name}
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Visuel */}
        <div className="product-media">
          {mainImageUrl ? (
            <Image
              src={mainImageUrl}
              alt={product.name}
              width={900}
              height={1100}
              className="product-media-img"
              priority
            />
          ) : (
            <div className="product-media-placeholder" aria-hidden="true" />
          )}
        </div>

        {/* Achat + résumé */}
        <div>
          {categoryName && (
            <p className="kicker">{categoryName}{product.origin?.country ? ` · ${product.origin.country}` : ''}</p>
          )}
          <h1 className="mt-3 text-4xl">{product.name}</h1>
          {product.shortDescription && (
            <p className="mt-4 text-[color:var(--color-muted)]">{product.shortDescription}</p>
          )}

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

          {(product.origin?.country || product.origin?.method) && (
            <dl className="product-facts">
              {product.origin?.country && (
                <div>
                  <dt>Origine</dt>
                  <dd>{product.origin.country}</dd>
                </div>
              )}
              {product.origin?.method && (
                <div>
                  <dt>Méthode</dt>
                  <dd>{product.origin.method}</dd>
                </div>
              )}
            </dl>
          )}

          {noteRows.length > 0 && (
            <dl className="product-facts">
              {noteRows.map((n) => (
                <div key={n.label}>
                  <dt>{n.label}</dt>
                  <dd>{n.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* Description longue (la voix du client) */}
      {product.description ? (
        <section className="product-description prose prose-invert mt-16 max-w-3xl">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <RichText data={product.description as any} />
        </section>
      ) : null}
    </article>
  )
}
