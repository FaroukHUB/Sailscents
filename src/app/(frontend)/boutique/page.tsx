import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Category } from '@/types/content'

// Rendu dynamique : les donnees viennent de Payload/Postgres, pas de build statique tant que la base n'est pas connectee.
export const dynamic = 'force-dynamic'

export const generateMetadata = async () =>
  buildMetadata({
    fallbackTitle: 'Boutique',
    fallbackDescription: 'Le catalogue complet Sailscents : Oud, Attars, Encens, Café et Thé.',
    path: '/boutique',
  })

export default async function BoutiquePage() {
  const payload = await getPayloadClient()
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 50,
    sort: 'name',
  })

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl">Boutique</h1>
      <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
        Explorez nos univers, du bois de Oud aux infusions les plus rares.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {(categories as Category[]).map((category) => (
          <Link
            key={category.id}
            href={`/boutique/${category.slug}`}
            className="border border-[color:var(--color-border)] p-8 transition-colors hover:border-[color:var(--color-accent)]"
          >
            <h2 className="text-2xl">{category.name}</h2>
          </Link>
        ))}
        {categories.length === 0 && (
          <p className="text-[color:var(--color-muted)]">
            Aucun univers publié pour le moment — ajoutez-en un depuis l&apos;admin Payload.
          </p>
        )}
      </div>
    </section>
  )
}
