import type { Metadata } from 'next'

import { SITE_NAME, SITE_URL } from './constants'

type MediaLike = { url?: string | null; alt?: string | null } | number | null | undefined

type SeoGroup = {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: MediaLike
  canonical?: string | null
  noIndex?: boolean | null
} | null | undefined

const resolveImageUrl = (image: MediaLike): string | undefined => {
  if (image && typeof image === 'object' && typeof image.url === 'string') {
    return image.url.startsWith('http') ? image.url : `${SITE_URL}${image.url}`
  }
  return undefined
}

/**
 * Construit un objet Metadata Next.js a partir du groupe `seo` d'un document
 * Payload, avec repli sur un titre/description/image par defaut.
 */
export const buildMetadata = (params: {
  seo?: SeoGroup
  fallbackTitle: string
  fallbackDescription?: string
  fallbackImage?: MediaLike
  path: string
}): Metadata => {
  const { seo, fallbackTitle, fallbackDescription, fallbackImage, path } = params

  const title = seo?.metaTitle || fallbackTitle
  const description = seo?.metaDescription || fallbackDescription || undefined
  const image = resolveImageUrl(seo?.ogImage) || resolveImageUrl(fallbackImage)
  const canonical = seo?.canonical || `${SITE_URL}${path}`

  return {
    // Le layout racine applique deja le gabarit "%s | Sailscents" — on ne fournit ici que le titre de page.
    title,
    description,
    alternates: { canonical },
    robots: seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: image ? [{ url: image }] : undefined,
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}
