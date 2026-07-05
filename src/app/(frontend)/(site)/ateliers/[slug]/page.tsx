import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Workshop } from '@/types/content'

// Rendu dynamique : les donnees viennent de Payload/Postgres, pas de build statique tant que la base n'est pas connectee.
export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

const getWorkshop = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'workshops',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return (docs[0] as Workshop) ?? null
}

export const generateMetadata = async ({ params }: Args) => {
  const { slug } = await params
  const workshop = await getWorkshop(slug)
  if (!workshop) return {}

  return buildMetadata({
    seo: workshop.seo,
    fallbackTitle: workshop.name,
    fallbackDescription: workshop.shortDescription ?? undefined,
    path: `/ateliers/${workshop.slug}`,
  })
}

export default async function WorkshopPage({ params }: Args) {
  const { slug } = await params
  const workshop = await getWorkshop(slug)
  if (!workshop) notFound()

  const jsonLd = workshop.sessions?.map((session) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: workshop.name,
    startDate: session.date,
    location: workshop.location ? { '@type': 'Place', name: workshop.location } : undefined,
    offers: workshop.price
      ? { '@type': 'Offer', price: workshop.price, priceCurrency: 'EUR' }
      : undefined,
  }))

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      {jsonLd?.map((entry, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}

      <h1 className="text-4xl">{workshop.name}</h1>
      {workshop.shortDescription && (
        <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">{workshop.shortDescription}</p>
      )}

      <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
        {workshop.location && (
          <div>
            <dt className="text-[color:var(--color-muted)]">Lieu</dt>
            <dd>{workshop.location}</dd>
          </div>
        )}
        {workshop.duration && (
          <div>
            <dt className="text-[color:var(--color-muted)]">Durée</dt>
            <dd>{workshop.duration}</dd>
          </div>
        )}
        {workshop.price !== undefined && workshop.price !== null && (
          <div>
            <dt className="text-[color:var(--color-muted)]">Prix</dt>
            <dd>{workshop.price} €</dd>
          </div>
        )}
      </dl>

      {workshop.sessions && workshop.sessions.length > 0 && (
        <ul className="mt-8 flex flex-col gap-3">
          {workshop.sessions.map((session) => (
            <li
              key={session.date}
              className="flex items-center justify-between border border-[color:var(--color-border)] px-4 py-3"
            >
              <span>{new Date(session.date).toLocaleDateString('fr-FR')}</span>
              <span>{session.seatsAvailable ?? '—'} places</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
