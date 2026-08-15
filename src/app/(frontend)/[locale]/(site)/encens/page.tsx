import Image from 'next/image'
import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { HeroImage } from '@/components/HeroImage'
import { groupProductsByDoor } from '@/lib/catalog'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { getSectionImage } from '@/lib/sectionImage'
import { breadcrumbJsonLd, faqPageJsonLd, webPageJsonLd } from '@/lib/structured-data'
import { getDictionary } from '@/i18n'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'
import { localizeCategoryName, localizeProduct } from '@/i18n/productTranslations'
import type { Category, Media, Product } from '@/types/content'

export const dynamic = 'force-dynamic'

const PATH = '/encens'

// Prix d'appel : la variante la moins chère.
const fromPrice = (product: Product) => {
  const prices = (product.variants ?? []).map((v) => v.price).filter((n): n is number => typeof n === 'number')
  return prices.length ? Math.min(...prices) : null
}

// Image principale du produit (si renseignée dans l'admin), sinon null.
const productImage = (product: Product) => {
  const m = product.mainImage
  return m && typeof m === 'object' ? (m as Media) : null
}

// Matières à brûler publiées, groupées par univers (Oud sauvage, plantation,
// Bokhour, Lubano). Le contenu produit reste tel qu'il est en base.
const getCatalogue = async () => {
  const payload = await getPayloadClient()
  const [{ docs: categories }, { docs: products }] = await Promise.all([
    payload.find({ collection: 'categories', limit: 50, sort: 'name' }),
    payload.find({ collection: 'products', where: { status: { equals: 'published' } }, limit: 200, depth: 1 }),
  ])
  return groupProductsByDoor('encens', categories as Category[], products as Product[])
}

const CONTENT = {
  fr: {
    metaTitle: 'Les Encens — la voie du Kōdō, l’art de l’encens',
    metaDescription:
      'Encens et bois à brûler dans la tradition japonaise du Kōdō : bois de Oud, résines et matières nobles, à « écouter » plutôt qu’à sentir. Une sélection de connaisseurs.',
    breadcrumb: 'Les Encens',
    name: 'Les Encens',
    kicker: 'La voie du Kōdō',
    h1: 'Les Encens',
    lede: 'Bois à brûler et résines nobles dans la tradition japonaise de l’encens — des matières que l’on écoute plutôt qu’on ne sent, dans le silence et la lenteur.',
    shop: {
      kicker: 'La sélection',
      h2: 'Nos matières à brûler à commander',
      lede: 'Oud sauvage, bokhour et résines, vendus à la tôla (11,6 g). Choisissez sur la fiche de chaque matière.',
    },
    noteLabels: { top: 'Tête', heart: 'Cœur', base: 'Fond' },
    kodo: {
      kicker: '« Écouter » l’encens',
      h2: 'Le Kōdō, un art de l’attention',
      p1: 'Dans la voie du Kōdō, l’encens n’est pas un décor : c’est une expérience. On prépare le geste, on ralentit, on porte attention à chaque nuance de la volute. La fumée parfumante devient un fil conducteur, presque une méditation.',
      p2: 'C’est cet esprit qui guide notre sélection : des matières assez nobles pour mériter qu’on s’y arrête.',
      caption: 'L’encensoir et sa volute',
    },
    matieres: {
      kicker: 'Nos matières',
      h2: 'Bois, résines et Oud à brûler',
      p: 'Copeaux de Oud, résines et bois odorants : chaque matière est choisie pour la qualité de sa combustion et la finesse de son parfum. Rien de saturé, rien de synthétique — seulement la vérité d’une belle matière qui se consume.',
      caption: 'Copeaux de Oud & résines',
    },
    faqKicker: 'Questions fréquentes',
    faqTitle: 'Comprendre l’encens',
    faq: [
      { question: 'Qu’est-ce que le Kōdō ?', answer: 'Le Kōdō, ou « voie de l’encens », est l’une des trois grandes cérémonies raffinées du Japon, aux côtés du thé et de l’ikebana. On n’y dit pas que l’on « sent » l’encens : on l’« écoute ». Tout y est attention, silence et lenteur.' },
      { question: 'Comment utiliser un encens de qualité ?', answer: 'Sur charbon ou brûleur adapté, à faible chaleur, pour laisser la matière se révéler sans la brûler. Quelques éclats de bois suffisent : l’objectif est la finesse de la volute, pas la quantité de fumée.' },
      { question: 'Le bois de Oud se brûle-t-il aussi ?', answer: 'Oui. Au-delà des parfums, le Oud se brûle en copeaux : c’est l’une des expériences olfactives les plus recherchées, profonde, résineuse et enveloppante, au cœur de la tradition du Kōdō.' },
    ],
    cta: { kicker: 'Vivre le Kōdō', h2: 'Autour de l’encensoir', p: 'La meilleure façon de comprendre l’encens reste de l’écouter avec nous, autour de l’encensoir. Sur rendez-vous, sans frais.', button: 'Nous rencontrer' },
  },
  en: {
    metaTitle: 'Incense — the way of Kōdō, the art of incense',
    metaDescription:
      'Incense and burning woods in the Japanese tradition of Kōdō: Oud wood, resins and noble materials, to be “listened to” rather than smelled. A connoisseur’s selection.',
    breadcrumb: 'Incense',
    name: 'Incense',
    kicker: 'The way of Kōdō',
    h1: 'Incense',
    lede: 'Burning woods and noble resins in the Japanese tradition of incense — materials one listens to rather than smells, in silence and slowness.',
    shop: {
      kicker: 'The selection',
      h2: 'Our materials to burn, to order',
      lede: 'Wild Oud, bokhour and resins, sold by the tola (11.6 g). Choose on each material’s page.',
    },
    noteLabels: { top: 'Top', heart: 'Heart', base: 'Base' },
    kodo: {
      kicker: '“Listening” to incense',
      h2: 'Kōdō, an art of attention',
      p1: 'In the way of Kōdō, incense is not decoration: it is an experience. You prepare the gesture, you slow down, you attend to every nuance of the rising smoke. The fragrant smoke becomes a thread, almost a meditation.',
      p2: 'It is this spirit that guides our selection: materials noble enough to be worth pausing for.',
      caption: 'The censer and its rising smoke',
    },
    matieres: {
      kicker: 'Our materials',
      h2: 'Woods, resins and Oud to burn',
      p: 'Oud chips, resins and fragrant woods: each material is chosen for the quality of its burn and the finesse of its scent. Nothing saturated, nothing synthetic — only the truth of a fine material as it is consumed.',
      caption: 'Oud chips & resins',
    },
    faqKicker: 'Frequently asked questions',
    faqTitle: 'Understanding incense',
    faq: [
      { question: 'What is Kōdō?', answer: 'Kōdō, or “the way of incense”, is one of Japan’s three great refined ceremonies, alongside tea and ikebana. One does not say one “smells” the incense: one “listens” to it. Everything is attention, silence and slowness.' },
      { question: 'How do you use a quality incense?', answer: 'On charcoal or a suitable burner, at low heat, to let the material reveal itself without burning it. A few chips of wood are enough: the aim is the finesse of the smoke, not the quantity.' },
      { question: 'Is Oud wood burned too?', answer: 'Yes. Beyond perfumes, Oud is burned as chips: it is one of the most sought-after olfactory experiences — deep, resinous and enveloping, at the heart of the Kōdō tradition.' },
    ],
    cta: { kicker: 'Living Kōdō', h2: 'Around the censer', p: 'The best way to understand incense is to listen to it with us, around the censer. By appointment, free of charge.', button: 'Meet us' },
  },
} satisfies Record<Locale, unknown>

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const t = CONTENT[loc]
  return buildMetadata({ fallbackTitle: t.metaTitle, fallbackDescription: t.metaDescription, path: PATH, locale: loc })
}

export default async function EncensPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = CONTENT[locale]
  const dict = getDictionary(locale)
  const p = (path: string) => `/${locale}${path}`
  const hero = await getSectionImage('collectionsPanel')
  const catalogue = await getCatalogue()

  const jsonLd = [
    webPageJsonLd({ path: `/${locale}${PATH}`, name: t.name, description: t.metaDescription, type: 'CollectionPage' }),
    faqPageJsonLd(t.faq),
    breadcrumbJsonLd([
      { name: dict.common.breadcrumbHome, path: `/${locale}` },
      { name: t.breadcrumb, path: `/${locale}${PATH}` },
    ]),
  ]

  return (
    <>
      {jsonLd.map((entry, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}

      <header
        className="editorial-hero"
        style={hero?.width && hero?.height ? { aspectRatio: `${hero.width} / ${hero.height}` } : undefined}
      >
        {hero && <HeroImage url={hero.url} alt={hero.alt} />}
        <div className="editorial-hero__inner">
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href={p('')}>{dict.common.breadcrumbHome}</Link> <span aria-hidden="true">·</span> {t.breadcrumb}
          </nav>
          <p className="kicker mt-6">{t.kicker}</p>
          <h1 className="mt-3">{t.h1}</h1>
          <p className="editorial-lede">{t.lede}</p>
        </div>
      </header>

      <div className="editorial-body">
        {catalogue.length > 0 && (
          <section className="editorial-section" aria-labelledby="acheter">
            <p className="kicker">{t.shop.kicker}</p>
            <h2 id="acheter" className="mt-3">{t.shop.h2}</h2>
            <p className="editorial-lede">{t.shop.lede}</p>

            {catalogue.map(({ category, items }) => {
              const catName = localizeCategoryName(category, locale)
              return (
                <div key={category.id} className="mt-12">
                  <p className="kicker">{catName}</p>
                  <div className="mt-6 flex flex-col gap-10 md:gap-12">
                    {items.map((rawProduct, i) => {
                      const product = localizeProduct(rawProduct, locale)
                      const price = fromPrice(product)
                      const image = productImage(product)
                      const origin = product.origin?.country
                      const notes = product.olfactiveNotes
                      const noteRows = [
                        { label: t.noteLabels.top, value: notes?.top },
                        { label: t.noteLabels.heart, value: notes?.heart },
                        { label: t.noteLabels.base, value: notes?.base },
                      ].filter((n) => n.value)
                      return (
                        <Link
                          key={product.id}
                          href={p(`/boutique/${category.slug}/${product.slug}`)}
                          className={`product-row${i % 2 === 1 ? ' is-reversed' : ''}`}
                        >
                          <span className={`product-row__media${image ? ' has-image' : ''}`}>
                            {image?.url && (
                              <Image src={image.url} alt={image.alt ?? product.name} fill sizes="(min-width: 640px) 20rem, 100vw" className="product-row__img" />
                            )}
                          </span>
                          <span className="product-row__body">
                            <span className="product-row__kicker">
                              {catName}
                              {origin ? ` · ${origin}` : ''}
                            </span>
                            <span className="product-row__name">{product.name}</span>
                            {product.shortDescription && (
                              <span className="product-row__desc">{product.shortDescription}</span>
                            )}
                            {noteRows.length > 0 && (
                              <span className="product-row__notes">
                                {noteRows.map((n) => (
                                  <span key={n.label} className="product-row__note">
                                    <span className="product-row__note-label">{n.label}</span>
                                    <span className="product-row__note-value">{n.value}</span>
                                  </span>
                                ))}
                              </span>
                            )}
                            <span className="product-row__meta">
                              {price != null && (
                                <span className="product-row__price">{dict.common.fromPrice} {price} €</span>
                              )}
                              <span className="product-row__cta">{dict.common.discover}</span>
                            </span>
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </section>
        )}

        <section className="editorial-section" aria-labelledby="kodo">
          <div className="editorial-split">
            <div className="editorial-prose">
              <p className="kicker">{t.kodo.kicker}</p>
              <h2 id="kodo" className="mt-3">{t.kodo.h2}</h2>
              <p>{t.kodo.p1}</p>
              <p>{t.kodo.p2}</p>
            </div>
            <EditorialFigure caption={t.kodo.caption} />
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="matieres">
          <div className="editorial-split is-reversed">
            <div className="editorial-prose">
              <p className="kicker">{t.matieres.kicker}</p>
              <h2 id="matieres" className="mt-3">{t.matieres.h2}</h2>
              <p>{t.matieres.p}</p>
            </div>
            <EditorialFigure caption={t.matieres.caption} />
          </div>
        </section>

        <section className="faq" aria-labelledby="faq-encens">
          <p className="kicker">{t.faqKicker}</p>
          <h2 id="faq-encens" className="mt-3">{t.faqTitle}</h2>
          <div className="faq-list">
            {t.faq.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="appointment" aria-labelledby="vivre">
          <p className="kicker">{t.cta.kicker}</p>
          <h2 id="vivre" className="mt-3">{t.cta.h2}</h2>
          <p>{t.cta.p}</p>
          <hr className="gold-rule gold-rule-center" />
          <Link href={p('/nos-boutiques')} className="btn-gold">{t.cta.button}</Link>
        </section>
      </div>
    </>
  )
}
