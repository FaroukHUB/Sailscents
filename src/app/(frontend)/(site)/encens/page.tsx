import Image from 'next/image'
import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { buildMetadata } from '@/lib/seo'
import { getSectionImage } from '@/lib/sectionImage'
import { breadcrumbJsonLd, faqPageJsonLd, webPageJsonLd } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

const PATH = '/encens'
const TITLE = 'Les Encens — la voie du Kōdō, l’art de l’encens'
const DESCRIPTION =
  'Encens et bois à brûler dans la tradition japonaise du Kōdō : bois de Oud, résines et matières nobles, à « écouter » plutôt qu’à sentir. Une sélection de connaisseurs.'

const FAQ = [
  {
    question: 'Qu’est-ce que le Kōdō ?',
    answer:
      'Le Kōdō, ou « voie de l’encens », est l’une des trois grandes cérémonies raffinées du Japon, aux côtés du thé et de l’ikebana. On n’y dit pas que l’on « sent » l’encens : on l’« écoute ». Tout y est attention, silence et lenteur.',
  },
  {
    question: 'Comment utiliser un encens de qualité ?',
    answer:
      'Sur charbon ou brûleur adapté, à faible chaleur, pour laisser la matière se révéler sans la brûler. Quelques éclats de bois suffisent : l’objectif est la finesse de la volute, pas la quantité de fumée.',
  },
  {
    question: 'Le bois de Oud se brûle-t-il aussi ?',
    answer:
      'Oui. Au-delà des parfums, le Oud se brûle en copeaux : c’est l’une des expériences olfactives les plus recherchées, profonde, résineuse et enveloppante, au cœur de la tradition du Kōdō.',
  },
]

export const generateMetadata = async () =>
  buildMetadata({ fallbackTitle: TITLE, fallbackDescription: DESCRIPTION, path: PATH })

export default async function EncensPage() {
  const hero = await getSectionImage('collectionsPanel')

  const jsonLd = [
    webPageJsonLd({ path: PATH, name: 'Les Encens', description: DESCRIPTION, type: 'CollectionPage' }),
    faqPageJsonLd(FAQ),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Les Encens', path: PATH },
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
            <Link href="/">Accueil</Link> <span aria-hidden="true">·</span> Les Encens
          </nav>
          <p className="kicker mt-6">La voie du Kōdō</p>
          <h1 className="mt-3">Les Encens</h1>
          <p className="editorial-lede">
            Bois à brûler et résines nobles dans la tradition japonaise de l’encens — des matières
            que l’on écoute plutôt qu’on ne sent, dans le silence et la lenteur.
          </p>
        </div>
      </header>

      <div className="editorial-body">
        <section className="editorial-section" aria-labelledby="kodo">
          <div className="editorial-split">
            <div className="editorial-prose">
              <p className="kicker">« Écouter » l’encens</p>
              <h2 id="kodo" className="mt-3">Le Kōdō, un art de l’attention</h2>
              <p>
                Dans la voie du Kōdō, l’encens n’est pas un décor : c’est une expérience. On prépare
                le geste, on ralentit, on porte attention à chaque nuance de la volute. La fumée
                parfumante devient un fil conducteur, presque une méditation.
              </p>
              <p>
                C’est cet esprit qui guide notre sélection : des matières assez nobles pour mériter
                qu’on s’y arrête.
              </p>
            </div>
            <EditorialFigure caption="L’encensoir et sa volute" />
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="matieres">
          <div className="editorial-split is-reversed">
            <div className="editorial-prose">
              <p className="kicker">Nos matières</p>
              <h2 id="matieres" className="mt-3">Bois, résines et Oud à brûler</h2>
              <p>
                Copeaux de Oud, résines et bois odorants : chaque matière est choisie pour la
                qualité de sa combustion et la finesse de son parfum. Rien de saturé, rien de
                synthétique — seulement la vérité d’une belle matière qui se consume.
              </p>
            </div>
            <EditorialFigure caption="Copeaux de Oud &amp; résines" />
          </div>
        </section>

        <section className="faq" aria-labelledby="faq-encens">
          <p className="kicker">Questions fréquentes</p>
          <h2 id="faq-encens" className="mt-3">Comprendre l’encens</h2>
          <div className="faq-list">
            {FAQ.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="appointment" aria-labelledby="vivre">
          <p className="kicker">Vivre le Kōdō</p>
          <h2 id="vivre" className="mt-3">Autour de l’encensoir</h2>
          <p>
            La meilleure façon de comprendre l’encens reste de l’écouter avec nous, autour de
            l’encensoir. Sur rendez-vous, sans frais.
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
