import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { getStripeClient } from '@/lib/stripe'

/**
 * Squelette du webhook Stripe. TODO (integration complete) :
 * 1. Verifier la signature (stripe.webhooks.constructEvent) avec STRIPE_WEBHOOK_SECRET.
 * 2. Sur `checkout.session.completed`, creer la commande via la Local API Payload
 *    (payload.create({ collection: 'orders', data: { ... } })).
 * 3. Decrementer le stock des variantes concernees.
 */
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Webhook Stripe non configure' }, { status: 501 })
  }

  const stripe = getStripeClient()
  const payload = await getPayloadClient()
  const body = await request.text()

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      await payload.create({
        collection: 'orders',
        data: {
          stripeCheckoutSessionId: session.id,
          customerEmail: session.customer_details?.email ?? undefined,
          total: (session.amount_total ?? 0) / 100,
          currency: session.currency ?? 'eur',
          status: 'paid',
          items: [],
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Signature webhook Stripe invalide', error)
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }
}
