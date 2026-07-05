import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Workshop } from '@/types/content'

// Rendu dynamique : les donnees viennent de Payload/Postgres, pas de build statique tant que la base n'est pas connectee.
export const dynamic = 'force-dynamic'

export const generateMetadata = async () =>
  buildMetadata({
    fallbackTitle: 'Ateliers',
    fallbackDescription: "Nos ateliers et expériences sensorielles, dans l'esprit du Kōdō.",
    path: '/ateliers',
  })

export default async function WorkshopsPage() {
  const payload = await getPayloadClient()
  const { docs: workshops } = await payload.find({
    collection: 'workshops',
    where: { status: { equals: 'published' } },
    limit: 50,
  })

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl">Ateliers</h1>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {(workshops as Workshop[]).map((workshop) => (
          <Link
            key={workshop.id}
            href={`/ateliers/${workshop.slug}`}
            className="border border-[color:var(--color-border)] p-8 transition-colors hover:border-[color:var(--color-accent)]"
          >
            <h2 className="text-2xl">{workshop.name}</h2>
            {workshop.shortDescription && (
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">{workshop.shortDescription}</p>
            )}
          </Link>
        ))}
        {workshops.length === 0 && (
          <p className="text-[color:var(--color-muted)]">Aucun atelier publié pour le moment.</p>
        )}
      </div>
    </section>
  )
}
