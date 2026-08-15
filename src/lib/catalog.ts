/**
 * Catalogue Sailscents — source unique des univers (catégories) et des produits,
 * avec leurs prix, rédigé à partir de la liste de prix fournie par le client.
 *
 * Deux usages :
 *  1. La route de seed (`/api/internal/seed`) crée / met à jour les produits en
 *     base de production à partir de ces données (idempotent, brouillon).
 *  2. Les pages « Les Parfums » (huiles) et « Les Encens » (matières à brûler)
 *     filtrent les univers à afficher selon la « porte » de chaque catégorie.
 *
 * Aucune modification de schéma : on ne fait que créer des lignes dans les
 * tables `categories` / `products` qui existent déjà en production.
 *
 * Tarification :
 *  - Huiles (oil)  : prix par 3 ml. La tôla (≈ 12 ml) bénéficie de −15 %.
 *  - À brûler (burn): prix par tôla (11,6 g).
 */

export type CatalogDoor = 'parfums' | 'encens'

export type CatalogCategory = {
  name: string
  slug: string
  door: CatalogDoor
}

export type CatalogProduct = {
  name: string
  slug: string
  categorySlug: string
  // 'oil'  : huile parfumée — variantes 3 ml + 1 tôla (−15 %)
  // 'burn' : matière à brûler — variante 1 tôla (11,6 g)
  kind: 'oil' | 'burn'
  // Huile : prix pour 3 ml. À brûler : prix pour 1 tôla.
  price: number
}

// Ordre d'affichage des univers, par porte.
export const CATALOG_CATEGORIES: CatalogCategory[] = [
  // Les Parfums — huiles
  { name: 'Les Ouds', slug: 'les-ouds', door: 'parfums' },
  { name: 'Les Roses', slug: 'les-roses', door: 'parfums' },
  { name: 'Les Mukhalat', slug: 'les-mukhalat', door: 'parfums' },
  { name: 'Les Dehn', slug: 'les-dehn', door: 'parfums' },
  { name: 'Les Ambres', slug: 'les-ambres', door: 'parfums' },
  // Les Encens — matières à brûler
  { name: 'Oud sauvage', slug: 'oud-sauvage', door: 'encens' },
  { name: 'Oud de plantation', slug: 'plantation-oud', door: 'encens' },
  { name: 'Bokhour', slug: 'bokhour', door: 'encens' },
  { name: 'Lubano', slug: 'lubano', door: 'encens' },
]

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  // ── Les Ouds (huiles, prix / 3 ml) ─────────────────────────────────────────
  { name: 'Oud Silani', slug: 'oud-silani', categorySlug: 'les-ouds', kind: 'oil', price: 330 },
  { name: 'Oud Cambodi 30 ans', slug: 'oud-cambodi-30-ans', categorySlug: 'les-ouds', kind: 'oil', price: 420 },
  { name: 'Oud Cambodi Vintage', slug: 'oud-cambodi-vintage', categorySlug: 'les-ouds', kind: 'oil', price: 260 },
  // Réutilise le produit existant « Oud Meroki » (Merauke).
  { name: 'Oud Merauke', slug: 'oud-meroki', categorySlug: 'les-ouds', kind: 'oil', price: 120 },
  { name: 'Oud Trat Mubakhar', slug: 'oud-trat-mubakhar', categorySlug: 'les-ouds', kind: 'oil', price: 70 },
  { name: 'Oud Trat Royal Qadeem', slug: 'oud-trat-royal-qadeem', categorySlug: 'les-ouds', kind: 'oil', price: 150 },
  { name: 'Oud New School Hindi', slug: 'oud-new-school-hindi', categorySlug: 'les-ouds', kind: 'oil', price: 90 },
  // Réutilise le produit existant « Oud Hindi (Assam) ».
  { name: 'Oud Assam VIP', slug: 'oud-hindi-assam', categorySlug: 'les-ouds', kind: 'oil', price: 120 },
  { name: 'Oud Assam Fakhar', slug: 'oud-assam-fakhar', categorySlug: 'les-ouds', kind: 'oil', price: 290 },
  // Réutilise le produit existant « Oud Borneo » (Bornéo indo).
  { name: 'Oud Borneo Indo', slug: 'oud-borneo', categorySlug: 'les-ouds', kind: 'oil', price: 180 },
  { name: 'Oud Malaysia Finest Bornéo', slug: 'oud-malaysia-finest-borneo', categorySlug: 'les-ouds', kind: 'oil', price: 350 },
  { name: 'Oud Malaysia Qadeem Qadeem', slug: 'oud-malaysia-qadeem-qadeem', categorySlug: 'les-ouds', kind: 'oil', price: 700 },

  // ── Les Roses (huiles, prix / 3 ml) ────────────────────────────────────────
  { name: 'Rose Kashmir', slug: 'rose-kashmir', categorySlug: 'les-roses', kind: 'oil', price: 120 },
  { name: 'Rose Malaki Taïfi', slug: 'rose-malaki-taifi', categorySlug: 'les-roses', kind: 'oil', price: 350 },
  // Réutilise le produit existant « Rose Indienne » (Rose hindi).
  { name: 'Rose Hindi', slug: 'rose-indienne', categorySlug: 'les-roses', kind: 'oil', price: 180 },
  { name: 'Rose Taïfi', slug: 'rose-taifi', categorySlug: 'les-roses', kind: 'oil', price: 140 },

  // ── Les Mukhalat (huiles, prix / 3 ml) ─────────────────────────────────────
  { name: 'Mukhalat Turato', slug: 'mukhalat-turato', categorySlug: 'les-mukhalat', kind: 'oil', price: 90 },
  { name: 'Mukhalat Darr', slug: 'mukhalat-darr', categorySlug: 'les-mukhalat', kind: 'oil', price: 120 },
  { name: 'Mukhalat Fakhama Blend', slug: 'mukhalat-fakhama-blend', categorySlug: 'les-mukhalat', kind: 'oil', price: 300 },
  { name: 'Majaliss al Bawadi', slug: 'majaliss-al-bawadi', categorySlug: 'les-mukhalat', kind: 'oil', price: 90 },

  // ── Les Dehn (huiles, prix / 3 ml) ─────────────────────────────────────────
  { name: 'Dehn al Arabi', slug: 'dehn-al-arabi', categorySlug: 'les-dehn', kind: 'oil', price: 90 },
  { name: 'Dehn al Firansi', slug: 'dehn-al-firansi', categorySlug: 'les-dehn', kind: 'oil', price: 120 },
  { name: 'Dehn Alluban', slug: 'dehn-alluban', categorySlug: 'les-dehn', kind: 'oil', price: 15 },
  { name: 'Dehn al Motia Sandali', slug: 'dehn-al-motia-sandali', categorySlug: 'les-dehn', kind: 'oil', price: 40 },
  { name: 'Ruh al Motiia', slug: 'ruh-al-motiia', categorySlug: 'les-dehn', kind: 'oil', price: 60 },

  // ── Les Ambres (huiles, prix / 3 ml) ───────────────────────────────────────
  { name: 'Amber Malaki', slug: 'amber-malaki', categorySlug: 'les-ambres', kind: 'oil', price: 200 },
  { name: 'Amber Yawmian', slug: 'amber-yawmian', categorySlug: 'les-ambres', kind: 'oil', price: 30 },
  { name: 'Amber Qamari', slug: 'amber-qamari', categorySlug: 'les-ambres', kind: 'oil', price: 60 },

  // ── Oud sauvage (à brûler, prix / tôla 11,6 g) ─────────────────────────────
  { name: 'Merauke Asgon grade AB', slug: 'merauke-asgon-ab', categorySlug: 'oud-sauvage', kind: 'burn', price: 45 },
  { name: 'Dugga Merauke AB', slug: 'dugga-merauke-ab', categorySlug: 'oud-sauvage', kind: 'burn', price: 45 },
  { name: 'Merauke Triple Super AAA', slug: 'merauke-triple-super-aaa', categorySlug: 'oud-sauvage', kind: 'burn', price: 220 },
  { name: 'Merauke Underwater', slug: 'merauke-underwater', categorySlug: 'oud-sauvage', kind: 'burn', price: 290 },
  { name: 'Pontianak Double & Triple Super', slug: 'pontianak-double-triple-super', categorySlug: 'oud-sauvage', kind: 'burn', price: 45 },
  { name: 'Pontianak Underwater', slug: 'pontianak-underwater', categorySlug: 'oud-sauvage', kind: 'burn', price: 65 },
  { name: 'Malino Dugga AA-AB', slug: 'malino-dugga-aa-ab', categorySlug: 'oud-sauvage', kind: 'burn', price: 45 },
  { name: 'Malino Dugga Underwater', slug: 'malino-underwater', categorySlug: 'oud-sauvage', kind: 'burn', price: 60 },
  { name: 'South Thailand AA', slug: 'south-thailand-aa', categorySlug: 'oud-sauvage', kind: 'burn', price: 90 },

  // ── Oud de plantation (à brûler, prix / tôla) ──────────────────────────────
  { name: 'Chinese Underwater (Kynam)', slug: 'chinese-underwater-kynam', categorySlug: 'plantation-oud', kind: 'burn', price: 70 },

  // ── Bokhour (à brûler, prix / tôla) ────────────────────────────────────────
  { name: 'Malaki Bokhor', slug: 'malaki-bokhor', categorySlug: 'bokhour', kind: 'burn', price: 29 },
  { name: 'Arrouss Bokhor', slug: 'arrouss-bokhor', categorySlug: 'bokhour', kind: 'burn', price: 29 },
  { name: 'Kasrat Kalimantan', slug: 'kasrat-kalimantan', categorySlug: 'bokhour', kind: 'burn', price: 39 },

  // ── Lubano (à brûler, prix / tôla) ─────────────────────────────────────────
  { name: 'Hojari', slug: 'hojari', categorySlug: 'lubano', kind: 'burn', price: 5 },
  { name: 'SPL Grade Brown', slug: 'spl-grade-brown', categorySlug: 'lubano', kind: 'burn', price: 5 },
]

// Stock par défaut « en stock » (ajustable ensuite dans l'admin).
export const CATALOG_DEFAULT_STOCK = 20

export type CatalogVariant = {
  label: string
  price: number
  compareAtPrice?: number
  stock: number
}

/**
 * Variantes d'un produit selon son type.
 *  - Huile : 3 ml au prix indiqué + 1 tôla (≈ 12 ml) à −15 % (prix barré = plein tarif).
 *  - À brûler : 1 tôla (11,6 g) au prix indiqué.
 */
export function catalogVariants(product: CatalogProduct): CatalogVariant[] {
  if (product.kind === 'oil') {
    const full = product.price * 4 // 4 × 3 ml, plein tarif
    const tola = Math.round(full * 0.85) // −15 % par tôla
    return [
      { label: '3 ml', price: product.price, stock: CATALOG_DEFAULT_STOCK },
      { label: '1 tôla (≈ 12 ml)', price: tola, compareAtPrice: full, stock: CATALOG_DEFAULT_STOCK },
    ]
  }
  return [{ label: '1 tôla (11,6 g)', price: product.price, stock: CATALOG_DEFAULT_STOCK }]
}

// Slugs des univers par porte (ordre d'affichage conservé).
export const PARFUMS_CATEGORY_SLUGS = CATALOG_CATEGORIES.filter((c) => c.door === 'parfums').map((c) => c.slug)
export const ENCENS_CATEGORY_SLUGS = CATALOG_CATEGORIES.filter((c) => c.door === 'encens').map((c) => c.slug)

/**
 * Regroupe les produits publiés par univers, pour une porte donnée
 * (Les Parfums = huiles, Les Encens = matières à brûler). Les univers hors
 * porte sont ignorés ; les groupes vides sont retirés ; l'ordre du catalogue
 * est respecté.
 */
export function groupProductsByDoor<
  C extends { id: number | string; slug: string },
  P extends { category: unknown },
>(door: CatalogDoor, categories: C[], products: P[]): { category: C; items: P[] }[] {
  const order = door === 'parfums' ? PARFUMS_CATEGORY_SLUGS : ENCENS_CATEGORY_SLUGS
  return categories
    .filter((c) => order.includes(c.slug))
    .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug))
    .map((category) => ({
      category,
      items: products.filter((prod) => {
        const catId =
          typeof prod.category === 'object' && prod.category
            ? (prod.category as { id: unknown }).id
            : prod.category
        return catId === category.id
      }),
    }))
    .filter((group) => group.items.length > 0)
}
