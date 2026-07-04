import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Product, ProductCollection } from '@/types/content'

// Rendu dynamique : les donnees viennent de Payload/Postgres, pas de build statique tant que la base n'est pas connectee.
export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

const getCollection = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'productCollections',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return (docs[0] as ProductCollection) ?? null
}

export const generateMetadata = async ({ params }: Args) => {
  const { slug } = await params
  const collection = await getCollection(slug)
  if (!collection) return {}

  return buildMetadata({
    seo: collection.seo,
    fallbackTitle: collection.name,
    fallbackImage: collection.coverImage,
    path: `/collections/${collection.slug}`,
  })
}

export default async function CollectionDetailPage({ params }: Args) {
  const { slug } = await params
  const collection = await getCollection(slug)
  if (!collection) notFound()

  const products = (collection.products as Product[]) ?? []

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl">{collection.name}</h1>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) =>
          typeof product === 'object' ? (
            <Link
              key={product.id}
              href={`/boutique/${typeof product.category === 'object' ? product.category.slug : ''}/${product.slug}`}
              className="border border-[color:var(--color-border)] p-6 transition-colors hover:border-[color:var(--color-accent)]"
            >
              <h2 className="text-xl">{product.name}</h2>
            </Link>
          ) : null,
        )}
        {products.length === 0 && (
          <p className="text-[color:var(--color-muted)]">Aucun produit associé à cette collection pour le moment.</p>
        )}
      </div>
    </section>
  )
}
