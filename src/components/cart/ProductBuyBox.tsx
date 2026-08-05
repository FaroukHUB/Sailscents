'use client'

import { useState } from 'react'

import { useCart } from '@/components/cart/CartProvider'

type Variant = {
  label: string
  price: number
  compareAtPrice?: number | null
  stock?: number | null
}

export type BuyBoxLabels = {
  size: string
  quantity: string
  decrease: string
  increase: string
  outOfStock: string
  added: string
  addToCart: string
}

type Props = {
  productId: number
  productSlug: string
  productName: string
  imageUrl?: string
  variants: Variant[]
  labels: BuyBoxLabels
}

export function ProductBuyBox({ productId, productSlug, productName, imageUrl, variants, labels }: Props) {
  const { add } = useCart()
  const [selected, setSelected] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const variant = variants[selected]
  const outOfStock = typeof variant?.stock === 'number' && variant.stock <= 0

  const handleAdd = () => {
    if (!variant || outOfStock) return
    add(
      { productId, productSlug, productName, variantLabel: variant.label, price: variant.price, imageUrl },
      quantity,
    )
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  return (
    <div className="buybox">
      {variants.length > 1 && (
        <div className="buybox-variants" role="group" aria-label={labels.size}>
          {variants.map((v, i) => (
            <button
              key={v.label}
              type="button"
              onClick={() => setSelected(i)}
              className={`buybox-variant${i === selected ? ' is-active' : ''}`}
              aria-pressed={i === selected}
            >
              <span>{v.label}</span>
              <span className="buybox-variant-price">{v.price} €</span>
            </button>
          ))}
        </div>
      )}

      <div className="buybox-price">
        <span className="buybox-price-amount">{variant?.price} €</span>
        {variant?.compareAtPrice ? <span className="buybox-price-compare">{variant.compareAtPrice} €</span> : null}
        {variants.length <= 1 && <span className="buybox-price-label">{variant?.label}</span>}
      </div>

      <div className="buybox-actions">
        <div className="buybox-qty" aria-label={labels.quantity}>
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label={labels.decrease}>
            −
          </button>
          <span>{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label={labels.increase}>
            +
          </button>
        </div>

        <button type="button" className="btn-gold buybox-add" onClick={handleAdd} disabled={outOfStock}>
          {outOfStock ? labels.outOfStock : added ? labels.added : labels.addToCart}
        </button>
      </div>
    </div>
  )
}
