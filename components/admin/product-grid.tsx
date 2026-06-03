"use client"

import React, { useEffect, useState } from "react"
import ProductCard from "./product-card"
import ProductModal from "./product-modal"
import QuickViewModal from "@/components/quick-view-modal"
import { useCart } from "@/components/cart-context"

type Product = {
  id: number
  name: string
  price: number
  description?: string
  category?: string
  imageUrl?: string
  stock?: number
  rating?: number
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const { addItem } = useCart()
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")

  // Always use server-side proxy to avoid CORS and allow httpOnly cookies
  const base = "/api/menu"

  async function load() {
    setLoading(true)
    setError(null)

    try {
      let res: Response

      try {
        res = await fetch(base, {
          credentials: "include",
        })
      } catch {
        res = await fetch("/api/products", {
          credentials: "include",
        })
      }

      if (!res.ok) {
        const proxyRes = await fetch("/api/products", {
          credentials: "include",
        })

        if (proxyRes.ok) {
          const json = await proxyRes.json()
          setProducts(json.data || json || [])
          return
        }

        throw new Error(`Request failed: ${res.status}`)
      }

      const json = await res.json()
      setProducts(json.data || json || [])
    } catch (err) {
      console.error("Failed loading products", err)

      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch products"

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSave(payload: any) {
    try {
      if (payload.id) {
        await fetch(`${base}/${payload.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        })
      } else {
        await fetch(base, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        })
      }

      setModalOpen(false)
      setEditing(null)
      await load()
    } catch (err) {
      console.error("Failed saving product:", err)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return

    try {
      await fetch(`${base}/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      await load()
    } catch (err) {
      console.error("Failed deleting product:", err)
    }
  }

  const filteredProducts =
    selectedCategory === "ALL"
      ? products
      : products.filter(
          (product) =>
            product.category?.toUpperCase() === selectedCategory
        )

  if (loading) {
    return (
      <div className="p-6">
        Loading products...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4 text-red-600">
          Error: {error}
        </div>

        <button
          onClick={load}
          className="rounded bg-slate-100 px-3 py-2"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">
          Product Admin
        </h2>

        <button
          type="button"
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600"
        >
          <span className="text-lg">＋</span>
          <span>Tambah</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              key: "ALL",
              label: "Semua",
              icon: "📋",
            },
            {
              key: "MAKANAN",
              label: "Makanan",
              icon: "🍽",
            },
            {
              key: "MINUMAN",
              label: "Minuman",
              icon: "🥤",
            },
            {
              key: "LAINNYA",
              label: "Lainnya",
              icon: "📦",
            },
          ].map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() =>
                setSelectedCategory(filter.key)
              }
              className={`group flex min-h-24 flex-col items-center justify-center gap-2 rounded-3xl border px-4 py-4 text-sm font-semibold transition ${
                selectedCategory === filter.key
                  ? "border-rose-600 bg-rose-50 text-rose-600 shadow-sm"
                  : "border-slate-200 bg-white text-slate-800 hover:border-rose-400 hover:text-rose-600"
              }`}
            >
              <span className="text-2xl">
                {filter.icon}
              </span>

              <span>{filter.label}</span>

              <span
                className={`h-1 w-10 rounded-full transition ${
                  selectedCategory === filter.key
                    ? "bg-rose-600"
                    : "bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {filteredProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onEdit={(prod) => {
              setEditing(prod)
              setModalOpen(true)
            }}
            onDelete={handleDelete}
            onQuickView={(prod) =>
              setQuickViewProduct(prod)
            }
            onAddToCart={(product) =>
              addItem(product, 1)
            }
          />
        ))}
      </div>

      <ProductModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
        initial={editing || undefined}
      />

      <QuickViewModal
        open={Boolean(quickViewProduct)}
        product={quickViewProduct}
        onClose={() =>
          setQuickViewProduct(null)
        }
        onAddToCart={(product, quantity) =>
          addItem(product, quantity)
        }
      />
    </div>
  )
}