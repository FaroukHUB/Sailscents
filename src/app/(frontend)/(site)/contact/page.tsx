import { StaticPageShell } from '@/components/StaticPageShell'
import { buildMetadata } from '@/lib/seo'

const PATH = '/contact'

// Adresse de contact : définie par la variable d'environnement (aucune adresse
// n'est inventée). Tant qu'elle n'est pas renseignée, on invite simplement à
// revenir — les coordonnées seront ajoutées ensuite.
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim()

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

      {CONTACT_EMAIL ? (
        <p>
          Écrivez-nous directement à{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[color:var(--color-accent)] underline">
            {CONTACT_EMAIL}
          </a>{' '}
          — nous vous répondons sous les meilleurs délais.
        </p>
      ) : (
        <p>
          Notre adresse de contact sera indiquée ici très prochainement. En attendant, retrouvez nos
          parfums dans la boutique en ligne, et les informations de notre boutique physique sur la
          page <a href="/nos-boutiques" className="text-[color:var(--color-accent)] underline">Nos Boutiques</a>.
        </p>
      )}

      <h2>Ce sur quoi nous pouvons vous aider</h2>
      <ul>
        <li>Un conseil pour choisir une essence selon vos goûts.</li>
        <li>Le suivi d’une commande ou une question sur la livraison.</li>
        <li>Les informations pratiques de la boutique (adresse, accès, horaires).</li>
        <li>Toute question sur l’origine et la fabrication de nos matières.</li>
      </ul>
    </StaticPageShell>
  )
}
