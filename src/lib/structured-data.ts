/**
 * Donnees structurees Schema.org (JSON-LD).
 *
 * Objectif SEO : aider Google a comprendre que Sailscents est une entite
 * experte d'une niche precise (Oud, Attars, encens, the et cafe d'exception
 * d'Asie orientale) et non un revendeur generique — c'est ce qui nourrit le
 * signal E-E-A-T (expertise, autorite, fiabilite).
 */

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './constants'

/** Les domaines d'expertise revendiques par la maison — signal de niche. */
const EXPERTISE = [
  'Bois de Oud',
  'Attars et huiles parfumees',
  'Encens et voie du Kōdō',
  'Thés rares d’Asie orientale',
  'Cafés d’exception',
  'Parfumerie de niche',
]

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    slogan: 'Du palais au nez',
    description: SITE_DESCRIPTION,
    knowsAbout: EXPERTISE,
  }
}

export function webPageJsonLd(params: {
  path: string
  name: string
  description: string
  type?: 'WebPage' | 'AboutPage' | 'CollectionPage'
}) {
  const { path, name, description, type = 'WebPage' } = params
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${SITE_URL}${path}#webpage`,
    url: `${SITE_URL}${path}`,
    name,
    description,
    isPartOf: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'fr-FR',
  }
}

/** Le Rituel : une prestation (seance privee sur rendez-vous, sans frais). */
export function serviceJsonLd(params: { path: string; name: string; description: string }) {
  const { path, name, description } = params
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}${path}#service`,
    serviceType: 'Séance privée de découverte olfactive',
    name,
    description,
    provider: { '@id': `${SITE_URL}/#organization` },
    url: `${SITE_URL}${path}`,
    areaServed: 'France',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${SITE_URL}${path}`,
      availableLanguage: 'fr',
    },
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      description: 'Sur rendez-vous, sans engagement.',
    },
  }
}

/** Le Journal : un blog editorial + la liste ordonnee de ses articles. */
export function blogJsonLd(params: {
  path: string
  name: string
  description: string
  articles: { title: string; slug: string; publishedDate?: string | null }[]
}) {
  const { path, name, description, articles } = params
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}${path}#blog`,
    url: `${SITE_URL}${path}`,
    name,
    description,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'fr-FR',
    blogPost: articles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      url: `${SITE_URL}/journal/${article.slug}`,
      datePublished: article.publishedDate ?? undefined,
    })),
  }
}

/** Fil d'Ariane : structure l'arborescence pour Google. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
