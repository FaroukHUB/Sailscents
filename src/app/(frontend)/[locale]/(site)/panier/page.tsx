'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useCart } from '@/components/cart/CartProvider'

export default function CartPage() {
  const { lines, total, count, setQuantity, remove } = useCart()

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl">Votre panier</h1>

      {count === 0 ? (
        <div className="mt-8 text-[color:var(--color-muted)]">
          <p>Votre panier est vide.</p>
          <Link href="/parfums" className="btn-gold mt-6 inline-block">
            Découvrir les parfums
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8">
            {lines.map((line) => (
              <div key={`${line.productId}-${line.variantLabel}`} className="cart-line">
                {line.imageUrl ? (
                  <Image
                    src={line.imageUrl}
                    alt={line.productName}
                    width={80}
                    height={96}
                    className="cart-line-img"
                  />
                ) : (
                  <span className="cart-line-img" aria-hidden="true" />
                )}
                <div className="cart-line-body">
                  <p className="text-lg">{line.productName}</p>
                  <p className="text-sm text-[color:var(--color-muted)]">{line.variantLabel}</p>
                  <div className="buybox-qty mt-3" style={{ width: 'fit-content' }}>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.productId, line.variantLabel, line.quantity - 1)}
                      aria-label="Diminuer"
                    >
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.productId, line.variantLabel, line.quantity + 1)}
                      aria-label="Augmenter"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p>{line.price * line.quantity} €</p>
                  <button
                    type="button"
                    onClick={() => remove(line.productId, line.variantLabel)}
                    className="mt-2 text-xs uppercase tracking-wide text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)]"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <span className="text-sm uppercase tracking-[0.2em] text-[color:var(--color-muted)]">Total</span>
            <span className="cart-total">{total} €</span>
          </div>

          <div className="mt-8 flex flex-col items-end gap-2">
            <button type="button" className="btn-gold" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              Passer au paiement
            </button>
            <p className="text-xs text-[color:var(--color-muted)]">
              Paiement sécurisé (Stripe) — en cours d’intégration.
            </p>
          </div>
        </>
      )}
    </section>
  )
}
