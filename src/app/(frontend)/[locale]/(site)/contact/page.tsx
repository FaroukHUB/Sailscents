import { ContactForm } from '@/components/ContactForm'
import { StaticPageShell } from '@/components/StaticPageShell'
import { buildMetadata } from '@/lib/seo'

const PATH = '/contact'

export const generateMetadata = async () =>
  buildMetadata({
    fallbackTitle: 'Contact',
    fallbackDescription:
      'Une question sur nos parfums, une commande ou la boutique ? Écrivez-nous, nous vous répondons avec plaisir.',
    path: PATH,
  })

export default function ContactPage() {
  return (
    <StaticPageShell
      title="Contact"
      kicker="Nous écrire"
      intro="Une question sur nos parfums, une commande, ou les informations pratiques de la boutique ? Écrivez-nous — nous vous répondons avec soin."
    >
      <p>
        Nous prenons le temps de répondre à chacun : conseil sur une essence, suivi d’une commande,
        ou simple curiosité autour d’un bois de Oud ou d’une rose de collection.
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>
    </StaticPageShell>
  )
}
