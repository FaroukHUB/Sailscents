import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { HeroImage } from '@/components/HeroImage'
import { buildMetadata } from '@/lib/seo'
import { getSectionImage } from '@/lib/sectionImage'
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd, webPageJsonLd } from '@/lib/structured-data'
import { getDictionary } from '@/i18n'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

export const dynamic = 'force-dynamic'

const PATH = '/nos-boutiques'

const CONTENT = {
  fr: {
    metaTitle: 'Nos Boutiques — nous rencontrer, sentir et acheter en personne',
    metaDescription:
      'Au-delà de la vente en ligne, nos parfums rares se découvrent aussi en personne : bois de Oud, Attars, roses de collection, mukhalat. Un connaisseur vous reçoit, vous conseille et vous fait tester chaque essence. Les informations pratiques de la boutique seront communiquées prochainement.',
    breadcrumb: 'Nos Boutiques',
    serviceName: 'Boutique Sailscents — vente et conseil en personne',
    kicker: 'Nous rencontrer',
    h1: 'Nos Boutiques',
    lede:
      'Nos parfums les plus rares se vivent aussi en personne. Dans notre boutique, vous sentez, comparez et choisissez — accompagné par un connaisseur, un thé ou un café d’exception à la main.',
    personne: {
      kicker: 'Acheter en personne',
      h2: 'Ce qu’un écran ne remplacera jamais',
      p1a: 'Un bois de Oud, un Attar, une rose de collection ne se choisissent pas sur une photo. Ces matières vivent sur la peau : elles se réchauffent, évoluent, révèlent au fil des heures des facettes qu’aucune description ne peut restituer. C’est pourquoi, en plus de la vente en ligne, nous vous recevons en boutique pour acheter ',
      p1strong: 'en connaissance de cause',
      p1b: '.',
      p2: 'Sur place, vous ne faites pas qu’acheter un flacon : vous êtes conseillé par un connaisseur qui vous explique l’origine, la méthode de distillation, la signature de chaque essence. Vous sentez, vous comparez, vous prenez le temps. C’est la différence entre acquérir un parfum et le comprendre.',
    },
    trust: [
      { h3: 'Conseil d’expert', p: 'Un accompagnement par un connaisseur, sans jargon ni précipitation.' },
      { h3: 'Essayer avant d’acheter', p: 'Tester sur la peau, laisser évoluer, comparer plusieurs essences.' },
      { h3: 'Authenticité garantie', p: 'Chaque flacon présenté, testé et expliqué — des matières rares et tracées.' },
    ],
    adresse: {
      kicker: 'Où nous trouver',
      h2: 'Nos parfums, aussi en boutique',
      p1: 'Nos matières se découvrent également en personne : nos parfums sont présentés dans notre boutique, où l’on peut les sentir, les comparer et les choisir tranquillement.',
      p2strong: 'Les informations pratiques — adresse, accès, horaires — seront communiquées prochainement',
      p2rest: ', ici même. En attendant, n’hésitez pas à nous écrire pour toute question.',
      caption: 'L’accueil, en toute simplicité',
    },
    experience: {
      kicker: 'L’expérience',
      h2: 'Reçu comme un hôte, sur le tatami',
      p1: 'On vous installe, on ralentit. L’encensoir diffuse sa fumée parfumante, un thé ou un café rare d’Asie orientale accompagne la découverte, et l’on prend le temps de sentir et de comprendre chaque essence — du palais au nez.',
      p2: 'Ce n’est pas une simple visite en magasin : c’est une rencontre autour du parfum, dans l’esprit de la voie du Kōdō.',
      caption: 'Autour de l’encensoir',
    },
    trouver: {
      kicker: 'En boutique',
      h2: 'Ce que vous pouvez découvrir sur place',
      intro: 'L’ensemble de notre sélection se découvre en personne — souvent mieux qu’en ligne, parce qu’on peut tout sentir et comparer :',
      items: [
        { strong: 'Les huiles de Oud', rest: ', par origine et par style — Vietnam, Bornéo, Assam, Indonésie, Sri Lanka…' },
        { strong: 'Les roses', rest: ' de collection — Taïf, Cachemire, et des raretés vintage.' },
        { strong: 'Les mukhalat', rest: ', nos compositions signature.' },
      ],
      outro: 'Un connaisseur vous guide selon vos goûts, et vous repartez avec l’essence qui vous ressemble — ou simplement avec une connaissance nouvelle.',
    },
    faqKicker: 'Questions fréquentes',
    faqTitle: 'Avant de venir',
    faq: [
      { question: 'Peut-on acheter directement en boutique ?', answer: 'Oui. Au-delà de la vente en ligne, nous vous recevons en personne pour découvrir, sentir et acheter nos parfums. C’est le meilleur moyen de choisir une essence rare : sur la peau, comparée, expliquée par un connaisseur.' },
      { question: 'Où se trouve votre boutique ?', answer: 'Nos matières se découvrent aussi en personne, dans notre boutique. Les informations pratiques — adresse, accès, horaires — seront indiquées ici même, sur cette page, dès qu’elles seront disponibles.' },
      { question: 'Comment nous rendre visite ?', answer: 'Écrivez-nous via la page Contact : nous vous communiquons les informations pratiques et répondons à toutes vos questions.' },
      { question: 'Faut-il acheter pour venir ?', answer: 'Non. La visite est sans engagement : vous pouvez venir découvrir, sentir et comprendre nos matières, et repartir sans achat. Notre objectif est la rencontre avec l’odeur juste, pas la vente à tout prix.' },
      { question: 'Puis-je essayer les parfums avant d’acheter ?', answer: 'Absolument — c’est tout l’intérêt de la boutique. On teste sur la peau, on laisse évoluer, on compare plusieurs essences, et l’on choisit en connaissance de cause.' },
    ],
    cta: { kicker: 'Nous contacter', h2: 'Une question ? Écrivez-nous', p: 'Pour toute question sur nos parfums ou sur les informations pratiques de la boutique, laissez-nous un mot : nous vous répondons avec plaisir.', button: 'Nous écrire' },
  },
  en: {
    metaTitle: 'Our Boutiques — meet us, smell and buy in person',
    metaDescription:
      'Beyond online sales, our rare perfumes can also be discovered in person: Oud wood, Attars, collection roses, mukhalat. A connoisseur welcomes you, advises you and lets you test every essence. The boutique’s practical details will be announced soon.',
    breadcrumb: 'Our Boutiques',
    serviceName: 'Sailscents boutique — in-person sales and advice',
    kicker: 'Meet us',
    h1: 'Our Boutiques',
    lede:
      'Our rarest perfumes are also lived in person. In our boutique, you smell, compare and choose — guided by a connoisseur, an exceptional tea or coffee in hand.',
    personne: {
      kicker: 'Buying in person',
      h2: 'What a screen will never replace',
      p1a: 'An Oud wood, an Attar, a collection rose cannot be chosen from a photo. These materials live on the skin: they warm, evolve, and reveal over the hours facets no description can capture. That is why, alongside online sales, we welcome you in the boutique so you can buy ',
      p1strong: 'with full understanding',
      p1b: '.',
      p2: 'On site, you don’t merely buy a bottle: a connoisseur explains the origin, the distillation method, the signature of each essence. You smell, you compare, you take your time. That is the difference between acquiring a perfume and understanding it.',
    },
    trust: [
      { h3: 'Expert guidance', p: 'Support from a connoisseur, without jargon or haste.' },
      { h3: 'Try before you buy', p: 'Test on the skin, let it evolve, compare several essences.' },
      { h3: 'Guaranteed authenticity', p: 'Every bottle shown, tested and explained — rare, traceable materials.' },
    ],
    adresse: {
      kicker: 'Where to find us',
      h2: 'Our perfumes, in the boutique too',
      p1: 'Our materials can also be discovered in person: our perfumes are shown in our boutique, where you can smell, compare and choose them at leisure.',
      p2strong: 'The practical details — address, access, opening hours — will be announced soon',
      p2rest: ', right here. In the meantime, feel free to write to us with any question.',
      caption: 'A welcome, in all simplicity',
    },
    experience: {
      kicker: 'The experience',
      h2: 'Received as a guest, on the tatami',
      p1: 'We settle you in, we slow down. The censer releases its fragrant smoke, a rare East Asian tea or coffee accompanies the discovery, and we take the time to smell and understand each essence — from the palate to the nose.',
      p2: 'This is not a simple shop visit: it is an encounter around perfume, in the spirit of the way of Kōdō.',
      caption: 'Around the censer',
    },
    trouver: {
      kicker: 'In the boutique',
      h2: 'What you can discover on site',
      intro: 'Our whole selection is best discovered in person — often better than online, because everything can be smelled and compared:',
      items: [
        { strong: 'The Oud oils', rest: ', by origin and by style — Vietnam, Borneo, Assam, Indonesia, Sri Lanka…' },
        { strong: 'The roses', rest: ', collection grade — Taïf, Kashmir, and vintage rarities.' },
        { strong: 'The mukhalat', rest: ', our signature compositions.' },
      ],
      outro: 'A connoisseur guides you according to your taste, and you leave with the essence that suits you — or simply with new knowledge.',
    },
    faqKicker: 'Frequently asked questions',
    faqTitle: 'Before you come',
    faq: [
      { question: 'Can we buy directly in the boutique?', answer: 'Yes. Beyond online sales, we welcome you in person to discover, smell and buy our perfumes. It is the best way to choose a rare essence: on the skin, compared, explained by a connoisseur.' },
      { question: 'Where is your boutique?', answer: 'Our materials can also be discovered in person, in our boutique. The practical details — address, access, opening hours — will be shown right here, on this page, as soon as they are available.' },
      { question: 'How can we visit you?', answer: 'Write to us via the Contact page: we will share the practical details and answer all your questions.' },
      { question: 'Do we have to buy to come?', answer: 'No. The visit is without obligation: you can come to discover, smell and understand our materials, and leave without a purchase. Our aim is meeting the right scent, not selling at any cost.' },
      { question: 'Can I try the perfumes before buying?', answer: 'Absolutely — that is the whole point of the boutique. We test on the skin, let it evolve, compare several essences, and choose with full understanding.' },
    ],
    cta: { kicker: 'Contact us', h2: 'A question? Write to us', p: 'For any question about our perfumes or the boutique’s practical details, drop us a line: we reply with pleasure.', button: 'Write to us' },
  },
} satisfies Record<Locale, unknown>

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const t = CONTENT[loc]
  return buildMetadata({ fallbackTitle: t.metaTitle, fallbackDescription: t.metaDescription, path: PATH, locale: loc })
}

export default async function NosBoutiquesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = CONTENT[locale]
  const dict = getDictionary(locale)
  const p = (path: string) => `/${locale}${path}`
  const hero = await getSectionImage('journalPanel')

  const jsonLd = [
    webPageJsonLd({ path: `/${locale}${PATH}`, name: t.h1, description: t.metaDescription }),
    serviceJsonLd({ path: `/${locale}${PATH}`, name: t.serviceName, description: t.metaDescription }),
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
        <section className="editorial-section" aria-labelledby="en-personne">
          <p className="kicker">{t.personne.kicker}</p>
          <h2 id="en-personne" className="mt-3">{t.personne.h2}</h2>
          <div className="editorial-prose">
            <p>
              {t.personne.p1a}
              <strong>{t.personne.p1strong}</strong>
              {t.personne.p1b}
            </p>
            <p>{t.personne.p2}</p>
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

        <section className="editorial-section" aria-labelledby="adresse">
          <div className="editorial-split">
            <div className="editorial-prose">
              <p className="kicker">{t.adresse.kicker}</p>
              <h2 id="adresse" className="mt-3">{t.adresse.h2}</h2>
              <p>{t.adresse.p1}</p>
              <p>
                <strong>{t.adresse.p2strong}</strong>
                {t.adresse.p2rest}
              </p>
            </div>
            <EditorialFigure caption={t.adresse.caption} />
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="experience">
          <div className="editorial-split is-reversed">
            <div className="editorial-prose">
              <p className="kicker">{t.experience.kicker}</p>
              <h2 id="experience" className="mt-3">{t.experience.h2}</h2>
              <p>{t.experience.p1}</p>
              <p>{t.experience.p2}</p>
            </div>
            <EditorialFigure caption={t.experience.caption} />
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="trouver">
          <p className="kicker">{t.trouver.kicker}</p>
          <h2 id="trouver" className="mt-3">{t.trouver.h2}</h2>
          <div className="editorial-prose">
            <p>{t.trouver.intro}</p>
            <ul>
              {t.trouver.items.map((item) => (
                <li key={item.strong}>
                  <strong>{item.strong}</strong>
                  {item.rest}
                </li>
              ))}
            </ul>
            <p>{t.trouver.outro}</p>
          </div>
        </section>

        <section className="faq" aria-labelledby="faq-boutiques">
          <p className="kicker">{t.faqKicker}</p>
          <h2 id="faq-boutiques" className="mt-3">{t.faqTitle}</h2>
          <div className="faq-list">
            {t.faq.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="appointment" aria-labelledby="informer">
          <p className="kicker">{t.cta.kicker}</p>
          <h2 id="informer" className="mt-3">{t.cta.h2}</h2>
          <p>{t.cta.p}</p>
          <hr className="gold-rule gold-rule-center" />
          <Link href={p('/contact')} className="btn-gold">{t.cta.button}</Link>
        </section>
      </div>
    </>
  )
}
