import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Category, Media, Product } from '@/types/content'

// Rendu dynamique : les donnees viennent de Payload/Postgres, pas de build statique tant que la base n'est pas connectee.
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

  const categoryName = typeof product.category === 'object' ? (product.category as Category).name : ''
  const lowestPrice = product.variants?.length
    ? Math.min(...product.variants.map((variant) => variant.price))
    : undefined
  const mainImageUrl =
    product.mainImage && typeof product.mainImage === 'object' ? (product.mainImage as Media).url : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? undefined,
    category: categoryName,
    image: mainImageUrl ?? undefined,
    offers: product.variants?.map((variant) => ({
      '@type': 'Offer',
      name: variant.label,
      price: variant.price,
      priceCurrency: 'EUR',
      availability:
        variant.stock && variant.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    })),
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p className="text-xs tracking-[0.3em] text-[color:var(--color-accent)] uppercase">{categoryName}</p>
      <h1 className="mt-2 text-4xl">{product.name}</h1>
      {product.shortDescription && (
        <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">{product.shortDescription}</p>
      )}

      {lowestPrice !== undefined && <p className="mt-6 text-2xl">à partir de {lowestPrice} €</p>}

      {product.variants && product.variants.length > 0 && (
        <ul className="mt-8 flex flex-col gap-3">
          {product.variants.map((variant) => (
            <li
              key={variant.label}
              className="flex items-center justify-between border border-[color:var(--color-border)] px-4 py-3"
            >
              <span>{variant.label}</span>
              <span>{variant.price} €</span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-12 text-sm text-[color:var(--color-muted)]">
        Univers : <span className="text-[color:var(--foreground)]">{categorySlug}</span>
      </p>
    </section>
  )
}
