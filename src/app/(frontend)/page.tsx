import { SITE_TAGLINE } from '@/lib/constants'
import { getPayloadClient } from '@/lib/payload'
import { ShojiHome } from '@/components/ShojiHome'
import type { Homepage, Media } from '@/types/content'

// Rendu dynamique : l'image de fond vient de Payload/Postgres.
export const dynamic = 'force-dynamic'

const PANELS = [
  { href: '/boutique', title: 'La Boutique', subtitle: 'L’univers des créations Sailscents.' },
  { href: '/collections', title: 'Les Collections', subtitle: 'Explorer les familles olfactives.' },
  { href: '/rituel', title: 'Le Rituel', subtitle: 'Vivre l’expérience du tatami.' },
  { href: '/journal', title: 'Le Journal', subtitle: 'Comprendre les matières et les traditions.' },
  { href: '/maison', title: 'La Maison', subtitle: 'Entrer dans l’univers Sailscents.' },
]

export default async function HomePage() {
  const payload = await getPayloadClient()
  const homepage = (await payload.findGlobal({ slug: 'homepage' }).catch(() => null)) as Homepage | null

  const bg = homepage?.background
  const media = bg && typeof bg === 'object' ? (bg as Media) : null

  return (
    <div className="relative h-dvh">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 py-8 text-center">
        <p className="text-xs tracking-[0.3em] text-[color:var(--color-accent)] uppercase">Maison sensorielle</p>
        <h1 className="mt-2 text-3xl md:text-4xl">{SITE_TAGLINE}</h1>
      </div>

      <ShojiHome
        panels={PANELS}
        backgroundUrl={media?.url ?? undefined}
        backgroundAlt={media?.alt ?? undefined}
      />
    </div>
  )
}
