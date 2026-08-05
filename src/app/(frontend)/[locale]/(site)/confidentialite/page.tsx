import { StaticPageShell } from '@/components/StaticPageShell'
import { buildMetadata } from '@/lib/seo'

const PATH = '/confidentialite'

export const generateMetadata = async () =>
  buildMetadata({
    fallbackTitle: 'Politique de confidentialité',
    fallbackDescription:
      'Comment Sailscents collecte, utilise et protège vos données personnelles, et comment exercer vos droits.',
    path: PATH,
  })

export default function ConfidentialitePage() {
  return (
    <StaticPageShell
      title="Politique de confidentialité"
      kicker="Vos données"
      intro="Nous attachons une grande importance à la protection de vos données personnelles. Ce document, à faire valider par l’éditeur avant mise en ligne, en résume les principes."
    >
      <h2>Données que nous collectons</h2>
      <p>
        Selon votre usage du site, nous pouvons traiter : vos coordonnées (nom, adresse e-mail,
        adresse de livraison), les informations liées à vos commandes, et des données techniques de
        navigation (via des cookies, voir plus bas).
      </p>

      <h2>Finalités et base légale</h2>
      <ul>
        <li>Traiter et livrer vos commandes (exécution du contrat).</li>
        <li>Répondre à vos demandes de contact (intérêt légitime).</li>
        <li>Vous informer, avec votre consentement, de nos actualités.</li>
        <li>Respecter nos obligations légales et comptables.</li>
      </ul>

      <h2>Durée de conservation</h2>
      <p>
        Vos données sont conservées le temps nécessaire aux finalités ci-dessus, puis archivées ou
        supprimées conformément aux durées légales applicables.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement, de
        limitation, d’opposition et de portabilité de vos données. Pour les exercer, écrivez-nous à
        <em> [adresse e-mail à compléter]</em>. Vous pouvez également saisir la CNIL.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site peut utiliser des cookies nécessaires à son bon fonctionnement et, le cas échéant,
        des cookies de mesure d’audience. Vous pouvez configurer votre navigateur pour les refuser.
      </p>
    </StaticPageShell>
  )
}
