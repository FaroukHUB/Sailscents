import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'

import { RitualTransitionProvider } from '@/components/RitualTransition'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/constants'

import './globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
    <html lang="fr" className={`${cormorant.variable} ${jost.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <RitualTransitionProvider>{children}</RitualTransitionProvider>
      </body>
    </html>
  )
}
