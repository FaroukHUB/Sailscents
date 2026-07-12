import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from '@/lib/structured-data'
import type { PageMedia } from '@/types/content'

// Page editoriale : contenu redige pour l'indexation et la conversion (le
// client pourra affiner le texte et fournir les vraies photos ensuite).
export const dynamic = 'force-dynamic'

const PATH = '/rituel'
const TITLE = 'Le Rituel — séance privée de découverte olfactive sur rendez-vous'
const DESCRIPTION =
  'Le Rituel Sailscents : une séance privée sur rendez-vous, sans frais. Reçu sur le tatami, autour de l’encensoir, découvrez des parfums rares — bois de Oud, Attars — accompagnés d’un thé ou d’un café d’exception, dans l’esprit du Kōdō.'

const MOMENTS = [
  {
    imageKey: 'accueil',
    kicker: 'Premier temps · L’accueil',
    title: 'Reçu sur le tatami',
    lead: 'On vous installe, on ralentit. Le temps se suspend, les gestes deviennent mesurés.',
    body: 'Rien ne presse. L’expérience commence par un changement de rythme : celui du tatami, où l’on pose les épaules et où l’attention se concentre. C’est cette lenteur choisie qui rend la découverte olfactive si précise — le nez, apaisé, perçoit ce qu’il manque d’ordinaire.',
    caption: 'Le tatami, l’espace du calme',
  },
  {
    imageKey: 'encens',
    kicker: 'Deuxième temps · L’encens',
    title: 'La fumée au centre',
    lead: 'Au cœur de la pièce, l’encensoir diffuse une fumée parfumante et enivrante.',
    body: 'Elle prépare le nez, éveille l’attention et installe l’atmosphère de la voie du Kōdō — cet art japonais où l’on ne « sent » pas l’encens mais où on l’« écoute ». La volute devient le fil conducteur de la séance, un repère olfactif autour duquel tout se joue.',
    caption: 'L’encensoir et sa volute',
  },
  {
    imageKey: 'degustation',
    kicker: 'Troisième temps · La dégustation',
    title: 'Thé & café d’exception',
    lead: 'Un thé ou un café rare d’Asie orientale accompagne la découverte.',
    body: 'Le palais et le nez dialoguent : une gorgée nettoie, relance, révèle une facette qu’un parfum seul ne livrerait pas. C’est de cet accord qu’est née notre signature — du palais au nez. Chaque cru est choisi pour ce qu’il apporte à la dégustation, jamais par hasard.',
    caption: 'Thés et cafés d’Extrême-Orient',
  },
  {
    imageKey: 'decouverte',
    kicker: 'Quatrième temps · La découverte',
    title: 'Les parfums rares',
    lead: 'Vient enfin l’essentiel : l’essai des essences les plus précieuses.',
    body: 'Bois de Oud, Attars, accords rares : chaque essence est présentée, expliquée, comparée. On prend le temps de comprendre d’où elle vient, comment elle a été obtenue, ce qu’elle raconte sur la peau. Une rencontre, pas une vente — vous repartez avec une connaissance, et parfois avec l’essence qui vous ressemble.',
    caption: 'Les essences précieuses',
  },
] as const

const FAQ = [
  {
    question: 'Le Rituel est-il vraiment gratuit ?',
    answer:
      'Oui, la séance est offerte et sans engagement. Notre objectif n’est pas de vendre à tout prix, mais de vous faire vivre une expérience et de vous laisser choisir en connaissance de cause. Vous êtes libre de repartir sans aucun achat.',
  },
  {
    question: 'Comment prendre rendez-vous ?',
    answer:
      'Le Rituel se déroule uniquement sur rendez-vous, afin de vous recevoir en toute intimité. Contactez-nous via la page Contact pour convenir d’un créneau ; nous confirmons ensemble la date et l’heure de votre séance privée.',
  },
  {
    question: 'Combien de temps dure une séance ?',
    answer:
      'Comptez généralement entre une et deux heures. La durée dépend de votre curiosité et du nombre de matières que vous souhaitez découvrir — l’expérience n’est jamais chronométrée, c’est le temps du rituel qui prime.',
  },
  {
    question: 'Faut-il des connaissances en parfumerie pour venir ?',
    answer:
      'Aucune. Le Rituel s’adresse autant aux curieux qu’aux amateurs avertis. Nous adaptons les explications à votre niveau, sans jargon, pour que chacun reparte en comprenant mieux ce qu’il a senti.',
  },
  {
    question: 'Que vais-je découvrir pendant Le Rituel ?',
    answer:
      'Des matières rares de notre sélection : bois de Oud d’Assam et du Cambodge, Attars (huiles parfumées sans alcool), encens dans la tradition du Kōdō, ainsi que des thés et cafés d’exception d’Asie orientale qui accompagnent la dégustation.',
  },
]

export const generateMetadata = async () =>
  buildMetadata({ fallbackTitle: TITLE, fallbackDescription: DESCRIPTION, path: PATH })

export default async function RituelPage() {
  const payload = await getPayloadClient()
  const media = (await payload
    .findGlobal({ slug: 'pageMedia' })
    .catch(() => null)) as PageMedia | null

  const jsonLd = [
    serviceJsonLd({ path: PATH, name: 'Le Rituel Sailscents', description: DESCRIPTION }),
    faqPageJsonLd(FAQ),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Le Rituel', path: PATH },
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
            Une séance privée de découverte olfactive, sur rendez-vous et sans frais. Reçu sur le
            tatami, autour de l’encensoir, vous découvrez nos parfums les plus rares — bois de Oud,
            Attars — un thé ou un café d’exception à la main.
          </p>
        </div>
      </header>

      <div className="editorial-body">
        <section className="editorial-section" aria-labelledby="intro">
          <p className="kicker">L’esprit du Kōdō</p>
          <h2 id="intro" className="mt-3">Écouter les parfums, pas seulement les sentir</h2>
          <div className="editorial-prose">
            <p>
              Le Rituel s’inspire du <strong>Kōdō</strong>, la « voie de l’encens » japonaise, l’une
              des trois grandes cérémonies raffinées du Japon aux côtés du thé et de l’ikebana. Dans
              cette tradition, on ne dit pas que l’on « sent » un parfum : on l’« écoute ». Tout est
              là — l’attention, le silence, la lenteur. C’est cet état d’esprit que nous recréons,
              pour transformer un simple essai de parfum en une véritable expérience sensorielle.
            </p>
            <p>
              Concrètement, Le Rituel se vit en quatre temps, comme une progression : l’accueil,
              l’encens, la dégustation, puis la découverte des essences. Chaque étape prépare la
              suivante et affine votre perception.
            </p>
          </div>
        </section>

        {MOMENTS.map((moment, index) => (
          <section
            key={moment.kicker}
            className="editorial-section"
            aria-labelledby={`moment-${index}`}
          >
            <div className={`editorial-split${index % 2 === 1 ? ' is-reversed' : ''}`}>
              <div className="editorial-prose">
                <p className="kicker">{moment.kicker}</p>
                <h2 id={`moment-${index}`} className="mt-3">
                  {moment.title}
                </h2>
                <p>{moment.lead}</p>
                <p>{moment.body}</p>
              </div>
              <EditorialFigure media={media?.rituel?.[moment.imageKey]} caption={moment.caption} />
            </div>
          </section>
        ))}

        <section className="editorial-section" aria-labelledby="pourquoi">
          <p className="kicker">Pourquoi Le Rituel</p>
          <h2 id="pourquoi" className="mt-3">Choisir un parfum rare, en connaissance de cause</h2>
          <div className="editorial-prose">
            <p>
              Un bois de Oud ou un Attar d’exception ne se choisit pas sur un écran. Ces matières
              évoluent sur la peau, se déploient dans le temps, révèlent des facettes que seule
              l’expérience directe peut faire apparaître. Le Rituel existe pour cela : vous laisser
              sentir, comparer et comprendre avant de décider.
            </p>
            <p>
              C’est aussi notre manière de démontrer notre métier. En quelques heures, vous
              percevez la différence entre une essence choisie avec soin et un parfum de grande
              distribution — et vous repartez avec un regard neuf, que vous achetiez ou non.
            </p>
          </div>
        </section>

        <section className="faq" aria-labelledby="faq-rituel">
          <p className="kicker">Questions fréquentes</p>
          <h2 id="faq-rituel" className="mt-3">Avant de réserver</h2>
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
          <h2 id="rdv" className="mt-3">Une séance privée, offerte</h2>
          <p>
            Le Rituel se vit sur rendez-vous, en toute intimité, et sans frais. Notre seule
            ambition : vous faire vivre un moment inoubliable et vous laisser choisir, en
            connaissance de cause, l’essence qui vous ressemble.
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
