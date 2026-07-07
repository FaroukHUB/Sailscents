import { RichText } from '@payloadcms/richtext-lexical/react'

import { getPayloadClient } from '@/lib/payload'
import { richTextToPlainText } from '@/lib/richTextToPlainText'
import { buildMetadata } from '@/lib/seo'

// Rendu dynamique : les donnees viennent de Payload/Postgres, pas de build statique tant que la base n'est pas connectee.
export const dynamic = 'force-dynamic'

export const generateMetadata = async () =>
  buildMetadata({
    fallbackTitle: 'Foire aux questions',
    fallbackDescription: 'Livraison, produits, Le Rituel : toutes les réponses à vos questions.',
    path: '/faq',
  })

export default async function FaqPage() {
  const payload = await getPayloadClient()
  const { docs: faqs } = await payload.find({
    collection: 'faqs',
    sort: 'order',
    limit: 200,
  })

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

      <h1 className="text-4xl">Foire aux questions</h1>

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
        {faqs.length === 0 && <p className="py-6 text-[color:var(--color-muted)]">Aucune question pour le moment.</p>}
      </div>
    </section>
  )
}
