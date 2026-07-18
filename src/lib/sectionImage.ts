import { getPayloadClient } from './payload'
import type { Homepage, HomepagePanel, Media } from '@/types/content'

/**
 * Image d'une section, partagee entre la porte de l'accueil et le hero de la
 * page correspondante (meme visuel = continuite a l'ouverture de la porte).
 * Les images vivent dans le global « Page d'accueil » (colonnes deja en base,
 * donc sans synchro de schema).
 */
export type SectionKey = keyof Homepage

export async function getSectionImage(
  key: SectionKey,
): Promise<{ url: string; alt: string } | null> {
  const payload = await getPayloadClient()
  const homepage = (await payload.findGlobal({ slug: 'homepage' }).catch(() => null)) as Homepage | null
  const group = homepage?.[key] as HomepagePanel | undefined
  const image = group?.image
  const media = image && typeof image === 'object' ? (image as Media) : null
  return media?.url ? { url: media.url, alt: media.alt ?? '' } : null
}
