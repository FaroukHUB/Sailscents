/**
 * Types front minimalistes, en attendant `npm run generate:types` (qui necessite
 * une base Postgres connectee) pour basculer sur les types Payload generes.
 */

export type Media = {
  id: number
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

export type Seo = {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: Media | number | null
  canonical?: string | null
  noIndex?: boolean | null
  structuredData?: unknown
}

export type Category = {
  id: number
  name: string
  slug: string
  description?: unknown
  heroImage?: Media | number | null
  seo?: Seo
}

export type ProductVariant = {
  label: string
  sku?: string | null
  price: number
  compareAtPrice?: number | null
  stock?: number | null
}

export type Product = {
  id: number
  name: string
  slug: string
  status: 'draft' | 'published' | 'outOfStock' | 'archived'
  category: Category | number
  shortDescription?: string | null
  description?: unknown
  olfactiveNotes?: { top?: string | null; heart?: string | null; base?: string | null } | null
  origin?: { country?: string | null; method?: string | null } | null
  mainImage?: Media | number | null
  gallery?: { image: Media | number }[] | null
  variants?: ProductVariant[]
  seo?: Seo
}

export type ProductCollection = {
  id: number
  name: string
  slug: string
  description?: unknown
  coverImage?: Media | number | null
  products?: Product[] | number[]
  seo?: Seo
}

export type Article = {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  content?: unknown
  coverImage?: Media | number | null
  publishedDate?: string | null
  seo?: Seo
}

export type PageBlock =
  | { blockType: 'hero'; heading: string; subheading?: string | null; image?: Media | number | null }
  | { blockType: 'content'; richText?: unknown }
  | { blockType: 'cta'; text?: string | null; buttonLabel?: string | null; buttonHref?: string | null }

export type StaticPage = {
  id: number
  title: string
  slug: string
  layout?: PageBlock[]
  seo?: Seo
}

export type HomepagePanel = { image?: Media | number | null }

// Une image par porte. On reutilise les colonnes historiques (deja en base) ;
// leur nom ne change pas, seul l'usage (image revelee derriere chaque porte).
export type Homepage = {
  boutiquePanel?: HomepagePanel
  collectionsPanel?: HomepagePanel
  ateliersPanel?: HomepagePanel
  journalPanel?: HomepagePanel
  maisonPanel?: HomepagePanel
}
