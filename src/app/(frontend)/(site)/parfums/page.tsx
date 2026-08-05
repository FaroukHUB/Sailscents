import Image from 'next/image'
import Link from 'next/link'

import { EditorialFigure } from '@/components/EditorialFigure'
import { HeroImage } from '@/components/HeroImage'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { getSectionImage } from '@/lib/sectionImage'
import { breadcrumbJsonLd, faqPageJsonLd, webPageJsonLd } from '@/lib/structured-data'
import type { Category, Media, Product } from '@/types/content'

// Image principale du produit (si renseignée dans l'admin), sinon null.
const productImage = (product: Product) => {
  const m = product.mainImage
  return m && typeof m === 'object' ? (m as Media) : null
}

// Prix d'appel : la variante la moins chère (« à partir de … »).
const fromPrice = (product: Product) => {
  const prices = (product.variants ?? [])
    .map((v) => v.price)
    .filter((n): n is number => typeof n === 'number')
  return prices.length ? Math.min(...prices) : null
}

// Récupère les produits publiés, groupés par univers (catégorie), dans l'ordre
// des catégories. Alimente la partie « boutique » de la page Les Parfums.
const getCatalogue = async () => {
  const payload = await getPayloadClient()
  const [{ docs: categories }, { docs: products }] = await Promise.all([
    payload.find({ collection: 'categories', limit: 50, sort: 'name' }),
    payload.find({ collection: 'products', where: { status: { equals: 'published' } }, limit: 200, depth: 1 }),
  ])

  return (categories as Category[])
    .map((category) => ({
      category,
      items: (products as Product[]).filter((p) => {
        const catId = typeof p.category === 'object' && p.category ? p.category.id : p.category
        return catId === category.id
      }),
    }))
    .filter((group) => group.items.length > 0)
}

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

export default async function ParfumsPage() {
  const hero = await getSectionImage('boutiquePanel')
  const catalogue = await getCatalogue()

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

      <header
        className="editorial-hero"
        style={hero?.width && hero?.height ? { aspectRatio: `${hero.width} / ${hero.height}` } : undefined}
      >
        {hero && <HeroImage url={hero.url} alt={hero.alt} />}
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
        {catalogue.length > 0 && (
          <section className="editorial-section" aria-labelledby="acheter">
            <p className="kicker">La sélection</p>
            <h2 id="acheter" className="mt-3">Nos huiles à découvrir et commander</h2>
            <p className="editorial-lede">
              Des huiles rares, disponibles à la vente en ligne. Choisissez votre contenance sur la
              fiche de chaque parfum.
            </p>

            {catalogue.map(({ category, items }) => (
              <div key={category.id} className="mt-12">
                <p className="kicker">{category.name}</p>
                <div className="mt-4 flex flex-col gap-5">
                  {items.map((product) => {
                    const price = fromPrice(product)
                    const image = productImage(product)
                    return (
                      <Link
                        key={product.id}
                        href={`/boutique/${category.slug}/${product.slug}`}
                        className="product-row"
                      >
                        <span className={`product-row__media${image ? ' has-image' : ''}`}>
                          {image?.url && (
                            <Image
                              src={image.url}
                              alt={image.alt ?? product.name}
                              fill
                              sizes="(min-width: 640px) 18rem, 100vw"
                              className="product-row__img"
                            />
                          )}
                        </span>
                        <span className="product-row__body">
                          <span className="product-row__name">{product.name}</span>
                          {product.shortDescription && (
                            <span className="product-row__desc">{product.shortDescription}</span>
                          )}
                          <span className="product-row__meta">
                            {price != null && <span className="product-row__price">à partir de {price} €</span>}
                            <span className="product-row__cta">Découvrir la fiche →</span>
                          </span>
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>
        )}

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
