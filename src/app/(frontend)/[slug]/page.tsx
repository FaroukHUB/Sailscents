import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Media, PageBlock, StaticPage } from '@/types/content'

// Rendu dynamique : les donnees viennent de Payload/Postgres, pas de build statique tant que la base n'est pas connectee.
export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ slug: string }> }

const getPage = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return (docs[0] as StaticPage) ?? null
}

export const generateMetadata = async ({ params }: Args) => {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}

  return buildMetadata({ seo: page.seo, fallbackTitle: page.title, path: `/${page.slug}` })
}

const Block = ({ block }: { block: PageBlock }) => {
  switch (block.blockType) {
    case 'hero': {
      const image = block.image && typeof block.image === 'object' ? (block.image as Media) : null
      return (
        <div className="py-16 text-center">
          <h1 className="text-4xl">{block.heading}</h1>
          {block.subheading && <p className="mt-4 text-[color:var(--color-muted)]">{block.subheading}</p>}
          {image?.url && (
            <Image
              src={image.url}
              alt={image.alt ?? ''}
              width={image.width ?? 1200}
              height={image.height ?? 630}
              className="mx-auto mt-8"
            />
          )}
        </div>
      )
    }
    case 'content':
      return (
        <div className="prose prose-invert max-w-none py-8">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <RichText data={block.richText as any} />
        </div>
      )
    case 'cta':
      return (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          {block.text && <p className="text-xl">{block.text}</p>}
          {block.buttonHref && block.buttonLabel && (
            <Link
              href={block.buttonHref}
              className="border border-[color:var(--color-accent)] px-8 py-3 text-sm tracking-widest uppercase text-[color:var(--color-accent)]"
            >
              {block.buttonLabel}
            </Link>
          )}
        </div>
      )
    default:
      return null
  }
}

export default async function StaticPageRoute({ params }: Args) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      {(!page.layout || page.layout.length === 0) && <h1 className="text-4xl">{page.title}</h1>}
      {page.layout?.map((block, index) => <Block key={index} block={block} />)}
    </section>
  )
}
