import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Category, Product } from '@/types/content'

// Rendu dynamique : les donnees viennent de Payload/Postgres, pas de build statique tant que la base n'est pas connectee.
export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ category: string }> }

const getCategory = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return (docs[0] as Category) ?? null
}

export const generateMetadata = async ({ params }: Args) => {
  const { category: slug } = await params
  const category = await getCategory(slug)
  if (!category) return {}

  return buildMetadata({
    seo: category.seo,
    fallbackTitle: category.name,
    fallbackImage: category.heroImage,
    path: `/boutique/${category.slug}`,
  })
}

export default async function CategoryPage({ params }: Args) {
  const { category: slug } = await params
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
      <p className="text-xs tracking-[0.3em] text-[color:var(--color-accent)] uppercase">Univers</p>
      <h1 className="mt-2 text-4xl">{category.name}</h1>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {(products as Product[]).map((product) => (
          <Link
            key={product.id}
            href={`/boutique/${category.slug}/${product.slug}`}
            className="border border-[color:var(--color-border)] p-6 transition-colors hover:border-[color:var(--color-accent)]"
          >
            <h2 className="text-xl">{product.name}</h2>
            {product.shortDescription && (
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">{product.shortDescription}</p>
            )}
          </Link>
        ))}
        {products.length === 0 && (
          <p className="text-[color:var(--color-muted)]">Aucun produit publié dans cet univers pour le moment.</p>
        )}
      </div>
    </section>
  )
}
