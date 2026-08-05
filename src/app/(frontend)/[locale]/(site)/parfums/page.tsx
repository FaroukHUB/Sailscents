import Image from 'next/image'
import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { HeroImage } from '@/components/HeroImage'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { getSectionImage } from '@/lib/sectionImage'
import { breadcrumbJsonLd, faqPageJsonLd, webPageJsonLd } from '@/lib/structured-data'
import { getDictionary } from '@/i18n'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'
import { localizeCategoryName, localizeProduct } from '@/i18n/productTranslations'
import type { Category, Media, Product } from '@/types/content'

export const dynamic = 'force-dynamic'

const PATH = '/parfums'

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

// Produits publiés, groupés par univers (catégorie). Le contenu produit
// (nom, notes, origine) reste tel qu'il est en base (FR pour l'instant).
const getCatalogue = async () => {
  const payload = await getPayloadClient()
  const [{ docs: categories }, { docs: products }] = await Promise.all([
    payload.find({ collection: 'categories', limit: 50, sort: 'name' }),
    payload.find({ collection: 'products', where: { status: { equals: 'published' } }, limit: 200, depth: 1 }),
  ])

  return (categories as Category[])
    .map((category) => ({
      category,
      items: (products as Product[]).filter((prod) => {
        const catId = typeof prod.category === 'object' && prod.category ? prod.category.id : prod.category
        return catId === category.id
      }),
    }))
    .filter((group) => group.items.length > 0)
}

const CONTENT = {
  fr: {
    metaTitle: 'Les Parfums — Attars, huiles parfumées & Oud',
    metaDescription:
      'Attars et huiles parfumées d’exception, sans alcool, autour du bois de Oud et des plus belles matières. Des signatures rares, concentrées et durables, choisies par des connaisseurs.',
    name: 'Les Parfums',
    breadcrumb: 'Les Parfums',
    kicker: 'Attars & huiles parfumées',
    h1: 'Les Parfums',
    lede: 'Des huiles parfumées concentrées, sans alcool, construites autour du bois de Oud et des plus belles matières. Des signatures rares, intimes et durables.',
    shop: {
      kicker: 'La sélection',
      h2: 'Nos huiles à découvrir et commander',
      lede: 'Des huiles rares, disponibles à la vente en ligne. Choisissez votre contenance sur la fiche de chaque parfum.',
    },
    noteLabels: { top: 'Tête', heart: 'Cœur', base: 'Fond' },
    art: {
      kicker: 'L’art de l’Attar',
      h2: 'La concentration, pas la dilution',
      p1: 'Là où la parfumerie industrielle allonge ses jus d’alcool, l’Attar fait le choix inverse : l’huile pure. Distillé avec patience, il capture la matière dans toute sa densité — un bois de Oud, une rose, une résine — et la dépose telle quelle sur la peau.',
      p2: 'Le résultat est une signature qui évolue lentement, se réchauffe au fil des heures et ne s’impose jamais : elle accompagne, elle ne crie pas. C’est le luxe du peu, mais du juste.',
      caption: 'Flacons d’Attars & bois de Oud',
    },
    oud: {
      kicker: 'Le cœur de notre sélection',
      h2: 'Le bois de Oud',
      p1: 'Matière parmi les plus précieuses au monde, le Oud — ou bois d’agar — offre une profondeur boisée, animale et résineuse inimitable. Nous privilégions des origines traçables, d’Assam et du Cambodge, et des récoltes limitées.',
      p2: 'Autour de lui se construisent nos accords les plus rares, seuls ou mariés à la rose, au safran ou à l’ambre.',
      caption: 'Le bois de Oud',
    },
    faqKicker: 'Questions fréquentes',
    faqTitle: 'Bien choisir son parfum',
    faq: [
      { question: 'Qu’est-ce qu’un Attar ?', answer: 'Un Attar est une huile parfumée concentrée, sans alcool, traditionnellement obtenue par distillation de fleurs, de bois ou de résines sur une base de bois de santal. Il se pose sur la peau, évolue lentement et tient très longtemps.' },
      { question: 'Pourquoi vos parfums sont-ils sans alcool ?', answer: 'La tradition de l’Attar privilégie l’huile pure : elle respecte la matière, ne l’agresse pas et offre un sillage plus intime et plus tenace qu’un parfum alcoolisé. C’est aussi une signature plus proche de la peau.' },
      { question: 'Comment porter une huile parfumée ?', answer: 'Quelques touches suffisent, aux points de pulsation (poignets, cou). L’huile se réchauffe au contact de la peau et révèle ses facettes au fil des heures. Inutile d’en mettre beaucoup : la concentration fait le reste.' },
    ],
    cta: { kicker: 'Avant d’acheter', h2: 'Sentir avant de choisir', p: 'Un parfum rare ne se choisit pas sur un écran. Nous vous recevons pour le découvrir, le comparer et le comprendre — sur rendez-vous, sans frais.', button: 'Nous rencontrer' },
  },
  en: {
    metaTitle: 'Perfumes — Attars, perfume oils & Oud',
    metaDescription:
      'Exceptional alcohol-free Attars and perfume oils, built around Oud wood and the finest materials. Rare, concentrated and lasting signatures, chosen by connoisseurs.',
    name: 'Perfumes',
    breadcrumb: 'Perfumes',
    kicker: 'Attars & perfume oils',
    h1: 'Perfumes',
    lede: 'Concentrated, alcohol-free perfume oils built around Oud wood and the finest materials. Rare, intimate and lasting signatures.',
    shop: {
      kicker: 'The selection',
      h2: 'Our oils to discover and order',
      lede: 'Rare oils, available online. Choose your size on each perfume’s page.',
    },
    noteLabels: { top: 'Top', heart: 'Heart', base: 'Base' },
    art: {
      kicker: 'The art of the Attar',
      h2: 'Concentration, not dilution',
      p1: 'Where industrial perfumery stretches its juices with alcohol, the Attar makes the opposite choice: pure oil. Patiently distilled, it captures the material in all its density — an Oud wood, a rose, a resin — and lays it on the skin as it is.',
      p2: 'The result is a signature that evolves slowly, warms over the hours and never imposes itself: it accompanies, it does not shout. It is the luxury of the few, but the just.',
      caption: 'Attar bottles & Oud wood',
    },
    oud: {
      kicker: 'The heart of our selection',
      h2: 'Oud wood',
      p1: 'Among the most precious materials in the world, Oud — or agarwood — offers an inimitable woody, animalic, resinous depth. We favour traceable origins, from Assam and Cambodia, and limited harvests.',
      p2: 'Around it we build our rarest accords, alone or married with rose, saffron or amber.',
      caption: 'Oud wood',
    },
    faqKicker: 'Frequently asked questions',
    faqTitle: 'Choosing your perfume well',
    faq: [
      { question: 'What is an Attar?', answer: 'An Attar is a concentrated, alcohol-free perfume oil, traditionally obtained by distilling flowers, woods or resins onto a sandalwood base. It sits on the skin, evolves slowly and lasts a very long time.' },
      { question: 'Why are your perfumes alcohol-free?', answer: 'The Attar tradition favours pure oil: it respects the material, does not attack it, and offers a more intimate, more tenacious trail than an alcohol-based perfume. It is also a signature closer to the skin.' },
      { question: 'How do you wear a perfume oil?', answer: 'A few dabs are enough, at the pulse points (wrists, neck). The oil warms on contact with the skin and reveals its facets over the hours. No need for much: concentration does the rest.' },
    ],
    cta: { kicker: 'Before you buy', h2: 'Smell before choosing', p: 'A rare perfume is not chosen on a screen. We welcome you to discover it, compare it and understand it — by appointment, free of charge.', button: 'Meet us' },
  },
} satisfies Record<Locale, unknown>

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const t = CONTENT[loc]
  return buildMetadata({ fallbackTitle: t.metaTitle, fallbackDescription: t.metaDescription, path: PATH, locale: loc })
}

export default async function ParfumsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = CONTENT[locale]
  const dict = getDictionary(locale)
  const p = (path: string) => `/${locale}${path}`
  const hero = await getSectionImage('boutiquePanel')
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

        <section className="editorial-section" aria-labelledby="art">
          <div className="editorial-split">
            <div className="editorial-prose">
              <p className="kicker">{t.art.kicker}</p>
              <h2 id="art" className="mt-3">{t.art.h2}</h2>
              <p>{t.art.p1}</p>
              <p>{t.art.p2}</p>
            </div>
            <EditorialFigure caption={t.art.caption} />
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="oud">
          <div className="editorial-split is-reversed">
            <div className="editorial-prose">
              <p className="kicker">{t.oud.kicker}</p>
              <h2 id="oud" className="mt-3">{t.oud.h2}</h2>
              <p>{t.oud.p1}</p>
              <p>{t.oud.p2}</p>
            </div>
            <EditorialFigure caption={t.oud.caption} />
          </div>
        </section>

        <section className="faq" aria-labelledby="faq-parfums">
          <p className="kicker">{t.faqKicker}</p>
          <h2 id="faq-parfums" className="mt-3">{t.faqTitle}</h2>
          <div className="faq-list">
            {t.faq.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="appointment" aria-labelledby="essai">
          <p className="kicker">{t.cta.kicker}</p>
          <h2 id="essai" className="mt-3">{t.cta.h2}</h2>
          <p>{t.cta.p}</p>
          <hr className="gold-rule gold-rule-center" />
          <Link href={p('/nos-boutiques')} className="btn-gold">{t.cta.button}</Link>
        </section>
      </div>
    </>
  )
}
