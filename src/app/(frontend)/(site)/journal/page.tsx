import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { blogJsonLd, breadcrumbJsonLd, webPageJsonLd } from '@/lib/structured-data'
import type { Article } from '@/types/content'

// Rendu dynamique : les articles viennent de Payload/Postgres.
export const dynamic = 'force-dynamic'

const PATH = '/journal'
const TITLE = 'Le Journal'
const DESCRIPTION =
  'Récits, rituels et savoir-faire autour du bois de Oud, des Attars, du café et du thé d’exception — la connaissance d’une maison de connaisseurs.'

// Piliers editoriaux : ils annoncent la ligne du Journal et servent de reperes
// thematiques pour Google, meme avant publication des premiers articles.
const PILLARS = [
  { title: 'Le bois de Oud', text: 'Origines, récoltes et distillation d’une matière parmi les plus précieuses au monde.' },
  { title: 'La voie du Kōdō', text: 'L’art japonais d’écouter l’encens, entre silence, lenteur et attention.' },
  { title: 'Thés & cafés d’Asie', text: 'Les crus rares d’Extrême-Orient qui accompagnent nos dégustations.' },
]

export const generateMetadata = async () =>
  buildMetadata({ fallbackTitle: TITLE, fallbackDescription: DESCRIPTION, path: PATH })

export default async function JournalPage() {
  const payload = await getPayloadClient()
  const { docs: articles } = await payload.find({
    collection: 'articles',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    limit: 50,
  })

  const list = articles as Article[]

  const jsonLd = [
    webPageJsonLd({ path: PATH, name: TITLE, description: DESCRIPTION, type: 'CollectionPage' }),
    blogJsonLd({ path: PATH, name: TITLE, description: DESCRIPTION, articles: list }),
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
            <Link href="/">Accueil</Link> <span aria-hidden="true">·</span> Le Journal
          </nav>
          <p className="kicker mt-6">Carnet de la maison</p>
          <h1 className="mt-3">Le Journal</h1>
          <p className="editorial-lede">
            La connaissance se partage. Ici, nous racontons les matières, les traditions et les
            gestes qui font l’exception — pour que chaque parfum se comprenne autant qu’il se sent.
          </p>
        </div>
      </header>

      <div className="editorial-body">
        {list.length > 0 ? (
          <section aria-label="Articles du Journal">
            <ul className="journal-grid">
              {list.map((article) => (
                <li key={article.id}>
                  <article>
                    <Link href={`/journal/${article.slug}`} className="journal-card">
                      <h2 className="text-xl">{article.title}</h2>
                      {article.excerpt && (
                        <p className="mt-2 text-sm text-[color:var(--color-muted)]">{article.excerpt}</p>
                      )}
                      <span className="mt-4 text-xs tracking-[0.2em] uppercase text-[color:var(--color-accent)]">
                        Lire
                      </span>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <section aria-labelledby="lignes" className="editorial-section">
            <p className="kicker">Nos lignes éditoriales</p>
            <h2 id="lignes" className="mt-3">Les premiers récits arrivent</h2>
            <p>
              Le Journal s’écrit. En attendant nos premières publications, voici les thèmes que nous
              explorerons — avec la rigueur d’une maison qui connaît son sujet.
            </p>
            <ul className="journal-grid mt-10">
              {PILLARS.map((pillar) => (
                <li key={pillar.title} className="journal-card">
                  <h3 className="text-lg">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-[color:var(--color-muted)]">{pillar.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  )
}
