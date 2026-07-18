import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { HeroImage } from '@/components/HeroImage'
import { buildMetadata } from '@/lib/seo'
import { getSectionImage } from '@/lib/sectionImage'
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd, webPageJsonLd } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

const PATH = '/nos-boutiques'
const TITLE = 'Nos Boutiques — nous rencontrer & vivre l’expérience'
const DESCRIPTION =
  'Nous vous recevons sur rendez-vous, sur le tatami, autour de l’encensoir : une séance privée de découverte de nos parfums rares, accompagnée d’un thé ou d’un café d’exception. Sans frais.'

const FAQ = [
  {
    question: 'Comment vous rencontrer ?',
    answer:
      'Sur rendez-vous, afin de vous recevoir en toute intimité. Contactez-nous pour convenir d’un créneau : nous confirmons ensemble la date et l’heure de votre séance.',
  },
  {
    question: 'La rencontre est-elle payante ?',
    answer:
      'Non, la séance est offerte et sans engagement. Notre objectif est de vous faire vivre une expérience et de vous laisser choisir en connaissance de cause. Vous êtes libre de repartir sans achat.',
  },
  {
    question: 'Que se passe-t-il pendant la séance ?',
    answer:
      'Reçu sur le tatami, autour de l’encensoir, vous découvrez nos parfums rares — bois de Oud, Attars — accompagnés d’un thé ou d’un café d’exception. Chaque matière est présentée, comparée et expliquée.',
  },
]

export const generateMetadata = async () =>
  buildMetadata({ fallbackTitle: TITLE, fallbackDescription: DESCRIPTION, path: PATH })

export default async function NosBoutiquesPage() {
  const hero = await getSectionImage('journalPanel')

  const jsonLd = [
    webPageJsonLd({ path: PATH, name: 'Nos Boutiques', description: DESCRIPTION }),
    serviceJsonLd({ path: PATH, name: 'Séance privée de découverte Sailscents', description: DESCRIPTION }),
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

      <header className="editorial-hero">
        {hero && <HeroImage url={hero.url} alt={hero.alt} />}
        <div className="editorial-hero__inner">
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link> <span aria-hidden="true">·</span> Nos Boutiques
          </nav>
          <p className="kicker mt-6">Nous rencontrer</p>
          <h1 className="mt-3">Nos Boutiques</h1>
          <p className="editorial-lede">
            Nous vous recevons sur rendez-vous, sur le tatami, autour de l’encensoir : un moment hors
            du temps pour découvrir nos parfums les plus rares, un thé ou un café d’exception à la main.
          </p>
        </div>
      </header>

      <div className="editorial-body">
        <section className="editorial-section" aria-labelledby="experience">
          <div className="editorial-split">
            <div className="editorial-prose">
              <p className="kicker">L’expérience</p>
              <h2 id="experience" className="mt-3">Reçu comme un hôte</h2>
              <p>
                On vous installe, on ralentit. L’encensoir diffuse sa fumée parfumante, un thé ou un
                café rare d’Asie orientale accompagne la découverte, et l’on prend le temps de sentir,
                comparer et comprendre chaque essence.
              </p>
              <p>
                Ce n’est pas une vente : c’est une rencontre. Vous repartez avec une connaissance —
                et parfois avec l’essence qui vous ressemble.
              </p>
            </div>
            <EditorialFigure caption="Reçu sur le tatami" />
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="infos">
          <p className="kicker">En pratique</p>
          <h2 id="infos" className="mt-3">Uniquement sur rendez-vous</h2>
          <div className="editorial-prose">
            <p>
              Pour préserver l’intimité et la qualité de l’accueil, nous recevons exclusivement sur
              rendez-vous. Écrivez-nous pour convenir d’un moment : nous confirmons ensemble la date
              et l’heure de votre séance.
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

        <section className="appointment" aria-labelledby="rdv">
          <p className="kicker">Sur rendez-vous</p>
          <h2 id="rdv" className="mt-3">Prendre rendez-vous</h2>
          <p>
            Une séance privée, offerte et sans engagement. Écrivez-nous pour convenir d’un moment.
          </p>
          <hr className="gold-rule gold-rule-center" />
          <Link href="/contact" className="btn-gold">
            Nous contacter
          </Link>
        </section>
      </div>
    </>
  )
}
