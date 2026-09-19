import Image from 'next/image'

import { getMediaByAlt, type EditorialImage } from '@/lib/getMediaByAlt'

type Props = {
  /** Média déjà résolu (prioritaire s'il est fourni). */
  media?: EditorialImage | null
  /**
   * Mot-clé « Alt » du média à afficher (convention Studio). Si aucun média
   * n'est trouvé pour cette clé, on garde le placeholder « Photo à venir ».
   */
  imageKey?: string
  caption: string
}

/**
 * Figure d'une page éditoriale. L'image se téléverse depuis l'admin (Media) en
 * mettant `imageKey` dans le champ « Alt ». Tant qu'aucune image ne porte cette
 * clé, on garde l'aplat « Photo à venir » comme repère de mise en page.
 */
export async function EditorialFigure({ media, imageKey, caption }: Props) {
  const image = media ?? (imageKey ? await getMediaByAlt(imageKey) : null)

  if (image?.url) {
    return (
      <figure className="editorial-figure has-image">
        <Image
          src={image.url}
          alt={image.alt ?? caption}
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="editorial-figure__img"
        />
        <figcaption>{caption}</figcaption>
      </figure>
    )
  }

  return (
    <figure className="editorial-figure" data-label="Photo à venir">
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
