import { SITE_TAGLINE } from '@/lib/constants'
import { getPayloadClient } from '@/lib/payload'
import { ShojiHome } from '@/components/ShojiHome'
import type { Homepage, HomepagePanel, Media } from '@/types/content'

// Rendu dynamique : les images derriere les portes viennent de Payload/Postgres.
export const dynamic = 'force-dynamic'

// `bgKey` pointe vers un champ image DEJA present en base (ancien bandeau), ce
// qui evite toute synchro de schema. Une image revelee par porte.
const PANELS = [
  { href: '/parfums', title: 'Les Parfums', subtitle: 'Attars et huiles parfumées d’exception.', bgKey: 'boutiquePanel' },
  { href: '/encens', title: 'Les Encens', subtitle: 'La voie du Kōdō, l’art de l’encens.', bgKey: 'collectionsPanel' },
  { href: '/raretes', title: 'Les Raretés', subtitle: 'Thé, safran, ambre gris — matières précieuses.', bgKey: 'ateliersPanel' },
  { href: '/nos-boutiques', title: 'Nos Boutiques', subtitle: 'Nous rencontrer et vivre l’expérience.', bgKey: 'journalPanel' },
  { href: '/maison', title: 'À propos de nous', subtitle: 'L’histoire et l’exigence Sailscents.', bgKey: 'maisonPanel' },
] as const

export default async function HomePage() {
  const payload = await getPayloadClient()
  const homepage = (await payload.findGlobal({ slug: 'homepage' }).catch(() => null)) as Homepage | null

  const panels = PANELS.map((panel) => {
    const group = homepage?.[panel.bgKey] as HomepagePanel | undefined
    const image = group?.image
    const media = image && typeof image === 'object' ? (image as Media) : null
    return {
      href: panel.href,
      title: panel.title,
      subtitle: panel.subtitle,
      imageUrl: media?.url ?? undefined,
      imageAlt: media?.alt ?? undefined,
    }
  })

  return (
    <div className="relative h-dvh">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden px-6 py-4 text-center md:block md:py-8">
        <p className="text-[0.65rem] tracking-[0.3em] text-[color:var(--color-accent)] uppercase md:text-xs">
          Maison sensorielle
        </p>
        <h1 className="mt-1 text-2xl md:mt-2 md:text-4xl">{SITE_TAGLINE}</h1>
      </div>

      <ShojiHome panels={panels} />
    </div>
  )
}
