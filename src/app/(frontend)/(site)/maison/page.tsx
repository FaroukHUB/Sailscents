import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, faqPageJsonLd, webPageJsonLd } from '@/lib/structured-data'
import type { PageMedia } from '@/types/content'

// Page editoriale : contenu redige pour l'indexation et la conversion (le
// client pourra affiner le texte et fournir les vraies photos ensuite).
export const dynamic = 'force-dynamic'

const PATH = '/maison'
const TITLE = 'La Maison — parfumerie de niche : Oud, Attars, encens'
const DESCRIPTION =
  'Sailscents, maison de parfumerie de niche et de connaisseurs : bois de Oud, Attars (huiles parfumées), encens de la voie du Kōdō, thés et cafés d’exception d’Asie orientale, sélectionnés avec exigence.'

const FAQ = [
  {
    question: 'Qu’est-ce qu’une maison de parfumerie de niche ?',
    answer:
      'Une maison de niche crée et sélectionne des parfums en petites quantités, loin de la distribution de masse. Elle privilégie la qualité des matières premières, la rareté et l’identité olfactive plutôt que le volume. Chez Sailscents, cela signifie des bois de Oud, des Attars et des encens choisis un à un, pour leur origine et leur caractère.',
  },
  {
    question: 'Quelle est la différence entre un Attar et un parfum classique ?',
    answer:
      'Un Attar est une huile parfumée concentrée, traditionnellement obtenue par distillation de fleurs, de bois ou de résines, souvent sur une base de bois de santal. Contrairement à un parfum alcoolisé, il ne contient pas d’alcool : il se pose sur la peau, évolue lentement et tient longtemps. Sa concentration en fait une signature intime et durable.',
  },
  {
    question: 'D’où vient le bois de Oud que vous proposez ?',
    answer:
      'Le Oud, ou bois d’agar, provient principalement d’Asie du Sud-Est — notamment de l’Assam en Inde et du Cambodge. C’est l’une des matières les plus précieuses de la parfumerie, née de la résine que produit l’arbre Aquilaria lorsqu’il est infecté. Nous privilégions des sources traçables et des récoltes limitées.',
  },
  {
    question: 'Peut-on découvrir vos parfums avant d’acheter ?',
    answer:
      'Oui. Nous recevons sur rendez-vous, sans frais, pour une séance privée de découverte — Le Rituel. C’est le meilleur moyen de sentir, comparer et comprendre les matières avant de choisir. La vente n’est jamais l’objectif : la rencontre avec l’odeur juste l’est.',
  },
]

export const generateMetadata = async () =>
  buildMetadata({ fallbackTitle: TITLE, fallbackDescription: DESCRIPTION, path: PATH })

export default async function MaisonPage() {
  const payload = await getPayloadClient()
  const media = (await payload
    .findGlobal({ slug: 'pageMedia' })
    .catch(() => null)) as PageMedia | null

  const jsonLd = [
    webPageJsonLd({ path: PATH, name: 'La Maison', description: DESCRIPTION, type: 'AboutPage' }),
    faqPageJsonLd(FAQ),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'La Maison', path: PATH },
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
          <p className="kicker mt-6">Maison sensorielle de connaisseurs</p>
          <h1 className="mt-3">La Maison</h1>
          <p className="editorial-lede">
            Sailscents est une maison de parfumerie de niche dédiée aux matières les plus rares —
            bois de Oud, Attars, encens de la voie du Kōdō, thés et cafés d’exception. Nous ne
            vendons pas un flacon : nous transmettons une connaissance.
          </p>
        </div>
      </header>

      <div className="editorial-body">
        <section className="editorial-section" aria-labelledby="metier">
          <p className="kicker">Notre métier</p>
          <h2 id="metier" className="mt-3">Des connaisseurs, pas des marchands</h2>
          <div className="editorial-prose">
            <p>
              Sailscents est née d’une conviction simple : un grand parfum ne se vend pas, il se
              comprend. Là où la parfumerie de masse cherche le volume et la nouveauté permanente,
              nous cultivons l’inverse — la rareté, la patience et la précision. Chaque bois de Oud,
              chaque Attar, chaque encens qui entre dans notre sélection a été senti, comparé et
              éprouvé avant d’être retenu.
            </p>
            <p>
              Nous parlons matières premières, méthodes de distillation et maturation comme d’autres
              parlent de grands crus. Cette exigence n’est pas un argument marketing : c’est ce qui
              distingue une <strong>maison de connaisseurs</strong> d’un simple revendeur. Elle guide
              tout ce que nous proposons, du plus discret des encens au plus précieux des Attars.
            </p>
          </div>

          <div className="trust-row">
            <div className="trust-item">
              <h3>Sélection rare</h3>
              <p>Des récoltes limitées et des producteurs choisis, jamais de production de masse.</p>
            </div>
            <div className="trust-item">
              <h3>Conseil d’expert</h3>
              <p>Une connaissance réelle des matières, transmise sans jargon ni précipitation.</p>
            </div>
            <div className="trust-item">
              <h3>Expérience unique</h3>
              <p>La découverte sur le tatami, autour de l’encensoir — Le Rituel Sailscents.</p>
            </div>
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="matieres">
          <div className="editorial-split">
            <div className="editorial-prose">
              <p className="kicker">Les matières</p>
              <h2 id="matieres" className="mt-3">Du Oud aux infusions d’Extrême-Orient</h2>
              <p>
                Notre univers réunit ce que les grandes traditions olfactives ont de plus abouti,
                sans jamais diluer la rareté :
              </p>
              <ul>
                <li>
                  <strong>Le bois de Oud</strong> — d’Assam et du Cambodge, l’une des matières les
                  plus précieuses au monde, à la profondeur boisée et animale inimitable.
                </li>
                <li>
                  <strong>Les Attars</strong> — huiles parfumées concentrées, sans alcool, pressées
                  et distillées selon des savoir-faire séculaires.
                </li>
                <li>
                  <strong>L’encens</strong> — au cœur de la voie japonaise du Kōdō, l’art d’écouter
                  les parfums brûlés.
                </li>
                <li>
                  <strong>Les thés et cafés d’exception</strong> — crus rares d’Asie orientale qui
                  prolongent l’expérience, du palais au nez.
                </li>
              </ul>
            </div>
            <EditorialFigure media={media?.maison?.matieres} caption="Bois de Oud & flacons d’Attars" />
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="exigence">
          <div className="editorial-split is-reversed">
            <div className="editorial-prose">
              <p className="kicker">L’exigence</p>
              <h2 id="exigence" className="mt-3">Le sourcing, avant tout</h2>
              <p>
                La rareté se mérite. Rien n’entre dans notre sélection sans avoir traversé le même
                filtre : l’origine est-elle traçable ? La matière est-elle à la hauteur ? L’émotion
                est-elle au rendez-vous ? Nous privilégions les petits producteurs, les récoltes
                limitées et les savoir-faire menacés — quitte à proposer moins, mais mieux.
              </p>
              <h3>Une traçabilité assumée</h3>
              <p>
                Connaître la provenance d’un Oud ou d’un Attar, c’est respecter à la fois la matière,
                l’artisan et le client. Ce que vous découvrez chez Sailscents, peu de maisons peuvent
                le proposer — et c’est précisément ce qui fait la valeur d’une essence rare.
              </p>
            </div>
            <EditorialFigure media={media?.maison?.sourcing} caption="La sélection, flacon par flacon" />
          </div>
        </section>

        <section className="faq" aria-labelledby="faq-maison">
          <p className="kicker">Questions fréquentes</p>
          <h2 id="faq-maison" className="mt-3">Comprendre notre univers</h2>
          <div className="faq-list">
            {FAQ.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="appointment" aria-labelledby="suite">
          <p className="kicker">Aller plus loin</p>
          <h2 id="suite" className="mt-3">Vivez-le, ne le lisez pas</h2>
          <p>
            La meilleure façon de comprendre notre travail reste de le vivre : sur le tatami, autour
            de l’encensoir, un thé ou un café d’exception à la main. Une séance privée, sur
            rendez-vous et sans frais.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
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
