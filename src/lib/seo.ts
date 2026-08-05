import type { Metadata } from 'next'

import { SITE_NAME, SITE_URL } from './constants'
import { locales, defaultLocale, type Locale } from '@/i18n/config'

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
  /** Chemin relatif à la langue, ex. `/parfums` (le préfixe /fr /en est ajouté ici). */
  path: string
  /** Langue de la page (par défaut FR). Pilote canonical, hreflang et og:locale. */
  locale?: Locale
}): Metadata => {
  const { seo, fallbackTitle, fallbackDescription, fallbackImage, path, locale } = params
  const loc = locale ?? defaultLocale

  const title = seo?.metaTitle || fallbackTitle
  const description = seo?.metaDescription || fallbackDescription || undefined
  const image = resolveImageUrl(seo?.ogImage) || resolveImageUrl(fallbackImage)
  const canonical = seo?.canonical || `${SITE_URL}/${loc}${path}`

  // hreflang : une URL par langue + x-default (français).
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
  )
  languages['x-default'] = `${SITE_URL}/${defaultLocale}${path}`

  return {
    // Le layout racine applique deja le gabarit "%s | Sailscents" — on ne fournit ici que le titre de page.
    title,
    description,
    alternates: { canonical, languages },
    robots: seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: image ? [{ url: image }] : undefined,
      locale: loc === 'en' ? 'en_US' : 'fr_FR',
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
