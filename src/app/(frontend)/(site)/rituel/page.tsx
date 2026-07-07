import Link from 'next/link'

import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/structured-data'

// Page editoriale : contenu maquette (le client affinera le texte et fournira
// les vraies photos). Structure semantique pensee pour l'indexation Google.
export const dynamic = 'force-dynamic'

const PATH = '/rituel'
const TITLE = 'Le Rituel'
const DESCRIPTION =
  'Une séance privée sur rendez-vous : reçu sur le tatami, autour de l’encensoir, vous découvrez des parfums rares accompagnés d’un thé ou d’un café d’exception.'

export const generateMetadata = async () =>
  buildMetadata({ fallbackTitle: TITLE, fallbackDescription: DESCRIPTION, path: PATH })

const MOMENTS = [
  {
    kicker: 'L’accueil',
    title: 'Reçu sur le tatami',
    text: 'On vous installe, on ralentit. Le temps se suspend, les gestes deviennent mesurés. Rien ne presse — c’est là que l’expérience commence.',
    caption: 'Le tatami, l’espace du calme',
  },
  {
    kicker: 'L’encens',
    title: 'La fumée au centre',
    text: 'Au cœur de la pièce, l’encensoir diffuse une fumée parfumante et enivrante. Elle prépare le nez, éveille l’attention et installe l’atmosphère de la voie du Kōdō.',
    caption: 'L’encensoir et sa volute',
  },
  {
    kicker: 'La dégustation',
    title: 'Thé & café d’exception',
    text: 'Un thé ou un café rare d’Asie orientale accompagne la découverte. Le palais et le nez dialoguent — d’où notre signature : du palais au nez.',
    caption: 'Thés et cafés d’Extrême-Orient',
  },
  {
    kicker: 'La découverte',
    title: 'Les parfums rares',
    text: 'Vient enfin l’essentiel : l’essai des essences les plus précieuses, expliquées, comparées, comprises. Une rencontre, pas une vente.',
    caption: 'Les essences précieuses',
  },
]

export default function RituelPage() {
  const jsonLd = [
    serviceJsonLd({ path: PATH, name: TITLE, description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: TITLE, path: PATH },
    ]),
  ]

  return (
    <>
      {jsonLd.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}

      <header className="editorial-hero">
        <div className="editorial-hero__inner">
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link> <span aria-hidden="true">·</span> Le Rituel
          </nav>
          <p className="kicker mt-6">L’expérience Sailscents</p>
          <h1 className="mt-3">Le Rituel</h1>
          <p className="editorial-lede">
            Un moment hors du temps, sur rendez-vous : reçu sur le tatami, autour de l’encensoir,
            vous découvrez nos parfums les plus rares, un thé ou un café d’exception à la main.
          </p>
        </div>
      </header>

      <div className="editorial-body">
        {MOMENTS.map((moment, index) => (
          <section
            key={moment.kicker}
            className="editorial-section"
            aria-labelledby={`moment-${index}`}
          >
            <div className={`editorial-split${index % 2 === 1 ? ' is-reversed' : ''}`}>
              <div>
                <p className="kicker">{moment.kicker}</p>
                <h2 id={`moment-${index}`} className="mt-3">
                  {moment.title}
                </h2>
                <p>{moment.text}</p>
              </div>
              <figure className="editorial-figure" data-label="Photo à venir">
                <figcaption>{moment.caption}</figcaption>
              </figure>
            </div>
          </section>
        ))}

        <section className="appointment" aria-labelledby="rdv">
          <p className="kicker">Sur rendez-vous</p>
          <h2 id="rdv" className="mt-3">Une séance privée, offerte</h2>
          <p>
            Le Rituel se vit sur rendez-vous, en toute intimité, et sans frais. Notre seule
            ambition : vous faire vivre un moment inoubliable et vous laisser choisir, en connaissance
            de cause, l’essence qui vous ressemble.
          </p>
          <hr className="gold-rule gold-rule-center" />
          <Link href="/contact" className="btn-gold">
            Prendre rendez-vous
          </Link>
        </section>
      </div>
    </>
  )
}
