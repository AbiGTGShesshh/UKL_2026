"use client"

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react"
import { toast } from "sonner"

export type CartProduct = {
  id: number
  name: string
  price: number
  description?: string
  category?: string
  imageUrl?: string
  stock?: number
  rating?: number
}

export type CartItem = CartProduct & {
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  isCartOpen: boolean

  addItem: (
    product: CartProduct,
    quantity?: number
  ) => void

  removeItem: (id: number) => void

  updateQuantity: (
    id: number,
    quantity: number
  ) => void

  clearCart: () => void

  openCart: () => void
  closeCart: () => void
}

const CartContext =
  createContext<CartContextValue | null>(
    null
  )

export function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [items, setItems] = useState<
    CartItem[]
  >([])

  const [isCartOpen, setIsCartOpen] =
    useState(false)

  const addItem = (
    product: CartProduct,
    quantity = 1
  ) => {
    setItems((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      )

      const maxStock =
        product.stock ?? 999

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  maxStock,
                  item.quantity + quantity
                ),
              }
            : item
        )
      }

      return [
        ...current,
        {
          ...product,
          quantity: Math.min(
            quantity,
            maxStock
          ),
        },
      ]
    })

    toast.success("Added to cart", {
      description: `${quantity} × ${product.name}`,
    })

    setIsCartOpen(true)
  }

  const updateQuantity = (
    id: number,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    )
  }

  const removeItem = (id: number) => {
    setItems((current) =>
      current.filter(
        (item) => item.id !== id
      )
    )

    toast.info("Item removed")
  }

  const clearCart = () => {
  setItems([])
}

  const openCart = () =>
    setIsCartOpen(true)

  const closeCart = () =>
    setIsCartOpen(false)

  const count = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [items]
  )

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          item.price * item.quantity,
        0
      ),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      isCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      items,
      count,
      subtotal,
      isCartOpen,
    ]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context =
    useContext(CartContext)

  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider"
    )
  }

  return context
}