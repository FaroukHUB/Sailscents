import type { Metadata } from 'next'
import { Jost, Shippori_Mincho } from 'next/font/google'

import { RitualTransitionProvider } from '@/components/RitualTransition'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/constants'
import { organizationJsonLd } from '@/lib/structured-data'

import './globals.css'

// Shippori Mincho : un mincho japonais traditionnel (l'equivalent du serif dans
// l'imprimerie ancienne du Japon) qui porte l'esprit du Kodo tout en gardant un
// alphabet latin lisible pour un site francais.
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${shippori.variable} ${jost.variable} h-full`}>
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
