import { StaticPageShell } from '@/components/StaticPageShell'
import { buildMetadata } from '@/lib/seo'

const PATH = '/mentions-legales'

export const generateMetadata = async () =>
  buildMetadata({
    fallbackTitle: 'Mentions légales',
    fallbackDescription: 'Informations légales du site Sailscents : éditeur, hébergeur et propriété intellectuelle.',
    path: PATH,
  })

export default function MentionsLegalesPage() {
  return (
    <StaticPageShell title="Mentions légales" kicker="Informations légales">
      <p>
        Les mentions ci-dessous doivent être complétées par les informations officielles de la
        société éditrice avant la mise en ligne définitive. Les champs entre crochets{' '}
        <em>[à compléter]</em> sont à renseigner par l’éditeur.
      </p>

      <h2>Éditeur du site</h2>
      <ul>
        <li>Raison sociale : <em>[à compléter]</em></li>
        <li>Forme juridique et capital social : <em>[à compléter]</em></li>
        <li>Siège social : <em>[à compléter]</em></li>
        <li>Immatriculation (RCS / SIREN) : <em>[à compléter]</em></li>
        <li>Numéro de TVA intracommunautaire : <em>[à compléter]</em></li>
        <li>Directeur de la publication : <em>[à compléter]</em></li>
        <li>Contact : <em>[adresse e-mail à compléter]</em></li>
      </ul>

      <h2>Hébergeur</h2>
      <p>
        Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis —
        <a href="https://vercel.com" className="text-[color:var(--color-accent)] underline"> vercel.com</a>.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L’ensemble des contenus présents sur ce site (textes, visuels, identité graphique, logos)
        est protégé par le droit de la propriété intellectuelle. Toute reproduction ou représentation,
        totale ou partielle, sans autorisation écrite préalable de l’éditeur, est interdite.
      </p>

      <h2>Responsabilité</h2>
      <p>
        L’éditeur s’efforce d’assurer l’exactitude des informations diffusées sur ce site, sans
        toutefois pouvoir en garantir l’exhaustivité. Les informations sont susceptibles d’évoluer.
      </p>
    </StaticPageShell>
  )
}
