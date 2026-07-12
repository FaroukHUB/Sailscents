import Image from 'next/image'

import type { Media } from '@/types/content'

type Props = {
  media?: Media | number | null
  caption: string
}

/**
 * Figure d'une page editoriale. Si une image Payload est fournie, elle est
 * affichee ; sinon on garde l'aplat « Photo a venir » comme repere de mise en
 * page. Les images se televersent depuis l'admin (Global « Images des pages »).
 */
export function EditorialFigure({ media, caption }: Props) {
  const image = media && typeof media === 'object' ? (media as Media) : null

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
