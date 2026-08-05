import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { HeroImage } from '@/components/HeroImage'
import { buildMetadata } from '@/lib/seo'
import { getSectionImage } from '@/lib/sectionImage'
import { breadcrumbJsonLd, faqPageJsonLd, webPageJsonLd } from '@/lib/structured-data'
import { getDictionary } from '@/i18n'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

export const dynamic = 'force-dynamic'

const PATH = '/maison'

const CONTENT = {
  fr: {
    metaTitle: 'À propos de nous — parfumerie de niche : Oud, Attars, encens',
    metaDescription:
      'Sailscents, maison de parfumerie de niche et de connaisseurs : bois de Oud, Attars (huiles parfumées), encens de la voie du Kōdō, thés et cafés d’exception d’Asie orientale, sélectionnés avec exigence.',
    breadcrumb: 'À propos de nous',
    kicker: 'Maison sensorielle de connaisseurs',
    h1: 'À propos de nous',
    lede:
      'Sailscents est une maison de parfumerie de niche dédiée aux matières les plus rares — bois de Oud, Attars, encens de la voie du Kōdō, thés et cafés d’exception. Nous ne vendons pas un flacon : nous transmettons une connaissance.',
    metier: {
      kicker: 'Notre métier',
      h2: 'Des connaisseurs, pas des marchands',
      p1:
        'Sailscents est née d’une conviction simple : un grand parfum ne se vend pas, il se comprend. Là où la parfumerie de masse cherche le volume et la nouveauté permanente, nous cultivons l’inverse — la rareté, la patience et la précision. Chaque bois de Oud, chaque Attar, chaque encens qui entre dans notre sélection a été senti, comparé et éprouvé avant d’être retenu.',
      p2a: 'Nous parlons matières premières, méthodes de distillation et maturation comme d’autres parlent de grands crus. Cette exigence n’est pas un argument marketing : c’est ce qui distingue une ',
      p2strong: 'maison de connaisseurs',
      p2b: ' d’un simple revendeur. Elle guide tout ce que nous proposons, du plus discret des encens au plus précieux des Attars.',
    },
    trust: [
      { h3: 'Sélection rare', p: 'Des récoltes limitées et des producteurs choisis, jamais de production de masse.' },
      { h3: 'Conseil d’expert', p: 'Une connaissance réelle des matières, transmise sans jargon ni précipitation.' },
      { h3: 'Expérience unique', p: 'La découverte sur le tatami, autour de l’encensoir — Le Rituel Sailscents.' },
    ],
    matieres: {
      kicker: 'Les matières',
      h2: 'Du Oud aux infusions d’Extrême-Orient',
      intro: 'Notre univers réunit ce que les grandes traditions olfactives ont de plus abouti, sans jamais diluer la rareté :',
      items: [
        { strong: 'Le bois de Oud', rest: ' — d’Assam et du Cambodge, l’une des matières les plus précieuses au monde, à la profondeur boisée et animale inimitable.' },
        { strong: 'Les Attars', rest: ' — huiles parfumées concentrées, sans alcool, pressées et distillées selon des savoir-faire séculaires.' },
        { strong: 'L’encens', rest: ' — au cœur de la voie japonaise du Kōdō, l’art d’écouter les parfums brûlés.' },
        { strong: 'Les thés et cafés d’exception', rest: ' — crus rares d’Asie orientale qui prolongent l’expérience, du palais au nez.' },
      ],
      caption: 'Bois de Oud & flacons d’Attars',
    },
    exigence: {
      kicker: 'L’exigence',
      h2: 'Le sourcing, avant tout',
      p1:
        'La rareté se mérite. Rien n’entre dans notre sélection sans avoir traversé le même filtre : l’origine est-elle traçable ? La matière est-elle à la hauteur ? L’émotion est-elle au rendez-vous ? Nous privilégions les petits producteurs, les récoltes limitées et les savoir-faire menacés — quitte à proposer moins, mais mieux.',
      h3: 'Une traçabilité assumée',
      p2:
        'Connaître la provenance d’un Oud ou d’un Attar, c’est respecter à la fois la matière, l’artisan et le client. Ce que vous découvrez chez Sailscents, peu de maisons peuvent le proposer — et c’est précisément ce qui fait la valeur d’une essence rare.',
      caption: 'La sélection, flacon par flacon',
    },
    faqKicker: 'Questions fréquentes',
    faqTitle: 'Comprendre notre univers',
    faq: [
      { question: 'Qu’est-ce qu’une maison de parfumerie de niche ?', answer: 'Une maison de niche crée et sélectionne des parfums en petites quantités, loin de la distribution de masse. Elle privilégie la qualité des matières premières, la rareté et l’identité olfactive plutôt que le volume. Chez Sailscents, cela signifie des bois de Oud, des Attars et des encens choisis un à un, pour leur origine et leur caractère.' },
      { question: 'Quelle est la différence entre un Attar et un parfum classique ?', answer: 'Un Attar est une huile parfumée concentrée, traditionnellement obtenue par distillation de fleurs, de bois ou de résines, souvent sur une base de bois de santal. Contrairement à un parfum alcoolisé, il ne contient pas d’alcool : il se pose sur la peau, évolue lentement et tient longtemps. Sa concentration en fait une signature intime et durable.' },
      { question: 'D’où vient le bois de Oud que vous proposez ?', answer: 'Le Oud, ou bois d’agar, provient principalement d’Asie du Sud-Est — notamment de l’Assam en Inde et du Cambodge. C’est l’une des matières les plus précieuses de la parfumerie, née de la résine que produit l’arbre Aquilaria lorsqu’il est infecté. Nous privilégions des sources traçables et des récoltes limitées.' },
      { question: 'Peut-on découvrir vos parfums avant d’acheter ?', answer: 'Oui. Nous recevons sur rendez-vous, sans frais, pour une séance privée de découverte — Le Rituel. C’est le meilleur moyen de sentir, comparer et comprendre les matières avant de choisir. La vente n’est jamais l’objectif : la rencontre avec l’odeur juste l’est.' },
    ],
    cta: { kicker: 'Aller plus loin', h2: 'Vivez-le, ne le lisez pas', p: 'La meilleure façon de comprendre notre travail reste de le vivre : sur le tatami, autour de l’encensoir, un thé ou un café d’exception à la main. Une séance privée, sur rendez-vous et sans frais.', rituel: 'Découvrir Le Rituel', boutique: 'Explorer la Boutique' },
  },
  en: {
    metaTitle: 'About us — niche perfumery: Oud, Attars, incense',
    metaDescription:
      'Sailscents, a niche perfume house for connoisseurs: Oud wood, Attars (perfume oils), incense of the way of Kōdō, and exceptional teas and coffees from East Asia, chosen with rigour.',
    breadcrumb: 'About us',
    kicker: 'A house of the senses, for connoisseurs',
    h1: 'About us',
    lede:
      'Sailscents is a niche perfume house devoted to the rarest materials — Oud wood, Attars, incense of the way of Kōdō, exceptional teas and coffees. We don’t sell a bottle: we pass on knowledge.',
    metier: {
      kicker: 'Our craft',
      h2: 'Connoisseurs, not merchants',
      p1:
        'Sailscents was born of a simple conviction: a great perfume is not sold, it is understood. Where mass perfumery chases volume and constant novelty, we cultivate the opposite — rarity, patience and precision. Every Oud wood, every Attar, every incense in our selection has been smelled, compared and tested before being kept.',
      p2a: 'We speak of raw materials, distillation methods and maturation the way others speak of grands crus. This rigour is not a marketing line: it is what sets a ',
      p2strong: 'house of connoisseurs',
      p2b: ' apart from a mere reseller. It guides everything we offer, from the most discreet incense to the most precious Attar.',
    },
    trust: [
      { h3: 'Rare selection', p: 'Limited harvests and chosen producers — never mass production.' },
      { h3: 'Expert guidance', p: 'Real knowledge of the materials, shared without jargon or haste.' },
      { h3: 'A singular experience', p: 'Discovery on the tatami, around the censer — the Sailscents Ritual.' },
    ],
    matieres: {
      kicker: 'The materials',
      h2: 'From Oud to the infusions of the Far East',
      intro: 'Our world brings together the finest of the great olfactory traditions, never diluting rarity:',
      items: [
        { strong: 'Oud wood', rest: ' — from Assam and Cambodia, one of the most precious materials in the world, with an inimitable woody, animalic depth.' },
        { strong: 'Attars', rest: ' — concentrated, alcohol-free perfume oils, pressed and distilled through centuries-old know-how.' },
        { strong: 'Incense', rest: ' — at the heart of the Japanese way of Kōdō, the art of listening to burning scents.' },
        { strong: 'Exceptional teas and coffees', rest: ' — rare East Asian crus that extend the experience, from the palate to the nose.' },
      ],
      caption: 'Oud wood & Attar bottles',
    },
    exigence: {
      kicker: 'Rigour',
      h2: 'Sourcing, above all',
      p1:
        'Rarity is earned. Nothing enters our selection without passing the same filter: is the origin traceable? Is the material worthy? Is the emotion there? We favour small producers, limited harvests and endangered know-how — offering less, but better.',
      h3: 'Traceability we stand by',
      p2:
        'To know the provenance of an Oud or an Attar is to respect the material, the artisan and the client alike. What you discover at Sailscents, few houses can offer — and that is precisely what gives a rare essence its value.',
      caption: 'The selection, bottle by bottle',
    },
    faqKicker: 'Frequently asked questions',
    faqTitle: 'Understanding our world',
    faq: [
      { question: 'What is a niche perfume house?', answer: 'A niche house creates and selects perfumes in small quantities, far from mass distribution. It favours the quality of raw materials, rarity and olfactory identity over volume. At Sailscents, that means Oud woods, Attars and incense chosen one by one, for their origin and character.' },
      { question: 'What is the difference between an Attar and a conventional perfume?', answer: 'An Attar is a concentrated perfume oil, traditionally obtained by distilling flowers, woods or resins, often onto a sandalwood base. Unlike an alcohol-based perfume, it contains no alcohol: it sits on the skin, evolves slowly and lasts a long time. Its concentration makes it an intimate, lasting signature.' },
      { question: 'Where does your Oud wood come from?', answer: 'Oud, or agarwood, comes mainly from South-East Asia — notably Assam in India and Cambodia. It is one of perfumery’s most precious materials, born of the resin the Aquilaria tree produces when infected. We favour traceable sources and limited harvests.' },
      { question: 'Can we discover your perfumes before buying?', answer: 'Yes. We welcome you by appointment, free of charge, for a private discovery session — the Ritual. It is the best way to smell, compare and understand the materials before choosing. Selling is never the goal: meeting the right scent is.' },
    ],
    cta: { kicker: 'Go further', h2: 'Live it, don’t read it', p: 'The best way to understand our work is to live it: on the tatami, around the censer, an exceptional tea or coffee in hand. A private session, by appointment and free of charge.', rituel: 'Discover the Ritual', boutique: 'Explore the Boutique' },
  },
} satisfies Record<Locale, unknown>

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const t = CONTENT[isLocale(locale) ? locale : defaultLocale]
  return buildMetadata({ fallbackTitle: t.metaTitle, fallbackDescription: t.metaDescription, path: PATH, locale: isLocale(locale) ? locale : defaultLocale })
}

export default async function MaisonPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = CONTENT[locale]
  const dict = getDictionary(locale)
  const p = (path: string) => `/${locale}${path}`
  const hero = await getSectionImage('maisonPanel')

  const jsonLd = [
    webPageJsonLd({ path: `/${locale}${PATH}`, name: t.h1, description: t.metaDescription, type: 'AboutPage' }),
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
        <section className="editorial-section" aria-labelledby="metier">
          <p className="kicker">{t.metier.kicker}</p>
          <h2 id="metier" className="mt-3">{t.metier.h2}</h2>
          <div className="editorial-prose">
            <p>{t.metier.p1}</p>
            <p>
              {t.metier.p2a}
              <strong>{t.metier.p2strong}</strong>
              {t.metier.p2b}
            </p>
          </div>

          <div className="trust-row">
            {t.trust.map((item) => (
              <div key={item.h3} className="trust-item">
                <h3>{item.h3}</h3>
                <p>{item.p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="matieres">
          <div className="editorial-split">
            <div className="editorial-prose">
              <p className="kicker">{t.matieres.kicker}</p>
              <h2 id="matieres" className="mt-3">{t.matieres.h2}</h2>
              <p>{t.matieres.intro}</p>
              <ul>
                {t.matieres.items.map((item) => (
                  <li key={item.strong}>
                    <strong>{item.strong}</strong>
                    {item.rest}
                  </li>
                ))}
              </ul>
            </div>
            <EditorialFigure caption={t.matieres.caption} />
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="exigence">
          <div className="editorial-split is-reversed">
            <div className="editorial-prose">
              <p className="kicker">{t.exigence.kicker}</p>
              <h2 id="exigence" className="mt-3">{t.exigence.h2}</h2>
              <p>{t.exigence.p1}</p>
              <h3>{t.exigence.h3}</h3>
              <p>{t.exigence.p2}</p>
            </div>
            <EditorialFigure caption={t.exigence.caption} />
          </div>
        </section>

        <section className="faq" aria-labelledby="faq-maison">
          <p className="kicker">{t.faqKicker}</p>
          <h2 id="faq-maison" className="mt-3">{t.faqTitle}</h2>
          <div className="faq-list">
            {t.faq.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="appointment" aria-labelledby="suite">
          <p className="kicker">{t.cta.kicker}</p>
          <h2 id="suite" className="mt-3">{t.cta.h2}</h2>
          <p>{t.cta.p}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={p('/rituel')} className="btn-gold">{t.cta.rituel}</Link>
            <Link href={p('/boutique')} className="btn-gold">{t.cta.boutique}</Link>
          </div>
        </section>
      </div>
    </>
  )
}
