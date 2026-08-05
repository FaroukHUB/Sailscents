import { RichText } from '@payloadcms/richtext-lexical/react'

import { getPayloadClient } from '@/lib/payload'
import { richTextToPlainText } from '@/lib/richTextToPlainText'
import { buildMetadata } from '@/lib/seo'
import { defaultLocale, isLocale } from '@/i18n/config'

export const dynamic = 'force-dynamic'

const CONTENT = {
  fr: {
    metaTitle: 'Foire aux questions',
    metaDescription: 'Livraison, produits, Le Rituel : toutes les réponses à vos questions.',
    h1: 'Foire aux questions',
    empty: 'Aucune question pour le moment.',
  },
  en: {
    metaTitle: 'Frequently asked questions',
    metaDescription: 'Shipping, products, the Ritual: all the answers to your questions.',
    h1: 'Frequently asked questions',
    empty: 'No questions yet.',
  },
}

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const t = CONTENT[loc]
  return buildMetadata({ fallbackTitle: t.metaTitle, fallbackDescription: t.metaDescription, path: '/faq', locale: loc })
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = CONTENT[locale]

  const payload = await getPayloadClient()
  const { docs: faqs } = await payload.find({ collection: 'faqs', sort: 'order', limit: 200 })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: richTextToPlainText(faq.answer) },
    })),
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-4xl">{t.h1}</h1>

      <div className="mt-12 flex flex-col divide-y divide-[color:var(--color-border)]">
        {faqs.map((faq) => (
          <details key={faq.id} className="py-6">
            <summary className="cursor-pointer text-lg">{faq.question}</summary>
            <div className="prose prose-invert mt-4 max-w-none text-[color:var(--color-muted)]">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <RichText data={faq.answer as any} />
            </div>
          </details>
        ))}
        {faqs.length === 0 && <p className="py-6 text-[color:var(--color-muted)]">{t.empty}</p>}
      </div>
    </section>
  )
}
