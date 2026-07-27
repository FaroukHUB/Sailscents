'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CartLine = {
  productId: number
  productSlug: string
  productName: string
  variantLabel: string
  price: number
  quantity: number
  imageUrl?: string
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  total: number
  add: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void
  setQuantity: (productId: number, variantLabel: string, quantity: number) => void
  remove: (productId: number, variantLabel: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'sailscents-cart-v1'

const keyOf = (line: Pick<CartLine, 'productId' | 'variantLabel'>) => `${line.productId}::${line.variantLabel}`

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Chargement depuis le stockage local au montage.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setLines(JSON.parse(raw) as CartLine[])
    } catch {
      /* stockage indisponible : panier vide */
    }
    setHydrated(true)
  }, [])

  // Persistance a chaque changement (apres hydratation, pour ne pas ecraser).
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* stockage indisponible */
    }
  }, [lines, hydrated])

  const add = useCallback<CartContextValue['add']>((line, quantity = 1) => {
    setLines((prev) => {
      const idx = prev.findIndex((l) => keyOf(l) === keyOf(line))
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }
        return next
      }
      return [...prev, { ...line, quantity }]
    })
  }, [])

  const setQuantity = useCallback<CartContextValue['setQuantity']>((productId, variantLabel, quantity) => {
    setLines((prev) =>
      prev
        .map((l) => (keyOf(l) === `${productId}::${variantLabel}` ? { ...l, quantity } : l))
        .filter((l) => l.quantity > 0),
    )
  }, [])

  const remove = useCallback<CartContextValue['remove']>((productId, variantLabel) => {
    setLines((prev) => prev.filter((l) => keyOf(l) !== `${productId}::${variantLabel}`))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.quantity, 0)
    const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
    return { lines, count, total, add, setQuantity, remove, clear }
  }, [lines, add, setQuantity, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit etre utilise sous CartProvider')
  return ctx
}
