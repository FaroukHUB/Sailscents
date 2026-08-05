import Link from 'next/link'

import { StaticPageShell } from '@/components/StaticPageShell'
import { buildMetadata } from '@/lib/seo'

const PATH = '/cgv'

export const generateMetadata = async () =>
  buildMetadata({
    fallbackTitle: 'Conditions générales de vente',
    fallbackDescription:
      'Les conditions générales de vente applicables aux commandes passées sur le site Sailscents.',
    path: PATH,
  })

export default function CgvPage() {
  return (
    <StaticPageShell
      title="Conditions générales de vente"
      kicker="CGV"
      intro="Les présentes conditions encadrent les ventes réalisées sur le site. Elles constituent un modèle à faire valider par l’éditeur avant la mise en ligne définitive."
    >
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales de vente (CGV) régissent les relations entre l’éditeur du
        site et toute personne effectuant un achat sur le site.
      </p>

      <h2>2. Produits</h2>
      <p>
        Les produits proposés sont décrits avec la plus grande exactitude possible. Les matières
        naturelles pouvant présenter de légères variations, les visuels et descriptions n’ont pas de
        valeur contractuelle absolue.
      </p>

      <h2>3. Prix</h2>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises, hors frais de livraison précisés
        avant la validation de la commande. L’éditeur se réserve le droit de modifier ses prix à tout
        moment, les produits étant facturés sur la base des tarifs en vigueur au moment de la commande.
      </p>

      <h2>4. Commande</h2>
      <p>
        La commande est validée après acceptation des présentes CGV et confirmation du paiement. Un
        e-mail de confirmation récapitule les éléments de la commande.
      </p>

      <h2>5. Paiement</h2>
      <p>
        Le paiement s’effectue en ligne par les moyens proposés lors de la commande. La commande est
        traitée après confirmation du paiement. <em>[Prestataire de paiement à préciser.]</em>
      </p>

      <h2>6. Livraison</h2>
      <p>
        Les modalités, délais et frais de livraison sont détaillés sur la page{' '}
        <Link href="/livraison-et-retours" className="text-[color:var(--color-accent)] underline">Livraison &amp; retours</Link>.
      </p>

      <h2>7. Droit de rétractation</h2>
      <p>
        Vous disposez d’un délai de quatorze (14) jours pour exercer votre droit de rétractation dans
        les conditions prévues par la loi et rappelées sur la page Livraison &amp; retours, sous
        réserve des exclusions légales.
      </p>

      <h2>8. Garanties</h2>
      <p>
        Les produits bénéficient des garanties légales de conformité et contre les vices cachés, dans
        les conditions prévues par la loi.
      </p>

      <h2>9. Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans notre{' '}
        <Link href="/confidentialite" className="text-[color:var(--color-accent)] underline">politique de confidentialité</Link>.
      </p>

      <h2>10. Droit applicable</h2>
      <p>
        Les présentes CGV sont soumises au droit applicable au siège de l’éditeur. En cas de litige,
        une solution amiable sera recherchée avant toute action contentieuse.
      </p>
    </StaticPageShell>
  )
}
