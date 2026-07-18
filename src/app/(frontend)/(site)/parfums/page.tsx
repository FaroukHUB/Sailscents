import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, faqPageJsonLd, webPageJsonLd } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

const PATH = '/parfums'
const TITLE = 'Les Parfums — Attars, huiles parfumées & Oud'
const DESCRIPTION =
  'Attars et huiles parfumées d’exception, sans alcool, autour du bois de Oud et des plus belles matières. Des signatures rares, concentrées et durables, choisies par des connaisseurs.'

const FAQ = [
  {
    question: 'Qu’est-ce qu’un Attar ?',
    answer:
      'Un Attar est une huile parfumée concentrée, sans alcool, traditionnellement obtenue par distillation de fleurs, de bois ou de résines sur une base de bois de santal. Il se pose sur la peau, évolue lentement et tient très longtemps.',
  },
  {
    question: 'Pourquoi vos parfums sont-ils sans alcool ?',
    answer:
      'La tradition de l’Attar privilégie l’huile pure : elle respecte la matière, ne l’agresse pas et offre un sillage plus intime et plus tenace qu’un parfum alcoolisé. C’est aussi une signature plus proche de la peau.',
  },
  {
    question: 'Comment porter une huile parfumée ?',
    answer:
      'Quelques touches suffisent, aux points de pulsation (poignets, cou). L’huile se réchauffe au contact de la peau et révèle ses facettes au fil des heures. Inutile d’en mettre beaucoup : la concentration fait le reste.',
  },
]

export const generateMetadata = async () =>
  buildMetadata({ fallbackTitle: TITLE, fallbackDescription: DESCRIPTION, path: PATH })

export default function ParfumsPage() {
  const jsonLd = [
    webPageJsonLd({ path: PATH, name: 'Les Parfums', description: DESCRIPTION, type: 'CollectionPage' }),
    faqPageJsonLd(FAQ),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Les Parfums', path: PATH },
    ]),
  ]

  return (
    <>
      {jsonLd.map((entry, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}

      <header className="editorial-hero">
        <div className="editorial-hero__inner">
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link> <span aria-hidden="true">·</span> Les Parfums
          </nav>
          <p className="kicker mt-6">Attars &amp; huiles parfumées</p>
          <h1 className="mt-3">Les Parfums</h1>
          <p className="editorial-lede">
            Des huiles parfumées concentrées, sans alcool, construites autour du bois de Oud et des
            plus belles matières. Des signatures rares, intimes et durables.
          </p>
        </div>
      </header>

      <div className="editorial-body">
        <section className="editorial-section" aria-labelledby="art">
          <div className="editorial-split">
            <div className="editorial-prose">
              <p className="kicker">L’art de l’Attar</p>
              <h2 id="art" className="mt-3">La concentration, pas la dilution</h2>
              <p>
                Là où la parfumerie industrielle allonge ses jus d’alcool, l’Attar fait le choix
                inverse : l’huile pure. Distillé avec patience, il capture la matière dans toute sa
                densité — un bois de Oud, une rose, une résine — et la dépose telle quelle sur la peau.
              </p>
              <p>
                Le résultat est une signature qui évolue lentement, se réchauffe au fil des heures et
                ne s’impose jamais : elle accompagne, elle ne crie pas. C’est le luxe du peu, mais du
                juste.
              </p>
            </div>
            <EditorialFigure caption="Flacons d’Attars &amp; bois de Oud" />
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="oud">
          <div className="editorial-split is-reversed">
            <div className="editorial-prose">
              <p className="kicker">Le cœur de notre sélection</p>
              <h2 id="oud" className="mt-3">Le bois de Oud</h2>
              <p>
                Matière parmi les plus précieuses au monde, le Oud — ou bois d’agar — offre une
                profondeur boisée, animale et résineuse inimitable. Nous privilégions des origines
                traçables, d’Assam et du Cambodge, et des récoltes limitées.
              </p>
              <p>
                Autour de lui se construisent nos accords les plus rares, seuls ou mariés à la rose,
                au safran ou à l’ambre.
              </p>
            </div>
            <EditorialFigure caption="Le bois de Oud" />
          </div>
        </section>

        <section className="faq" aria-labelledby="faq-parfums">
          <p className="kicker">Questions fréquentes</p>
          <h2 id="faq-parfums" className="mt-3">Bien choisir son parfum</h2>
          <div className="faq-list">
            {FAQ.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="appointment" aria-labelledby="essai">
          <p className="kicker">Avant d’acheter</p>
          <h2 id="essai" className="mt-3">Sentir avant de choisir</h2>
          <p>
            Un parfum rare ne se choisit pas sur un écran. Nous vous recevons pour le découvrir,
            le comparer et le comprendre — sur rendez-vous, sans frais.
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
