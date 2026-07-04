import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Article } from '@/types/content'

// Rendu dynamique : les donnees viennent de Payload/Postgres, pas de build statique tant que la base n'est pas connectee.
export const dynamic = 'force-dynamic'

export const generateMetadata = async () =>
  buildMetadata({
    fallbackTitle: 'Le Journal',
    fallbackDescription: 'Récits, rituels et savoir-faire autour du Oud, des Attars, du café et du thé.',
    path: '/journal',
  })

export default async function JournalPage() {
  const payload = await getPayloadClient()
  const { docs: articles } = await payload.find({
    collection: 'articles',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    limit: 50,
  })

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl">Le Journal</h1>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {(articles as Article[]).map((article) => (
          <Link
            key={article.id}
            href={`/journal/${article.slug}`}
            className="border border-[color:var(--color-border)] p-6 transition-colors hover:border-[color:var(--color-accent)]"
          >
            <h2 className="text-xl">{article.title}</h2>
            {article.excerpt && <p className="mt-2 text-sm text-[color:var(--color-muted)]">{article.excerpt}</p>}
          </Link>
        ))}
        {articles.length === 0 && (
          <p className="text-[color:var(--color-muted)]">Aucun article publié pour le moment.</p>
        )}
      </div>
    </section>
  )
}
