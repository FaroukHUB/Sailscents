import { getPayloadClient } from '@/lib/payload'

export type EditorialImage = { url: string; width: number; height: number; alt: string }

/**
 * Récupère un média de la bibliothèque (Studio) par la valeur EXACTE de son
 * champ « Alt ». Convention utilisée pour rendre éditables, depuis l'admin,
 * les images d'illustration des pages sans toucher au schéma : on téléverse un
 * média et on met dans « Alt » le mot-clé attendu (ex. `parfums-attar`).
 *
 * Aucune nouvelle colonne — on réutilise la collection Media existante. En cas
 * d'erreur ou d'absence, on renvoie null (le cadre garde son placeholder).
 */
export async function getMediaByAlt(alt: string): Promise<EditorialImage | null> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'media',
      where: { alt: { equals: alt } },
      limit: 1,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = docs[0] as any
    if (m?.url) {
      return {
        url: m.url as string,
        width: typeof m.width === 'number' ? m.width : 1200,
        height: typeof m.height === 'number' ? m.height : 900,
        alt: typeof m.alt === 'string' ? m.alt : alt,
      }
    }
    return null
  } catch {
    return null
  }
}
