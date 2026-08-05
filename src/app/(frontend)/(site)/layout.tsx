import Link from 'next/link'

import { CartLink } from '@/components/cart/CartLink'
import { CartProvider } from '@/components/cart/CartProvider'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants'

const NAV_LINKS = [
  { href: '/parfums', label: 'Les Parfums' },
  { href: '/encens', label: 'Les Encens' },
  { href: '/raretes', label: 'Les Raretés' },
  { href: '/nos-boutiques', label: 'Nos Boutiques' },
  { href: '/maison', label: 'À propos' },
]

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <CartProvider>
      <header className="border-b border-[color:var(--color-border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/" className="font-[family-name:var(--font-display)] text-xl tracking-[0.2em] uppercase">
            {SITE_NAME}
          </Link>
          <nav className="hidden gap-8 text-sm tracking-wide uppercase md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="opacity-80 transition-opacity hover:opacity-100">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <Link href="/" aria-label="Retour à l’accueil — toutes les portes" className="enso-home">
              <svg viewBox="0 0 24 24" width="27" height="27" aria-hidden="true">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="49 8"
                  transform="rotate(115 12 12)"
                />
              </svg>
            </Link>
            <CartLink />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[color:var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-[color:var(--color-muted)]">
          <p className="font-[family-name:var(--font-display)] text-base text-[color:var(--foreground)]">
            {SITE_NAME} — {SITE_TAGLINE}
          </p>
          <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/livraison-et-retours">Livraison & retours</Link>
            <Link href="/cgv">CGV</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <Link href="/mentions-legales">Mentions légales</Link>
          </nav>
          <p className="mt-6 opacity-60">© {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.</p>
        </div>
      </footer>
    </CartProvider>
  )
}
