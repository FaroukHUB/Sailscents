'use client'

import Link from 'next/link'

import { useCart } from '@/components/cart/CartProvider'

/** Lien « Panier » du header, avec le compteur d'articles. */
export function CartLink({ href, label }: { href: string; label: string }) {
  const { count } = useCart()
  return (
    <Link href={href} className="text-sm tracking-wide uppercase opacity-80 hover:opacity-100">
      {label}
      {count > 0 && <span className="cart-count">{count}</span>}
    </Link>
  )
}
