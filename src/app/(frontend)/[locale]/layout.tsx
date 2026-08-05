import type { Metadata } from 'next'
import { Jost, Shippori_Mincho } from 'next/font/google'
import { notFound } from 'next/navigation'

import { RitualTransitionProvider } from '@/components/RitualTransition'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/constants'
import { organizationJsonLd } from '@/lib/structured-data'
import { locales, isLocale, localeDir, defaultLocale } from '@/i18n/config'

import '../globals.css'

// Shippori Mincho : un mincho japonais traditionnel qui porte l'esprit du Kōdō
// tout en gardant un alphabet latin lisible.
const shippori = Shippori_Mincho({
  variable: '--font-shippori',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dir = localeDir[isLocale(locale) ? locale : defaultLocale]

  return (
    <html lang={locale} dir={dir} className={`${shippori.variable} ${jost.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <RitualTransitionProvider>{children}</RitualTransitionProvider>
      </body>
    </html>
  )
}
