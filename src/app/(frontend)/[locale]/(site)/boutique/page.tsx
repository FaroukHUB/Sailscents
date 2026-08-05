import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'
import type { Category } from '@/types/content'

export const dynamic = 'force-dynamic'

const CONTENT: Record<Locale, { metaTitle: string; metaDescription: string; h1: string; lede: string; empty: string }> = {
  fr: {
    metaTitle: 'Boutique',
    metaDescription: 'Le catalogue complet Sailscents : Oud, Attars, Encens, Café et Thé.',
    h1: 'Boutique',
    lede: 'Explorez nos univers, du bois de Oud aux infusions les plus rares.',
    empty: 'Aucun univers publié pour le moment — ajoutez-en un depuis l’admin Payload.',
  },
  en: {
    metaTitle: 'Boutique',
    metaDescription: 'The full Sailscents catalogue: Oud, Attars, Incense, Coffee and Tea.',
    h1: 'Boutique',
    lede: 'Explore our worlds, from Oud wood to the rarest infusions.',
    empty: 'No world published yet — add one from the Payload admin.',
  },
}

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const t = CONTENT[loc]
  return buildMetadata({ fallbackTitle: t.metaTitle, fallbackDescription: t.metaDescription, path: '/boutique', locale: loc })
}

export default async function BoutiquePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = CONTENT[locale]
  const p = (path: string) => `/${locale}${path}`

  const payload = await getPayloadClient()
  const { docs: categories } = await payload.find({ collection: 'categories', limit: 50, sort: 'name' })

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl">{t.h1}</h1>
      <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">{t.lede}</p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {(categories as Category[]).map((category) => (
          <Link
            key={category.id}
            href={p(`/boutique/${category.slug}`)}
            className="border border-[color:var(--color-border)] p-8 transition-colors hover:border-[color:var(--color-accent)]"
          >
            <h2 className="text-2xl">{category.name}</h2>
          </Link>
        ))}
        {categories.length === 0 && <p className="text-[color:var(--color-muted)]">{t.empty}</p>}
      </div>
    </section>
  )
}
