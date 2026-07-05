import { SITE_TAGLINE } from '@/lib/constants'
import { getPayloadClient } from '@/lib/payload'
import { PanelLink } from '@/components/PanelLink'
import type { Homepage, Media } from '@/types/content'

// Rendu dynamique : les images des bandeaux viennent de Payload/Postgres.
export const dynamic = 'force-dynamic'

const PANELS = [
  {
    key: 'boutiquePanel',
    href: '/boutique',
    title: 'Boutique',
    subtitle: 'Oud · Attars · Encens',
    tint: 'radial-gradient(circle at 30% 20%, rgba(171, 138, 82, 0.22), transparent 60%)',
  },
  {
    key: 'collectionsPanel',
    href: '/collections',
    title: 'Collections',
    subtitle: 'Éditions & coffrets',
    tint: 'radial-gradient(circle at 70% 30%, rgba(140, 90, 110, 0.22), transparent 60%)',
  },
  {
    key: 'ateliersPanel',
    href: '/ateliers',
    title: 'Ateliers',
    subtitle: "L'art du Kōdō",
    tint: 'radial-gradient(circle at 50% 15%, rgba(171, 138, 82, 0.16), transparent 65%)',
  },
  {
    key: 'journalPanel',
    href: '/journal',
    title: 'Le Journal',
    subtitle: 'Récits & rituels',
    tint: 'radial-gradient(circle at 25% 35%, rgba(120, 100, 140, 0.2), transparent 60%)',
  },
  {
    key: 'maisonPanel',
    href: '/maison',
    title: 'La Maison',
    subtitle: 'Notre histoire',
    tint: 'radial-gradient(circle at 65% 25%, rgba(171, 138, 82, 0.2), transparent 60%)',
  },
] as const

export default async function HomePage() {
  const payload = await getPayloadClient()
  const homepage = (await payload.findGlobal({ slug: 'homepage' }).catch(() => null)) as Homepage | null

  return (
    <div className="flex flex-col">
      <div className="px-6 py-10 text-center">
        <p className="text-xs tracking-[0.3em] text-[color:var(--color-accent)] uppercase">Maison sensorielle</p>
        <h1 className="mt-2 text-3xl md:text-4xl">{SITE_TAGLINE}</h1>
      </div>

      <nav className="panel-nav" aria-label="Navigation principale">
        {PANELS.map((panel) => {
          const image = homepage?.[panel.key]?.image
          const media = image && typeof image === 'object' ? (image as Media) : null

          return (
            <PanelLink
              key={panel.href}
              href={panel.href}
              tint={panel.tint}
              title={panel.title}
              subtitle={panel.subtitle}
              imageUrl={media?.url ?? undefined}
              imageAlt={media?.alt ?? panel.title}
            />
          )
        })}
      </nav>
    </div>
  )
}
