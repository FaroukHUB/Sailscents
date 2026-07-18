import Image from 'next/image'
import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { buildMetadata } from '@/lib/seo'
import { getSectionImage } from '@/lib/sectionImage'
import { breadcrumbJsonLd, faqPageJsonLd, webPageJsonLd } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

const PATH = '/raretes'
const TITLE = 'Les Raretés — thé, safran, ambre gris & matières précieuses'
const DESCRIPTION =
  'Nos matières les plus rares : thés d’exception d’Asie orientale, safran, ambre gris et trésors olfactifs. Une sélection pointue, pour connaisseurs.'

const RARETES = [
  {
    title: 'Les thés d’exception',
    text: 'Crus rares d’Asie orientale, récoltes limitées et grands jardins. Des thés que l’on déguste comme on écoute un parfum — avec attention et lenteur.',
    caption: 'Thés rares d’Asie orientale',
  },
  {
    title: 'Le safran',
    text: 'L’or rouge : l’épice la plus précieuse au monde, cueillie à la main filament par filament. Une matière aussi recherchée en cuisine qu’en parfumerie, pour sa profondeur cuir-miel.',
    caption: 'Filaments de safran',
  },
  {
    title: 'L’ambre gris',
    text: 'Trésor marin et légendaire fixateur de la parfumerie, à la signature salée, animale et lumineuse. Une rareté absolue, réservée aux plus belles compositions.',
    caption: 'Ambre gris',
  },
]

const FAQ = [
  {
    question: 'Qu’est-ce que l’ambre gris ?',
    answer:
      'L’ambre gris est une matière rare d’origine marine, longtemps utilisée en parfumerie comme fixateur précieux. Sa signature est salée, animale et lumineuse à la fois — l’une des plus recherchées et des plus rares au monde.',
  },
  {
    question: 'Pourquoi le safran est-il si précieux ?',
    answer:
      'Le safran est cueilli à la main, filament par filament : il faut des dizaines de milliers de fleurs pour obtenir quelques grammes. Cette rareté, alliée à sa profondeur cuir-miel, en fait l’une des matières les plus précieuses, en cuisine comme en parfumerie.',
  },
  {
    question: 'Vos thés sont-ils des grands crus ?',
    answer:
      'Nous privilégions des récoltes limitées et des jardins réputés d’Asie orientale. Chaque thé est choisi pour ce qu’il apporte à la dégustation et pour son dialogue avec nos parfums — du palais au nez.',
  },
]

export const generateMetadata = async () =>
  buildMetadata({ fallbackTitle: TITLE, fallbackDescription: DESCRIPTION, path: PATH })

export default async function RaretesPage() {
  const hero = await getSectionImage('ateliersPanel')

  const jsonLd = [
    webPageJsonLd({ path: PATH, name: 'Les Raretés', description: DESCRIPTION, type: 'CollectionPage' }),
    faqPageJsonLd(FAQ),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Les Raretés', path: PATH },
    ]),
  ]

  return (
    <>
      {jsonLd.map((entry, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}

      <header className="editorial-hero">
        {hero && (
          <>
            <Image src={hero.url} alt={hero.alt} fill priority sizes="100vw" className="editorial-hero__img" />
            <span className="editorial-hero__scrim" aria-hidden="true" />
          </>
        )}
        <div className="editorial-hero__inner">
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link> <span aria-hidden="true">·</span> Les Raretés
          </nav>
          <p className="kicker mt-6">Matières précieuses</p>
          <h1 className="mt-3">Les Raretés</h1>
          <p className="editorial-lede">
            Au-delà des parfums, nos trésors : thés d’exception, safran, ambre gris. Des matières
            rares, choisies une à une, pour ceux qui cherchent l’exceptionnel.
          </p>
        </div>
      </header>

      <div className="editorial-body">
        {RARETES.map((item, index) => (
          <section key={item.title} className="editorial-section" aria-labelledby={`r-${index}`}>
            <div className={`editorial-split${index % 2 === 1 ? ' is-reversed' : ''}`}>
              <div className="editorial-prose">
                <p className="kicker">Rareté</p>
                <h2 id={`r-${index}`} className="mt-3">{item.title}</h2>
                <p>{item.text}</p>
              </div>
              <EditorialFigure caption={item.caption} />
            </div>
          </section>
        ))}

        <section className="faq" aria-labelledby="faq-raretes">
          <p className="kicker">Questions fréquentes</p>
          <h2 id="faq-raretes" className="mt-3">Nos matières rares</h2>
          <div className="faq-list">
            {FAQ.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="appointment" aria-labelledby="decouvrir">
          <p className="kicker">Sur rendez-vous</p>
          <h2 id="decouvrir" className="mt-3">Découvrir nos raretés</h2>
          <p>
            Nos matières les plus rares se découvrent en main propre, avec le temps et les
            explications qu’elles méritent. Nous vous recevons sans frais.
          </p>
          <hr className="gold-rule gold-rule-center" />
          <Link href="/nos-boutiques" className="btn-gold">
            Nous rencontrer
          </Link>
        </section>
      </div>
    </>
  )
}
