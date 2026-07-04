import Link from 'next/link'

import { SITE_DESCRIPTION, SITE_TAGLINE } from '@/lib/constants'

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-32 text-center">
      <p className="text-xs tracking-[0.3em] text-[color:var(--color-accent)] uppercase">Maison sensorielle</p>
      <h1 className="text-5xl md:text-6xl">{SITE_TAGLINE}</h1>
      <p className="max-w-xl text-[color:var(--color-muted)]">{SITE_DESCRIPTION}</p>
      <Link
        href="/boutique"
        className="mt-4 border border-[color:var(--color-accent)] px-8 py-3 text-sm tracking-widest uppercase text-[color:var(--color-accent)] transition-colors hover:bg-[color:var(--color-accent)] hover:text-[color:var(--background)]"
      >
        Découvrir la boutique
      </Link>
    </section>
  )
}
