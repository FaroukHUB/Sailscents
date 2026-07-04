import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { ProductCollection } from '@/types/content'

// Rendu dynamique : les donnees viennent de Payload/Postgres, pas de build statique tant que la base n'est pas connectee.
export const dynamic = 'force-dynamic'

export const generateMetadata = async () =>
  buildMetadata({
    fallbackTitle: 'Collections',
    fallbackDescription: 'Nos collections curatées : coffrets, éditions limitées et expériences sensorielles.',
    path: '/collections',
  })

export default async function CollectionsPage() {
  const payload = await getPayloadClient()
  const { docs: collections } = await payload.find({ collection: 'productCollections', limit: 50 })

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl">Collections</h1>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {(collections as ProductCollection[]).map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className="border border-[color:var(--color-border)] p-8 transition-colors hover:border-[color:var(--color-accent)]"
          >
            <h2 className="text-2xl">{collection.name}</h2>
          </Link>
        ))}
        {collections.length === 0 && (
          <p className="text-[color:var(--color-muted)]">Aucune collection publiée pour le moment.</p>
        )}
      </div>
    </section>
  )
}
