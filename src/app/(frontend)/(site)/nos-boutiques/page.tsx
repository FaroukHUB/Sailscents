import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { HeroImage } from '@/components/HeroImage'
import { buildMetadata } from '@/lib/seo'
import { getSectionImage } from '@/lib/sectionImage'
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd, webPageJsonLd } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

const PATH = '/nos-boutiques'
const TITLE = 'Nos Boutiques — nous rencontrer, sentir et acheter en personne'
const DESCRIPTION =
  'Au-delà de la vente en ligne, nos parfums rares se découvrent aussi en personne : bois de Oud, Attars, roses de collection, mukhalat. Un connaisseur vous reçoit, vous conseille et vous fait tester chaque essence. Les informations pratiques de la boutique seront communiquées prochainement.'

const FAQ = [
  {
    question: 'Peut-on acheter directement en boutique ?',
    answer:
      'Oui. Au-delà de la vente en ligne, nous vous recevons en personne pour découvrir, sentir et acheter nos parfums. C’est le meilleur moyen de choisir une essence rare : sur la peau, comparée, expliquée par un connaisseur.',
  },
  {
    question: 'Où se trouve votre boutique ?',
    answer:
      'Nos matières se découvrent aussi en personne, dans notre boutique. Les informations pratiques — adresse, accès, horaires — seront indiquées ici même, sur cette page, dès qu’elles seront disponibles.',
  },
  {
    question: 'Comment nous rendre visite ?',
    answer:
      'Écrivez-nous via la page Contact : nous vous communiquons les informations pratiques et répondons à toutes vos questions.',
  },
  {
    question: 'Faut-il acheter pour venir ?',
    answer:
      'Non. La visite est sans engagement : vous pouvez venir découvrir, sentir et comprendre nos matières, et repartir sans achat. Notre objectif est la rencontre avec l’odeur juste, pas la vente à tout prix.',
  },
  {
    question: 'Puis-je essayer les parfums avant d’acheter ?',
    answer:
      'Absolument — c’est tout l’intérêt de la boutique. On teste sur la peau, on laisse évoluer, on compare plusieurs essences, et l’on choisit en connaissance de cause.',
  },
]

export const generateMetadata = async () =>
  buildMetadata({ fallbackTitle: TITLE, fallbackDescription: DESCRIPTION, path: PATH })

export default async function NosBoutiquesPage() {
  const hero = await getSectionImage('journalPanel')

  const jsonLd = [
    webPageJsonLd({ path: PATH, name: 'Nos Boutiques', description: DESCRIPTION }),
    serviceJsonLd({ path: PATH, name: 'Boutique Sailscents — vente et conseil en personne', description: DESCRIPTION }),
    faqPageJsonLd(FAQ),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Nos Boutiques', path: PATH },
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
            <Link href="/">Accueil</Link> <span aria-hidden="true">·</span> Nos Boutiques
          </nav>
          <p className="kicker mt-6">Nous rencontrer</p>
          <h1 className="mt-3">Nos Boutiques</h1>
          <p className="editorial-lede">
            Nos parfums les plus rares se vivent aussi en personne. Dans notre boutique, vous sentez,
            comparez et choisissez — accompagné par un connaisseur, un thé ou un café d’exception à la
            main.
          </p>
        </div>
      </header>

      <div className="editorial-body">
        <section className="editorial-section" aria-labelledby="en-personne">
          <p className="kicker">Acheter en personne</p>
          <h2 id="en-personne" className="mt-3">Ce qu’un écran ne remplacera jamais</h2>
          <div className="editorial-prose">
            <p>
              Un bois de Oud, un Attar, une rose de collection ne se choisissent pas sur une photo.
              Ces matières vivent sur la peau : elles se réchauffent, évoluent, révèlent au fil des
              heures des facettes qu’aucune description ne peut restituer. C’est pourquoi, en plus de
              la vente en ligne, nous vous recevons en boutique pour acheter <strong>en connaissance
              de cause</strong>.
            </p>
            <p>
              Sur place, vous ne faites pas qu’acheter un flacon : vous êtes conseillé par un
              connaisseur qui vous explique l’origine, la méthode de distillation, la signature de
              chaque essence. Vous sentez, vous comparez, vous prenez le temps. C’est la différence
              entre acquérir un parfum et le comprendre.
            </p>
          </div>

          <div className="trust-row">
            <div className="trust-item">
              <h3>Conseil d’expert</h3>
              <p>Un accompagnement par un connaisseur, sans jargon ni précipitation.</p>
            </div>
            <div className="trust-item">
              <h3>Essayer avant d’acheter</h3>
              <p>Tester sur la peau, laisser évoluer, comparer plusieurs essences.</p>
            </div>
            <div className="trust-item">
              <h3>Authenticité garantie</h3>
              <p>Chaque flacon présenté, testé et expliqué — des matières rares et tracées.</p>
            </div>
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="adresse">
          <div className="editorial-split">
            <div className="editorial-prose">
              <p className="kicker">Où nous trouver</p>
              <h2 id="adresse" className="mt-3">Nos parfums, aussi en boutique</h2>
              <p>
                Nos matières se découvrent également en personne : nos parfums sont présentés dans notre
                boutique, où l’on peut les sentir, les comparer et les choisir tranquillement.
              </p>
              <p>
                <strong>Les informations pratiques — adresse, accès, horaires — seront communiquées
                prochainement</strong>, ici même. En attendant, n’hésitez pas à nous écrire pour toute
                question.
              </p>
            </div>
            <EditorialFigure caption="L’accueil, en toute simplicité" />
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="experience">
          <div className="editorial-split is-reversed">
            <div className="editorial-prose">
              <p className="kicker">L’expérience</p>
              <h2 id="experience" className="mt-3">Reçu comme un hôte, sur le tatami</h2>
              <p>
                On vous installe, on ralentit. L’encensoir diffuse sa fumée parfumante, un thé ou un
                café rare d’Asie orientale accompagne la découverte, et l’on prend le temps de sentir
                et de comprendre chaque essence — du palais au nez.
              </p>
              <p>
                Ce n’est pas une simple visite en magasin : c’est une rencontre autour du parfum, dans
                l’esprit de la voie du Kōdō.
              </p>
            </div>
            <EditorialFigure caption="Autour de l’encensoir" />
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="trouver">
          <p className="kicker">En boutique</p>
          <h2 id="trouver" className="mt-3">Ce que vous pouvez découvrir sur place</h2>
          <div className="editorial-prose">
            <p>
              L’ensemble de notre sélection se découvre en personne — souvent mieux qu’en ligne,
              parce qu’on peut tout sentir et comparer :
            </p>
            <ul>
              <li>
                <strong>Les huiles de Oud</strong>, par origine et par style — Vietnam, Bornéo, Assam,
                Indonésie, Sri Lanka…
              </li>
              <li>
                <strong>Les roses</strong> de collection — Taïf, Cachemire, et des raretés vintage.
              </li>
              <li>
                <strong>Les mukhalat</strong>, nos compositions signature.
              </li>
            </ul>
            <p>
              Un connaisseur vous guide selon vos goûts, et vous repartez avec l’essence qui vous
              ressemble — ou simplement avec une connaissance nouvelle.
            </p>
          </div>
        </section>

        <section className="faq" aria-labelledby="faq-boutiques">
          <p className="kicker">Questions fréquentes</p>
          <h2 id="faq-boutiques" className="mt-3">Avant de venir</h2>
          <div className="faq-list">
            {FAQ.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="appointment" aria-labelledby="informer">
          <p className="kicker">Nous contacter</p>
          <h2 id="informer" className="mt-3">Une question ? Écrivez-nous</h2>
          <p>
            Pour toute question sur nos parfums ou sur les informations pratiques de la boutique,
            laissez-nous un mot : nous vous répondons avec plaisir.
          </p>
          <hr className="gold-rule gold-rule-center" />
          <Link href="/contact" className="btn-gold">
            Nous écrire
          </Link>
        </section>
      </div>
    </>
  )
}
