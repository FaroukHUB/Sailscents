import { NextResponse } from 'next/server'

import { getStripeClient } from '@/lib/stripe'

/**
 * Squelette de creation de session Stripe Checkout.
 * TODO (integration complete) : recevoir le panier (variantes + quantites),
 * verifier les prix/stocks cote serveur via Payload avant de construire
 * les line_items, puis rediriger vers `session.url`.
 */
export async function POST(request: Request) {
  try {
    const stripe = getStripeClient()
    const { items } = (await request.json()) as {
      items?: Array<{ priceInCents: number; name: string; quantity: number }>
    }

    if (!items?.length) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: item.priceInCents,
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/panier`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erreur creation session Stripe Checkout', error)
    return NextResponse.json({ error: 'Impossible de creer la session de paiement' }, { status: 500 })
  }
}
