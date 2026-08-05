import Image from 'next/image'
import Link from 'next/link'

import { CartLink } from '@/components/cart/CartLink'
import { CartProvider } from '@/components/cart/CartProvider'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { SITE_NAME } from '@/lib/constants'
import { getLogo } from '@/lib/getLogo'
import { getDictionary } from '@/i18n'
import { defaultLocale, isLocale } from '@/i18n/config'

export default async function SiteLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const dict = getDictionary(locale)
  const p = (path: string) => `/${locale}${path}`
  const logo = await getLogo()

  const navLinks = [
    { href: p('/parfums'), label: dict.nav.parfums },
    { href: p('/encens'), label: dict.nav.encens },
    { href: p('/raretes'), label: dict.nav.raretes },
    { href: p('/nos-boutiques'), label: dict.nav.nosBoutiques },
    { href: p('/maison'), label: dict.nav.apropos },
  ]

  const footerLinks = [
    { href: p('/faq'), label: dict.footer.faq },
    { href: p('/contact'), label: dict.footer.contact },
    { href: p('/livraison-et-retours'), label: dict.footer.livraison },
    { href: p('/cgv'), label: dict.footer.cgv },
    { href: p('/confidentialite'), label: dict.footer.confidentialite },
    { href: p('/mentions-legales'), label: dict.footer.mentions },
  ]

  return (
    <CartProvider>
      <header className="border-b border-[color:var(--color-border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link href={p('')} aria-label={SITE_NAME} className="site-logo">
            {logo ? (
              <Image
                src={logo.url}
                alt={SITE_NAME}
                width={logo.width}
                height={logo.height}
                className="site-logo__img"
                priority
              />
            ) : (
              <span className="font-[family-name:var(--font-display)] text-xl tracking-[0.2em] uppercase">
                {SITE_NAME}
              </span>
            )}
          </Link>
          <nav className="hidden gap-8 text-sm tracking-wide uppercase md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="opacity-80 transition-opacity hover:opacity-100">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 md:gap-5">
            <LanguageSwitcher locale={locale} label={dict.header.switchLanguage} />
            <Link href={p('')} aria-label={dict.header.home} className="enso-home">
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
            <CartLink href={p('/panier')} label={dict.header.cart} />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[color:var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-[color:var(--color-muted)]">
          <p className="font-[family-name:var(--font-display)] text-base text-[color:var(--foreground)]">
            {SITE_NAME} — {dict.tagline}
          </p>
          <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-6 opacity-60">
            © {new Date().getFullYear()} {SITE_NAME}. {dict.footer.rights}
          </p>
        </div>
      </footer>
    </CartProvider>
  )
}
