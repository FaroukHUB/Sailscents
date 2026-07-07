import Link from 'next/link'

import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'

// Page editoriale : contenu maquette (le client affinera le texte et fournira
// les vraies photos). Structure semantique pensee pour l'indexation Google.
export const dynamic = 'force-dynamic'

const PATH = '/maison'
const TITLE = 'La Maison'
const DESCRIPTION =
  'Sailscents, maison sensorielle de connaisseurs : bois de Oud, Attars, encens, thés et cafés d’exception d’Asie orientale, choisis avec exigence.'

export const generateMetadata = async () =>
  buildMetadata({ fallbackTitle: TITLE, fallbackDescription: DESCRIPTION, path: PATH })

export default function MaisonPage() {
  const jsonLd = [
    webPageJsonLd({ path: PATH, name: TITLE, description: DESCRIPTION, type: 'AboutPage' }),
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
            <Link href="/">Accueil</Link> <span aria-hidden="true">·</span> La Maison
          </nav>
          <p className="kicker mt-6">Maison sensorielle</p>
          <h1 className="mt-3">La Maison</h1>
          <p className="editorial-lede">
            Nous ne vendons pas un parfum. Nous transmettons une connaissance — celle des matières
            rares, du geste juste et du temps qu’il faut pour comprendre une odeur.
          </p>
        </div>
      </header>

      <div className="editorial-body">
        <section className="editorial-section" aria-labelledby="metier">
          <p className="kicker">Notre métier</p>
          <h2 id="metier" className="mt-3">Des connaisseurs, pas des marchands</h2>
          <p>
            Sailscents est née d’une obsession : la précision. Chaque bois de Oud, chaque Attar,
            chaque encens est choisi pour son origine, sa méthode d’extraction et sa signature
            olfactive. Nous parlons matières premières, distillation et maturation comme d’autres
            parlent de crus. C’est cette exigence qui distingue une maison d’un simple revendeur.
          </p>
        </section>

        <section className="editorial-section" aria-labelledby="matieres">
          <div className="editorial-split">
            <div>
              <p className="kicker">Les matières</p>
              <h2 id="matieres" className="mt-3">Du Oud aux infusions d’Extrême-Orient</h2>
              <p>
                Bois de Oud d’Assam et du Cambodge, Attars pressés à froid, encens de la voie du
                Kōdō, thés et cafés d’exception venus d’Asie orientale. Nous réunissons ce que les
                traditions ont de plus abouti, sans jamais diluer la rareté.
              </p>
            </div>
            <figure className="editorial-figure" data-label="Photo à venir">
              <figcaption>Bois de Oud &amp; flacons d’Attars</figcaption>
            </figure>
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="exigence">
          <div className="editorial-split is-reversed">
            <div>
              <p className="kicker">L’exigence</p>
              <h2 id="exigence" className="mt-3">Le sourcing avant tout</h2>
              <p>
                Rien n’entre dans notre sélection sans avoir été senti, comparé, éprouvé. La rareté
                se mérite : nous privilégions les petits producteurs, les récoltes limitées et les
                savoir-faire menacés. Ce que vous découvrez chez nous, peu de maisons peuvent le
                proposer.
              </p>
            </div>
            <figure className="editorial-figure" data-label="Photo à venir">
              <figcaption>La sélection, flacon par flacon</figcaption>
            </figure>
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="suite">
          <p className="kicker">Aller plus loin</p>
          <h2 id="suite" className="mt-3">Vivez-le, ne le lisez pas</h2>
          <p>
            La meilleure façon de comprendre notre travail reste de le vivre : sur le tatami, autour
            de l’encensoir, un thé ou un café d’exception à la main.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/rituel" className="btn-gold">
              Découvrir Le Rituel
            </Link>
            <Link href="/boutique" className="btn-gold">
              Explorer la Boutique
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
