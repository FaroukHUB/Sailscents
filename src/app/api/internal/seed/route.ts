import { NextResponse } from 'next/server'

import { lexicalFromParagraphs } from '@/lib/lexical'
import { getPayloadClient } from '@/lib/payload'
import { SEED_CATEGORIES, SEED_DEFAULT_STOCK, SEED_PRODUCTS, seedDefaultVariants } from '@/lib/seedProducts'

/**
 * Route temporaire a usage unique : peuple le catalogue (categories + produits)
 * en production a partir des textes du client. Idempotente : un slug deja
 * present est ignore (jamais ecrase). Produits crees en BROUILLON.
 * A supprimer une fois le catalogue en place.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  // Comparaison tolerante : on ignore les espaces/retours de fin (fréquents dans
  // les variables d'env) et le cas ou un « + » du secret a ete decode en espace
  // par l'URL.
  const provided = (searchParams.get('secret') ?? '').trim()
  const expected = (process.env.PAYLOAD_SECRET ?? '').trim()
  const matches = provided === expected || provided.replace(/ /g, '+') === expected
  if (!expected || !matches) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    const result = { categories: { created: [] as string[], skipped: [] as string[] }, products: { created: [] as string[], skipped: [] as string[] } }

    // Categories (par slug, idempotent) -> on garde l'id par slug.
    const categoryIdBySlug: Record<string, number> = {}
    for (const cat of SEED_CATEGORIES) {
      const existing = await payload.find({ collection: 'categories', where: { slug: { equals: cat.slug } }, limit: 1 })
      if (existing.docs.length > 0) {
        categoryIdBySlug[cat.slug] = existing.docs[0].id as number
        result.categories.skipped.push(cat.slug)
        continue
      }
      const created = await payload.create({ collection: 'categories', data: { name: cat.name, slug: cat.slug } })
      categoryIdBySlug[cat.slug] = created.id as number
      result.categories.created.push(cat.slug)
    }

    // Produits (par slug, idempotent).
    for (const p of SEED_PRODUCTS) {
      const existing = await payload.find({ collection: 'products', where: { slug: { equals: p.slug } }, limit: 1 })
      if (existing.docs.length > 0) {
        result.products.skipped.push(p.slug)
        continue
      }
      const categoryId = categoryIdBySlug[p.categorySlug]
      if (!categoryId) {
        result.products.skipped.push(`${p.slug} (catégorie manquante)`)
        continue
      }
      await payload.create({
        collection: 'products',
        data: {
          name: p.name,
          slug: p.slug,
          status: 'draft',
          category: categoryId,
          shortDescription: p.shortDescription,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: lexicalFromParagraphs(p.description) as any,
          olfactiveNotes: { heart: p.notesHeart },
          origin: { country: p.originCountry, method: p.originMethod },
          variants: p.variants ? p.variants.map((v) => ({ ...v, stock: SEED_DEFAULT_STOCK })) : seedDefaultVariants(),
        },
      })
      result.products.created.push(p.slug)
    }

    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
