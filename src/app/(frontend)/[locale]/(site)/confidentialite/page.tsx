import { StaticPageShell } from '@/components/StaticPageShell'
import { buildMetadata } from '@/lib/seo'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

const PATH = '/confidentialite'

type Section = { h2: string; body?: string[]; list?: string[] }

const CONTENT: Record<Locale, {
  metaTitle: string
  metaDescription: string
  kicker: string
  title: string
  intro: string
  sections: Section[]
}> = {
  fr: {
    metaTitle: 'Politique de confidentialité',
    metaDescription: 'Comment Sailscents collecte, utilise et protège vos données personnelles, et comment exercer vos droits.',
    kicker: 'Vos données',
    title: 'Politique de confidentialité',
    intro: 'Nous attachons une grande importance à la protection de vos données personnelles. Ce document, à faire valider par l’éditeur avant mise en ligne, en résume les principes.',
    sections: [
      { h2: 'Données que nous collectons', body: ['Selon votre usage du site, nous pouvons traiter : vos coordonnées (nom, adresse e-mail, adresse de livraison), les informations liées à vos commandes, et des données techniques de navigation (via des cookies, voir plus bas).'] },
      { h2: 'Finalités et base légale', list: ['Traiter et livrer vos commandes (exécution du contrat).', 'Répondre à vos demandes de contact (intérêt légitime).', 'Vous informer, avec votre consentement, de nos actualités.', 'Respecter nos obligations légales et comptables.'] },
      { h2: 'Durée de conservation', body: ['Vos données sont conservées le temps nécessaire aux finalités ci-dessus, puis archivées ou supprimées conformément aux durées légales applicables.'] },
      { h2: 'Vos droits', body: ['Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité de vos données. Pour les exercer, écrivez-nous à [adresse e-mail à compléter]. Vous pouvez également saisir la CNIL.'] },
      { h2: 'Cookies', body: ['Le site peut utiliser des cookies nécessaires à son bon fonctionnement et, le cas échéant, des cookies de mesure d’audience. Vous pouvez configurer votre navigateur pour les refuser.'] },
    ],
  },
  en: {
    metaTitle: 'Privacy policy',
    metaDescription: 'How Sailscents collects, uses and protects your personal data, and how to exercise your rights.',
    kicker: 'Your data',
    title: 'Privacy policy',
    intro: 'We place great importance on protecting your personal data. This document, to be validated by the publisher before publication, summarises its principles.',
    sections: [
      { h2: 'Data we collect', body: ['Depending on your use of the site, we may process: your contact details (name, email address, delivery address), information related to your orders, and technical browsing data (via cookies, see below).'] },
      { h2: 'Purposes and legal basis', list: ['Processing and delivering your orders (performance of the contract).', 'Responding to your contact requests (legitimate interest).', 'Informing you, with your consent, of our news.', 'Complying with our legal and accounting obligations.'] },
      { h2: 'Retention period', body: ['Your data is kept for as long as necessary for the purposes above, then archived or deleted in accordance with the applicable legal periods.'] },
      { h2: 'Your rights', body: ['In accordance with the GDPR, you have the right to access, rectify, erase, restrict, object to and port your data. To exercise them, write to us at [email to be completed]. You may also contact the relevant data protection authority.'] },
      { h2: 'Cookies', body: ['The site may use cookies necessary for its proper functioning and, where applicable, audience-measurement cookies. You can configure your browser to refuse them.'] },
    ],
  },
}

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const t = CONTENT[loc]
  return buildMetadata({ fallbackTitle: t.metaTitle, fallbackDescription: t.metaDescription, path: PATH, locale: loc })
}

export default async function ConfidentialitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const t = CONTENT[isLocale(raw) ? raw : defaultLocale]

  return (
    <StaticPageShell title={t.title} kicker={t.kicker} intro={t.intro}>
      {t.sections.map((section) => (
        <section key={section.h2}>
          <h2>{section.h2}</h2>
          {section.body?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.list && (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </StaticPageShell>
  )
}
