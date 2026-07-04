import Stripe from 'stripe'

/**
 * Client Stripe partage. La cle secrete n'est requise qu'au moment de
 * l'appel (checkout, webhook) — son absence ne doit pas empecher le
 * reste du site (catalogue, contenu) de fonctionner.
 */
export const getStripeClient = (): Stripe => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY manquant — configurez les variables Stripe avant de tester le paiement.')
  }
  return new Stripe(secretKey)
}
