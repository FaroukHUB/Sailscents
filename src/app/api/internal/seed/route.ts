import { NextResponse } from 'next/server'

import productCopy from '@/data/product-copy.json'
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS, catalogVariants } from '@/lib/catalog'
import { lexicalFromParagraphs } from '@/lib/lexical'
import { getPayloadClient } from '@/lib/payload'

type ProductCopy = {
  shortDescription?: string
  notesTop?: string
  notesHeart?: string
  notesBase?: string
  originCountry?: string
  originMethod?: string
  description?: string[]
}

const COPY: Record<string, ProductCopy> = productCopy

/**
 * Route temporaire à usage unique : met le catalogue à jour en production à
 * partir de la liste de prix du client (voir `src/lib/catalog.ts`).
 *
 * Idempotente et non destructive :
 *  - Catégories : créées par slug si absentes, sinon réutilisées.
 *  - Produits existants (par slug) : on met à jour UNIQUEMENT les prix
 *    (variantes) et l'univers — le nom, les notes et la description saisis
 *    dans l'admin sont préservés, ainsi que le statut (publié / brouillon).
 *  - Produits absents : créés en BROUILLON, sans description (le client les
 *    fournira ensuite), avec leurs variantes tarifées.
 *
 * Aucun produit n'est supprimé. À retirer une fois le catalogue en place.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  // Comparaison tolérante : on ignore les espaces/retours de fin (fréquents
  // dans les variables d'env) et le cas où un « + » du secret a été décodé en
  // espace par l'URL.
  const provided = (searchParams.get('secret') ?? '').trim()
  const expected = (process.env.PAYLOAD_SECRET ?? '').trim()
  const matches = provided === expected || provided.replace(/ /g, '+') === expected
  if (!expected || !matches) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    const result = {
      categories: { created: [] as string[], skipped: [] as string[] },
      products: { created: [] as string[], updated: [] as string[], skipped: [] as string[] },
    }

    // Univers (par slug, idempotent) — on garde l'id par slug.
    const categoryIdBySlug: Record<string, number> = {}
    for (const cat of CATALOG_CATEGORIES) {
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

    // Produits (par slug).
    for (const p of CATALOG_PRODUCTS) {
      const categoryId = categoryIdBySlug[p.categorySlug]
      if (!categoryId) {
        result.products.skipped.push(`${p.slug} (univers manquant)`)
        continue
      }
      const variants = catalogVariants(p)
      const copy = COPY[p.slug]
      const existing = await payload.find({ collection: 'products', where: { slug: { equals: p.slug } }, limit: 1 })

      if (existing.docs.length > 0) {
        // Mise à jour non destructive : on met à jour les prix (variantes),
        // l'univers et on PUBLIE. Le nom, les notes et la description saisis
        // en base sont préservés (on n'écrase jamais le contenu existant).
        await payload.update({
          collection: 'products',
          id: existing.docs[0].id,
          data: { category: categoryId, variants, status: 'published' },
        })
        result.products.updated.push(p.slug)
        continue
      }

      // Création : produit publié, avec sa fiche (accroche, notes, origine,
      // description) issue de src/data/product-copy.json quand elle existe.
      await payload.create({
        collection: 'products',
        data: {
          name: p.name,
          slug: p.slug,
          status: 'published',
          category: categoryId,
          variants,
          ...(copy?.shortDescription ? { shortDescription: copy.shortDescription } : {}),
          ...(copy?.notesTop || copy?.notesHeart || copy?.notesBase
            ? { olfactiveNotes: { top: copy.notesTop, heart: copy.notesHeart, base: copy.notesBase } }
            : {}),
          ...(copy?.originCountry || copy?.originMethod
            ? { origin: { country: copy.originCountry, method: copy.originMethod } }
            : {}),
          ...(copy?.description
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              { description: lexicalFromParagraphs(copy.description) as any }
            : {}),
        },
      })
      result.products.created.push(p.slug)
    }

    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
