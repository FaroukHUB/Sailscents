import { SITE_TAGLINE } from '@/lib/constants'
import { getPayloadClient } from '@/lib/payload'
import { ShojiHome } from '@/components/ShojiHome'
import type { Homepage, Media } from '@/types/content'

// Rendu dynamique : l'image de fond vient de Payload/Postgres.
export const dynamic = 'force-dynamic'

const PANELS = [
  { href: '/parfums', title: 'Les Parfums', subtitle: 'Attars et huiles parfumées d’exception.' },
  { href: '/encens', title: 'Les Encens', subtitle: 'La voie du Kōdō, l’art de l’encens.' },
  { href: '/raretes', title: 'Les Raretés', subtitle: 'Thé, safran, ambre gris — matières précieuses.' },
  { href: '/nos-boutiques', title: 'Nos Boutiques', subtitle: 'Nous rencontrer et vivre l’expérience.' },
  { href: '/maison', title: 'À propos de nous', subtitle: 'L’histoire et l’exigence Sailscents.' },
]

export default async function HomePage() {
  const payload = await getPayloadClient()
  const homepage = (await payload.findGlobal({ slug: 'homepage' }).catch(() => null)) as Homepage | null

  // On reutilise un champ image DEJA present en base (ancien bandeau Boutique),
  // ce qui evite toute synchro de schema : le client uploade la scene tatami
  // dans ce champ, relabellise « Image de fond » dans l'admin.
  const bg = homepage?.boutiquePanel?.image
  const media = bg && typeof bg === 'object' ? (bg as Media) : null

  return (
    <div className="relative h-dvh">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 py-4 text-center md:py-8">
        <p className="text-[0.65rem] tracking-[0.3em] text-[color:var(--color-accent)] uppercase md:text-xs">
          Maison sensorielle
        </p>
        <h1 className="mt-1 text-2xl md:mt-2 md:text-4xl">{SITE_TAGLINE}</h1>
      </div>

      <ShojiHome
        panels={PANELS}
        backgroundUrl={media?.url ?? undefined}
        backgroundAlt={media?.alt ?? undefined}
      />
    </div>
  )
}
