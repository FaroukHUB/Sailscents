import { getPayloadClient } from '@/lib/payload'

/**
 * Récupère le logo du site depuis la bibliothèque Media (Studio), par
 * convention : le média dont le champ Alt vaut « logo ».
 *
 * Aucun nouveau champ/colonne — on réutilise la collection Media existante,
 * donc aucun risque côté schéma de production. En cas d'erreur ou d'absence,
 * on renvoie null et l'en-tête retombe sur le texte.
 */
export async function getLogo(): Promise<{ url: string; width: number; height: number; alt: string } | null> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'media',
      where: { alt: { equals: 'logo' } },
      limit: 1,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = docs[0] as any
    if (m?.url) {
      return {
        url: m.url as string,
        width: typeof m.width === 'number' ? m.width : 240,
        height: typeof m.height === 'number' ? m.height : 64,
        alt: typeof m.alt === 'string' ? m.alt : 'Sailscents',
      }
    }
    return null
  } catch {
    return null
  }
}
