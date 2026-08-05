import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { HeroImage } from '@/components/HeroImage'
import { buildMetadata } from '@/lib/seo'
import { getSectionImage } from '@/lib/sectionImage'
import { breadcrumbJsonLd, faqPageJsonLd, webPageJsonLd } from '@/lib/structured-data'
import { getDictionary } from '@/i18n'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

export const dynamic = 'force-dynamic'

const PATH = '/raretes'

const CONTENT = {
  fr: {
    metaTitle: 'Les Raretés — thé, safran, ambre gris & matières précieuses',
    metaDescription:
      'Nos matières les plus rares : thés d’exception d’Asie orientale, safran, ambre gris et trésors olfactifs. Une sélection pointue, pour connaisseurs.',
    breadcrumb: 'Les Raretés',
    name: 'Les Raretés',
    kicker: 'Matières précieuses',
    h1: 'Les Raretés',
    lede: 'Au-delà des parfums, nos trésors : thés d’exception, safran, ambre gris. Des matières rares, choisies une à une, pour ceux qui cherchent l’exceptionnel.',
    itemKicker: 'Rareté',
    raretes: [
      { title: 'Les thés d’exception', text: 'Crus rares d’Asie orientale, récoltes limitées et grands jardins. Des thés que l’on déguste comme on écoute un parfum — avec attention et lenteur.', caption: 'Thés rares d’Asie orientale' },
      { title: 'Le safran', text: 'L’or rouge : l’épice la plus précieuse au monde, cueillie à la main filament par filament. Une matière aussi recherchée en cuisine qu’en parfumerie, pour sa profondeur cuir-miel.', caption: 'Filaments de safran' },
      { title: 'L’ambre gris', text: 'Trésor marin et légendaire fixateur de la parfumerie, à la signature salée, animale et lumineuse. Une rareté absolue, réservée aux plus belles compositions.', caption: 'Ambre gris' },
    ],
    faqKicker: 'Questions fréquentes',
    faqTitle: 'Nos matières rares',
    faq: [
      { question: 'Qu’est-ce que l’ambre gris ?', answer: 'L’ambre gris est une matière rare d’origine marine, longtemps utilisée en parfumerie comme fixateur précieux. Sa signature est salée, animale et lumineuse à la fois — l’une des plus recherchées et des plus rares au monde.' },
      { question: 'Pourquoi le safran est-il si précieux ?', answer: 'Le safran est cueilli à la main, filament par filament : il faut des dizaines de milliers de fleurs pour obtenir quelques grammes. Cette rareté, alliée à sa profondeur cuir-miel, en fait l’une des matières les plus précieuses, en cuisine comme en parfumerie.' },
      { question: 'Vos thés sont-ils des grands crus ?', answer: 'Nous privilégions des récoltes limitées et des jardins réputés d’Asie orientale. Chaque thé est choisi pour ce qu’il apporte à la dégustation et pour son dialogue avec nos parfums — du palais au nez.' },
    ],
    cta: { kicker: 'Sur rendez-vous', h2: 'Découvrir nos raretés', p: 'Nos matières les plus rares se découvrent en main propre, avec le temps et les explications qu’elles méritent. Nous vous recevons sans frais.', button: 'Nous rencontrer' },
  },
  en: {
    metaTitle: 'Rarities — tea, saffron, ambergris & precious matters',
    metaDescription:
      'Our rarest materials: exceptional East Asian teas, saffron, ambergris and olfactory treasures. A sharp selection, for connoisseurs.',
    breadcrumb: 'Rarities',
    name: 'Rarities',
    kicker: 'Precious matters',
    h1: 'Rarities',
    lede: 'Beyond perfumes, our treasures: exceptional teas, saffron, ambergris. Rare materials, chosen one by one, for those who seek the exceptional.',
    itemKicker: 'Rarity',
    raretes: [
      { title: 'Exceptional teas', text: 'Rare East Asian crus, limited harvests and great gardens. Teas to be savoured the way one listens to a perfume — with attention and slowness.', caption: 'Rare East Asian teas' },
      { title: 'Saffron', text: 'Red gold: the most precious spice in the world, picked by hand thread by thread. A material as sought after in cooking as in perfumery, for its leather-honey depth.', caption: 'Saffron threads' },
      { title: 'Ambergris', text: 'A treasure of the sea and legendary fixative of perfumery, with a salty, animalic, luminous signature. An absolute rarity, reserved for the finest compositions.', caption: 'Ambergris' },
    ],
    faqKicker: 'Frequently asked questions',
    faqTitle: 'Our rare materials',
    faq: [
      { question: 'What is ambergris?', answer: 'Ambergris is a rare material of marine origin, long used in perfumery as a precious fixative. Its signature is salty, animalic and luminous all at once — one of the most sought-after and rarest in the world.' },
      { question: 'Why is saffron so precious?', answer: 'Saffron is picked by hand, thread by thread: it takes tens of thousands of flowers to obtain a few grams. This rarity, combined with its leather-honey depth, makes it one of the most precious materials, in cooking as in perfumery.' },
      { question: 'Are your teas grands crus?', answer: 'We favour limited harvests and renowned East Asian gardens. Each tea is chosen for what it brings to the tasting and for its dialogue with our perfumes — from the palate to the nose.' },
    ],
    cta: { kicker: 'By appointment', h2: 'Discovering our rarities', p: 'Our rarest materials are best discovered in hand, with the time and explanations they deserve. We welcome you free of charge.', button: 'Meet us' },
  },
} satisfies Record<Locale, unknown>

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const t = CONTENT[loc]
  return buildMetadata({ fallbackTitle: t.metaTitle, fallbackDescription: t.metaDescription, path: PATH, locale: loc })
}

export default async function RaretesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = CONTENT[locale]
  const dict = getDictionary(locale)
  const p = (path: string) => `/${locale}${path}`
  const hero = await getSectionImage('ateliersPanel')

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
        {t.raretes.map((item, index) => (
          <section key={item.title} className="editorial-section" aria-labelledby={`r-${index}`}>
            <div className={`editorial-split${index % 2 === 1 ? ' is-reversed' : ''}`}>
              <div className="editorial-prose">
                <p className="kicker">{t.itemKicker}</p>
                <h2 id={`r-${index}`} className="mt-3">{item.title}</h2>
                <p>{item.text}</p>
              </div>
              <EditorialFigure caption={item.caption} />
            </div>
          </section>
        ))}

        <section className="faq" aria-labelledby="faq-raretes">
          <p className="kicker">{t.faqKicker}</p>
          <h2 id="faq-raretes" className="mt-3">{t.faqTitle}</h2>
          <div className="faq-list">
            {t.faq.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="appointment" aria-labelledby="decouvrir">
          <p className="kicker">{t.cta.kicker}</p>
          <h2 id="decouvrir" className="mt-3">{t.cta.h2}</h2>
          <p>{t.cta.p}</p>
          <hr className="gold-rule gold-rule-center" />
          <Link href={p('/nos-boutiques')} className="btn-gold">{t.cta.button}</Link>
        </section>
      </div>
    </>
  )
}
