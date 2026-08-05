/**
 * Traductions EN du contenu produit — dans le code, sans toucher à la base.
 * Le FR reste géré dans l'admin Payload ; l'EN est fourni ici, par slug.
 * Si une traduction manque, on retombe automatiquement sur le FR.
 *
 * Le jour où le client voudra éditer l'EN lui-même, on passera à une
 * localisation en base (migration prudente).
 */
import { lexicalFromParagraphs } from '@/lib/lexical'
import type { Category, Product } from '@/types/content'
import type { Locale } from './config'

type ProductEn = {
  name?: string
  shortDescription?: string
  notesTop?: string
  notesHeart?: string
  notesBase?: string
  originCountry?: string
  originMethod?: string
  description?: string[]
}

const PRODUCTS_EN: Record<string, ProductEn> = {
  'oud-vietnam': {
    shortDescription: 'Vietnamese-style oil: sweet and fruity, notes of red fruits, honey and chocolatey wood.',
    notesHeart: 'Red fruits, fig, plum, honey, caramel, chocolatey wood',
    originCountry: 'Vietnam',
    originMethod: 'Distillation — Vietnamese style',
    description: [
      'Vietnamese-style oils are rich, aromatic and tangy. Vietnam is home to kyara, that very rare, densely resinated Oud wood considered the crème de la crème of the Oud world. The country is also the source of the finest “ground” agarwood — densely resinated fragments from felled trees, partly buried under earth and leaves.',
      'Today, genuine Vietnamese distillation wood is almost impossible to find: every piece coming out of the jungle is bought by the great Japanese incense houses and private collectors. So we mostly speak of a “Vietnamese-style” oil, which recomposes the characteristics of the original Vietnamese Oud.',
      'The profile: sweet, with notes of red fruits and berries, fig and plum; touches of honey and caramel; a wood evoking soft chocolate. No stale, fermented or sour smell — and a characteristic reddish colour.',
    ],
  },
  'oud-borneo': {
    shortDescription: 'Borneo-style oil: airy, light and smooth, between pine, camphor and creamy vanilla.',
    notesHeart: 'Pine needles, camphor, mint, creamy vanilla, raw honey, white flowers',
    originCountry: 'Borneo',
    originMethod: 'Distillation — Borneo style',
    description: [
      'Borneo Oud oils come from several Aquilaria species grown on the island of Borneo, in a very warm rainforest climate. Whatever the species, the oils share the same profile: a fresh, light character much prized in the Oud world.',
      'We speak of “Borneo” style because it is the olfactory profile of the geographic area — more than the species — that matters. The island’s Oud also tends to be superior to that of the Malay or Indonesian mainland.',
      'The profile: airy, light and smooth; rich in terpenoids (pine needles, camphor, sometimes mint); creamy vanilla nuances; overall sweet, sometimes with a hint of bitterness, and surprising notes of white flowers, raw honey and herbs. Often described as transcendental, meditative and sparkling.',
    ],
  },
  'oud-hindi-assam': {
    shortDescription: 'Indian-style oil: animalic, smoky, leather and hay — powerful, regal and uncompromising.',
    notesHeart: 'Animalic, hay, tea, straw, wood, spices, smoke, leather',
    originCountry: 'Assam (India)',
    originMethod: 'Traditional Indian distillation (long soak)',
    description: [
      'Hindi Oud — also called Indian, Bengali or Assam — was originally distilled exclusively from Agallocha-species trees growing in Assam, a mountainous region of north-east India known for its tea plantations.',
      'Much loved by the royal families of the Middle East and the Emirates, this style spread throughout Arab culture. Its profile: animalic, with strong notes of hay and manure; nuances of tea, straw, wood and spices; smoke and leather as signatures. Strong, austere, uncompromising — yet regal and spiritually elevating.',
      'The Indian style is born of the combination of a species (Agallocha) and a method: a longer-than-usual soaking of the wood before distillation, which produces that sour, fermented edge so characteristic of a good “Hindi”.',
    ],
  },
  'oud-meroki': {
    shortDescription: 'Indonesian Oud from Maroke: green, damp, pure and smoky — truffled, earthy and wild.',
    notesHeart: 'Green (mint), truffle, earth, wood, smoke',
    originCountry: 'Merauke (Indonesia)',
    originMethod: 'Distillation — Maroke region',
    description: [
      'Here is an Indonesian Oud among the country’s countless varieties — a huge diversity, as with quality in general. The best examples evoke the smell of Oud burned as incense: green (like mint), damp, pure and smoky.',
      'Maroke oils come from the region of the same name (Merauke). Pure, they are truffled, earthy, wild and woody. Less accessible than its peers, it is hard to find — and rarity means a good quality remains precious.',
    ],
  },
  'rose-taifi': {
    shortDescription: 'Taïf rose (Damascena): opulent, powerful, citrusy and fruity, with a finely musky finish.',
    notesHeart: 'Citrus, fruits, freshness, fine spices, musk',
    originCountry: 'Taïf',
    originMethod: 'Rosa Damascena',
    description: [
      'Rosa Damascena, the Damascus rose, owes its name to the ancient city of Damascus — but its true origin is Shiraz, in Persia. A hybrid of Rosa Gallica, Moschata and Fedtschenkoana, it travelled from Shiraz to Damascus, then to Europe with the Crusades, adopted in royal gardens and apothecaries for its virtues and its scent.',
      'My Taïf rose is a Damascena to wear on clothes, shirts and qamis, where it truly lasts a long time.',
      'Very opulent and powerful, quite citrusy and fruity, refreshing in its freshness and finely spiced at once, it finishes on musky notes.',
    ],
  },
  'rose-kashmir': {
    shortDescription: 'Kashmir rose (Damascena): a citrus lemonade, sweet mandarin, a green and honeyed note.',
    notesHeart: 'Sweet mandarin, citrus marmalade, green stem note, musk, honey',
    originCountry: 'Kashmir',
    originMethod: 'High-altitude Rosa Damascena',
    description: [
      'A high-altitude Damascena, cold-resistant, with beautiful longevity. You want to drink it: a real Italian lemonade.',
      'Sweet mandarin note, citrus marmalade, green accents of the stem, musky and honeyed facets. A rose of high altitudes, as beautiful and tenacious as the Taïfi.',
    ],
  },
  'oud-silani': {
    shortDescription: 'Sri Lankan Oud: highly aromatic and powerful, dry spices and a marine note — deeply addictive.',
    notesHeart: 'Dry spices, marine note (sea spray, rocks), Aquilaria wood, incense',
    originCountry: 'Sri Lanka',
    originMethod: 'Distillation (Aquilaria)',
    description: [
      'Silani Oud takes its name from “Silan”, the other Arabic name for Sri Lanka.',
      'A highly aromatic and powerful oil: notes of dry spices and a marine facet — the smell of rocks bathed in sea spray — irresistibly addictive. Then comes the woody heart of Aquilaria, that incense smell we know from its smoke.',
      'A fine and deeply addictive Oud, one of the best Sri Lankans I have known so far. A small batch is currently available: to buy without moderation, and to savour occasionally.',
    ],
  },
  'rose-azerbaidjan-1972': {
    shortDescription: 'A vintage collector’s rose (1972): fresh fruitiness turned heady, sweet spirits and wooden casks.',
    notesHeart: 'Citrus, liqueur-like red fruits, sweet spirituous alcohol, wooden casks',
    originCountry: 'Azerbaijan',
    originMethod: 'Rosa Damascena — vintage maceration (1972)',
    description: [
      'A vintage collector’s rose. With age, its citrus, fruity and fresh notes have turned heady: a sweet spirituous alcohol recalling the wooden casks in which whisky is kept.',
      'Today one finds liqueur-like red-fruit notes. The age of the maceration is the factor behind this transformation. An incredible collector’s rose.',
    ],
  },
  'rose-indienne': {
    shortDescription: 'Indian Damascena rose: one of the most powerful there is — fruity, bitter citrus and green stem notes.',
    notesHeart: 'Fruity citrus, bitterness, green notes of cut stems, warmth',
    originCountry: 'India',
    originMethod: 'Rosa Damascena (stem included in distillation)',
    description: [
      'A very powerful rose — one of the most powerful I have had in my life. A smell of fruity and bitter citrus at once, with green notes of cut stems: as if the stem had been distilled with it.',
      'It stays powerful on clothes; this warm Indian rose stands out. A rose from another world — you have to smell it to believe it. Lovers of powerful roses will be delighted, for sure.',
    ],
  },
  'mukhalat-wahir': {
    shortDescription: 'A signature blend: natural Thai Oud embraced by roses, caught in a spiral of musk.',
    notesHeart: 'Natural Thai Oud, bouquet of roses, white animalic musk (gazelle)',
    originCountry: 'Blend',
    originMethod: 'Perfumer’s blend',
    description: [
      'A simple and effective blend, the composition of an experienced perfumer: seductive, opulent, and very long-lasting on the skin.',
      'Notes of natural Thai Oud embraced by a bouquet of roses, immediately caught in a spiral of white animalic musk (gazelle).',
      'This is the mukhalat I recommend to everyone — it will win over everyone around you.',
    ],
  },
}

// Nom d'univers (catégorie) en EN, par slug.
const CATEGORIES_EN: Record<string, string> = {
  'les-ouds': 'Ouds',
  'les-roses': 'Roses',
  'les-mukhalat': 'Mukhalat',
}

/** Renvoie le produit avec le contenu EN superposé (repli FR) si langue = en. */
export function localizeProduct(product: Product, locale: Locale): Product {
  if (locale !== 'en') return product
  const tr = PRODUCTS_EN[product.slug]
  if (!tr) return product

  return {
    ...product,
    name: tr.name ?? product.name,
    shortDescription: tr.shortDescription ?? product.shortDescription ?? null,
    olfactiveNotes: {
      top: tr.notesTop ?? product.olfactiveNotes?.top ?? null,
      heart: tr.notesHeart ?? product.olfactiveNotes?.heart ?? null,
      base: tr.notesBase ?? product.olfactiveNotes?.base ?? null,
    },
    origin: {
      country: tr.originCountry ?? product.origin?.country ?? null,
      method: tr.originMethod ?? product.origin?.method ?? null,
    },
    description: tr.description ? lexicalFromParagraphs(tr.description) : product.description,
  }
}

/** Nom d'univers localisé (repli FR). */
export function localizeCategoryName(category: Category, locale: Locale): string {
  if (locale !== 'en') return category.name
  return CATEGORIES_EN[category.slug] ?? category.name
}
