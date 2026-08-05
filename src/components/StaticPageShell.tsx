import Link from 'next/link'

/**
 * Coquille commune aux pages de contenu « institutionnelles » (contact,
 * mentions légales, CGV, confidentialité, livraison & retours) : fil d'Ariane,
 * titre, puis le contenu dans la prose éditoriale.
 */
export function StaticPageShell({
  title,
  kicker,
  intro,
  children,
}: {
  title: string
  kicker?: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link> <span aria-hidden="true">·</span> {title}
      </nav>
      {kicker && <p className="kicker mt-6">{kicker}</p>}
      <h1 className="mt-3 text-4xl">{title}</h1>
      {intro && <p className="editorial-lede mt-4">{intro}</p>}
      <div className="editorial-prose mt-10">{children}</div>
    </section>
  )
}
