'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { useCart } from '@/components/cart/CartProvider'
import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

const LABELS: Record<Locale, {
  title: string
  empty: string
  discover: string
  decrease: string
  increase: string
  remove: string
  total: string
  checkout: string
  stripeNote: string
}> = {
  fr: {
    title: 'Votre panier',
    empty: 'Votre panier est vide.',
    discover: 'Découvrir les parfums',
    decrease: 'Diminuer',
    increase: 'Augmenter',
    remove: 'Retirer',
    total: 'Total',
    checkout: 'Passer au paiement',
    stripeNote: 'Paiement sécurisé (Stripe) — en cours d’intégration.',
  },
  en: {
    title: 'Your cart',
    empty: 'Your cart is empty.',
    discover: 'Discover the perfumes',
    decrease: 'Decrease',
    increase: 'Increase',
    remove: 'Remove',
    total: 'Total',
    checkout: 'Proceed to checkout',
    stripeNote: 'Secure payment (Stripe) — integration in progress.',
  },
}

export default function CartPage() {
  const { lines, total, count, setQuantity, remove } = useCart()
  const params = useParams()
  const rawLocale = Array.isArray(params.locale) ? params.locale[0] : params.locale
  const locale = isLocale(rawLocale ?? '') ? (rawLocale as Locale) : defaultLocale
  const t = LABELS[locale]

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl">{t.title}</h1>

      {count === 0 ? (
        <div className="mt-8 text-[color:var(--color-muted)]">
          <p>{t.empty}</p>
          <Link href={`/${locale}/parfums`} className="btn-gold mt-6 inline-block">
            {t.discover}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8">
            {lines.map((line) => (
              <div key={`${line.productId}-${line.variantLabel}`} className="cart-line">
                {line.imageUrl ? (
                  <Image src={line.imageUrl} alt={line.productName} width={80} height={96} className="cart-line-img" />
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
                      aria-label={t.decrease}
                    >
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.productId, line.variantLabel, line.quantity + 1)}
                      aria-label={t.increase}
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
                    {t.remove}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <span className="text-sm uppercase tracking-[0.2em] text-[color:var(--color-muted)]">{t.total}</span>
            <span className="cart-total">{total} €</span>
          </div>

          <div className="mt-8 flex flex-col items-end gap-2">
            <button type="button" className="btn-gold" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              {t.checkout}
            </button>
            <p className="text-xs text-[color:var(--color-muted)]">{t.stripeNote}</p>
          </div>
        </>
      )}
    </section>
  )
}
