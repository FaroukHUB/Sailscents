import { ContactForm, type ContactLabels } from '@/components/ContactForm'
import { StaticPageShell } from '@/components/StaticPageShell'
import { buildMetadata } from '@/lib/seo'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

const PATH = '/contact'

const CONTENT: Record<Locale, {
  metaTitle: string
  metaDescription: string
  kicker: string
  title: string
  intro: string
  body: string
  form: ContactLabels
}> = {
  fr: {
    metaTitle: 'Contact',
    metaDescription:
      'Une question sur nos parfums, une commande ou la boutique ? Écrivez-nous, nous vous répondons avec plaisir.',
    kicker: 'Nous écrire',
    title: 'Contact',
    intro:
      'Une question sur nos parfums, une commande, ou les informations pratiques de la boutique ? Écrivez-nous — nous vous répondons avec soin.',
    body: 'Nous prenons le temps de répondre à chacun : conseil sur une essence, suivi d’une commande, ou simple curiosité autour d’un bois de Oud ou d’une rose de collection.',
    form: {
      name: 'Nom',
      email: 'E-mail',
      subject: 'Sujet (facultatif)',
      message: 'Message',
      send: 'Envoyer le message',
      sending: 'Envoi…',
      sentTitle: 'Merci, votre message est parti.',
      sentBody: 'Nous vous répondons dès que possible, à l’adresse que vous avez indiquée.',
      hp: 'Ne pas remplir',
      errors: {
        missing_fields: 'Merci de renseigner votre nom, votre e-mail et votre message.',
        invalid_email: 'Cette adresse e-mail ne semble pas valide.',
        contact_not_configured: 'Le formulaire n’est pas encore actif. Réessayez un peu plus tard — nous mettons cela en place.',
        send_failed: 'L’envoi a échoué. Merci de réessayer dans un instant.',
        default: 'Une erreur est survenue. Merci de réessayer.',
      },
    },
  },
  en: {
    metaTitle: 'Contact',
    metaDescription:
      'A question about our perfumes, an order or the boutique? Write to us, we reply with pleasure.',
    kicker: 'Write to us',
    title: 'Contact',
    intro:
      'A question about our perfumes, an order, or the boutique’s practical details? Write to us — we answer with care.',
    body: 'We take the time to reply to everyone: advice on an essence, follow-up on an order, or simple curiosity about an Oud wood or a collection rose.',
    form: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject (optional)',
      message: 'Message',
      send: 'Send message',
      sending: 'Sending…',
      sentTitle: 'Thank you, your message is on its way.',
      sentBody: 'We will reply as soon as possible, to the address you provided.',
      hp: 'Do not fill in',
      errors: {
        missing_fields: 'Please provide your name, email and message.',
        invalid_email: 'This email address does not look valid.',
        contact_not_configured: 'The form is not active yet. Please try again a little later — we are setting it up.',
        send_failed: 'Sending failed. Please try again in a moment.',
        default: 'An error occurred. Please try again.',
      },
    },
  },
}

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : defaultLocale
  const t = CONTENT[loc]
  return buildMetadata({ fallbackTitle: t.metaTitle, fallbackDescription: t.metaDescription, path: PATH, locale: loc })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = CONTENT[locale]

  return (
    <StaticPageShell title={t.title} kicker={t.kicker} intro={t.intro}>
      <p>{t.body}</p>
      <div className="mt-8">
        <ContactForm labels={t.form} />
      </div>
    </StaticPageShell>
  )
}
