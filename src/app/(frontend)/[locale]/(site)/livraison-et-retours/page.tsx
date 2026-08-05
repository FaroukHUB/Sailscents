import Link from 'next/link'

import { StaticPageShell } from '@/components/StaticPageShell'
import { buildMetadata } from '@/lib/seo'

const PATH = '/livraison-et-retours'

export const generateMetadata = async () =>
  buildMetadata({
    fallbackTitle: 'Livraison & retours',
    fallbackDescription:
      'Modalités d’expédition, délais, frais, suivi, ainsi que les conditions de retour et de remboursement.',
    path: PATH,
  })

export default function LivraisonRetoursPage() {
  return (
    <StaticPageShell
      title="Livraison & retours"
      kicker="Commander en confiance"
      intro="Nos essences sont préparées et emballées avec soin. Voici comment se déroulent l’expédition et, si besoin, le retour de votre commande."
    >
      <h2>Préparation & expédition</h2>
      <p>
        Chaque commande est préparée à la main. Le délai de préparation et les transporteurs proposés
        sont précisés lors de la commande. <em>[Délais et zones de livraison à compléter par l’éditeur.]</em>
      </p>

      <h2>Frais & délais</h2>
      <p>
        Les frais de livraison et les délais estimés sont indiqués au moment du paiement, selon la
        destination et le mode d’expédition choisi. <em>[Grille de frais à compléter.]</em>
      </p>

      <h2>Suivi</h2>
      <p>
        Dès l’expédition, un e-mail de confirmation vous est adressé ; lorsque le transporteur le
        permet, il contient un numéro de suivi.
      </p>

      <h2>Retours & rétractation</h2>
      <p>
        Conformément à la réglementation, vous disposez d’un délai de quatorze (14) jours pour exercer
        votre droit de rétractation à compter de la réception, dans les conditions prévues par la loi.
        Certains produits, pour des raisons d’hygiène, peuvent en être exclus une fois descellés —
        <em> [préciser les exclusions éventuelles]</em>.
      </p>

      <h2>Remboursement</h2>
      <p>
        Après réception et vérification du retour, le remboursement est effectué par le même moyen de
        paiement que celui utilisé lors de la commande, dans les délais légaux.
      </p>

      <p>
        Une question ? Consultez notre <Link href="/faq" className="text-[color:var(--color-accent)] underline">FAQ</Link>{' '}
        ou <Link href="/contact" className="text-[color:var(--color-accent)] underline">écrivez-nous</Link>.
      </p>
    </StaticPageShell>
  )
}
