import { getPayloadClient } from '@/lib/payload'
import { getDictionary } from '@/i18n'
import { ShojiHome } from '@/components/ShojiHome'
import type { Homepage, HomepagePanel, Media } from '@/types/content'

// Rendu dynamique : les images derriere les portes viennent de Payload/Postgres.
export const dynamic = 'force-dynamic'

// `path` = chemin relatif (préfixé par la langue au rendu). `bgKey` pointe vers
// un champ image DÉJÀ présent en base. `key` = clé de traduction du panneau.
const PANELS = [
  { path: '/parfums', key: 'parfums', bgKey: 'boutiquePanel' },
  { path: '/encens', key: 'encens', bgKey: 'collectionsPanel' },
  { path: '/raretes', key: 'raretes', bgKey: 'ateliersPanel' },
  { path: '/nos-boutiques', key: 'nosBoutiques', bgKey: 'journalPanel' },
  { path: '/maison', key: 'apropos', bgKey: 'maisonPanel' },
] as const

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = getDictionary(locale)
  const payload = await getPayloadClient()
  const homepage = (await payload.findGlobal({ slug: 'homepage' }).catch(() => null)) as Homepage | null

  const panels = PANELS.map((panel) => {
    const group = homepage?.[panel.bgKey] as HomepagePanel | undefined
    const image = group?.image
    const media = image && typeof image === 'object' ? (image as Media) : null
    const copy = dict.home.panels[panel.key]
    return {
      href: `/${locale}${panel.path}`,
      title: copy.title,
      subtitle: copy.subtitle,
      imageUrl: media?.url ?? undefined,
      imageAlt: media?.alt ?? undefined,
    }
  })

  return (
    <div className="relative h-dvh">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden px-6 py-4 text-center md:block md:py-8">
        <p className="text-[0.65rem] tracking-[0.3em] text-[color:var(--color-accent)] uppercase md:text-xs">
          {dict.home.kicker}
        </p>
        <h1 className="mt-1 text-2xl md:mt-2 md:text-4xl">{dict.tagline}</h1>
      </div>

      <ShojiHome panels={panels} />
    </div>
  )
}
