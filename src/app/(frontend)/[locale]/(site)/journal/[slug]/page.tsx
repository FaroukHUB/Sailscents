import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Article } from '@/types/content'

// Rendu dynamique : les donnees viennent de Payload/Postgres, pas de build statique tant que la base n'est pas connectee.
export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

const getArticle = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return (docs[0] as Article) ?? null
}

export const generateMetadata = async ({ params }: Args) => {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}

  return buildMetadata({
    seo: article.seo,
    fallbackTitle: article.title,
    fallbackDescription: article.excerpt ?? undefined,
    fallbackImage: article.coverImage,
    path: `/journal/${article.slug}`,
  })
}

export default async function ArticlePage({ params }: Args) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt ?? undefined,
    datePublished: article.publishedDate ?? undefined,
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-4xl">{article.title}</h1>
      {article.excerpt && <p className="mt-4 text-[color:var(--color-muted)]">{article.excerpt}</p>}

      {article.content ? (
        <div className="prose prose-invert mt-10 max-w-none">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <RichText data={article.content as any} />
        </div>
      ) : null}
    </article>
  )
}
