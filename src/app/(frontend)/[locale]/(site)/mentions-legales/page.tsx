import { StaticPageShell } from '@/components/StaticPageShell'
import { buildMetadata } from '@/lib/seo'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

const PATH = '/mentions-legales'

const CONTENT: Record<Locale, {
  metaTitle: string
  metaDescription: string
  kicker: string
  title: string
  intro: string
  editeurH2: string
  editeur: string[]
  hebergeurH2: string
  hebergeur: string
  piH2: string
  pi: string
  respH2: string
  resp: string
}> = {
  fr: {
    metaTitle: 'Mentions légales',
    metaDescription: 'Informations légales du site Sailscents : éditeur, hébergeur et propriété intellectuelle.',
    kicker: 'Informations légales',
    title: 'Mentions légales',
    intro: 'Les mentions ci-dessous doivent être complétées par les informations officielles de la société éditrice avant la mise en ligne définitive. Les champs entre crochets [à compléter] sont à renseigner par l’éditeur.',
    editeurH2: 'Éditeur du site',
    editeur: [
      'Raison sociale : [à compléter]',
      'Forme juridique et capital social : [à compléter]',
      'Siège social : [à compléter]',
      'Immatriculation (RCS / SIREN) : [à compléter]',
      'Numéro de TVA intracommunautaire : [à compléter]',
      'Directeur de la publication : [à compléter]',
      'Contact : [adresse e-mail à compléter]',
    ],
    hebergeurH2: 'Hébergeur',
    hebergeur: 'Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis (vercel.com).',
    piH2: 'Propriété intellectuelle',
    pi: 'L’ensemble des contenus présents sur ce site (textes, visuels, identité graphique, logos) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable de l’éditeur, est interdite.',
    respH2: 'Responsabilité',
    resp: 'L’éditeur s’efforce d’assurer l’exactitude des informations diffusées sur ce site, sans toutefois pouvoir en garantir l’exhaustivité. Les informations sont susceptibles d’évoluer.',
  },
  en: {
    metaTitle: 'Legal notice',
    metaDescription: 'Legal information for the Sailscents site: publisher, host and intellectual property.',
    kicker: 'Legal information',
    title: 'Legal notice',
    intro: 'The details below must be completed with the publishing company’s official information before final publication. The fields in brackets [to be completed] are to be filled in by the publisher.',
    editeurH2: 'Site publisher',
    editeur: [
      'Company name: [to be completed]',
      'Legal form and share capital: [to be completed]',
      'Registered office: [to be completed]',
      'Registration (trade register / company number): [to be completed]',
      'VAT number: [to be completed]',
      'Publication director: [to be completed]',
      'Contact: [email to be completed]',
    ],
    hebergeurH2: 'Host',
    hebergeur: 'The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA (vercel.com).',
    piH2: 'Intellectual property',
    pi: 'All content on this site (texts, visuals, graphic identity, logos) is protected by intellectual property law. Any reproduction or representation, in whole or in part, without the publisher’s prior written authorisation, is prohibited.',
    respH2: 'Liability',
    resp: 'The publisher strives to ensure the accuracy of the information provided on this site, without being able to guarantee its completeness. Information is subject to change.',
  },
}

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const t = CONTENT[loc]
  return buildMetadata({ fallbackTitle: t.metaTitle, fallbackDescription: t.metaDescription, path: PATH, locale: loc })
}

export default async function MentionsLegalesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const t = CONTENT[isLocale(raw) ? raw : defaultLocale]

  return (
    <StaticPageShell title={t.title} kicker={t.kicker}>
      <p>{t.intro}</p>
      <h2>{t.editeurH2}</h2>
      <ul>
        {t.editeur.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <h2>{t.hebergeurH2}</h2>
      <p>{t.hebergeur}</p>
      <h2>{t.piH2}</h2>
      <p>{t.pi}</p>
      <h2>{t.respH2}</h2>
      <p>{t.resp}</p>
    </StaticPageShell>
  )
}
