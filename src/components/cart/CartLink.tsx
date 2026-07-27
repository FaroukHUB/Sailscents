'use client'

import Link from 'next/link'

import { useCart } from '@/components/cart/CartProvider'

/** Lien « Panier » du header, avec le compteur d'articles. */
export function CartLink() {
  const { count } = useCart()
  return (
    <Link href="/panier" className="text-sm tracking-wide uppercase opacity-80 hover:opacity-100">
      Panier{count > 0 && <span className="cart-count">{count}</span>}
    </Link>
  )
}
