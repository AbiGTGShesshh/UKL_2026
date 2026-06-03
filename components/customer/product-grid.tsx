"use client"

import React, { useEffect, useState } from "react"
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

const filters = [
  { key: "ALL", label: "Semua", icon: "📋" },
  { key: "MAKANAN", label: "Makanan", icon: "🍽" },
  { key: "MINUMAN", label: "Minuman", icon: "🥤" },
  { key: "LAINNYA", label: "Lainnya", icon: "📦" },
]

function matchesFilter(product: Product, filterKey: string) {
  if (filterKey === "ALL") return true

  const category = (product.category || "").toLowerCase()
  const name = (product.name || "").toLowerCase()

  if (filterKey === "MAKANAN") {
    return category.includes("makanan") || name.includes("ayam") || name.includes("ikan") || name.includes("nasi") || name.includes("lalmohon")
  }

  if (filterKey === "MINUMAN") {
    return category.includes("minuman") || name.includes("minuman") || name.includes("es") || name.includes("teh") || name.includes("jus")
  }

  if (filterKey === "LAINNYA") {
    return ![
      "makanan",
      "minuman",
      "ayam",
      "ikan",
      "esa",
      "teh",
      "jus",
    ].some((term) => category.includes(term) || name.includes(term))
  }

  return true
}

export default function CustomerProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState("ALL")
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/menu", { credentials: "include" })
        if (!res.ok) {
          throw new Error("Gagal memuat menu.")
        }

        const json = await res.json()
        setProducts(json.data || json || [])
      } catch (err: any) {
        console.error("Gagal memuat menu", err)
        setError(err?.message || "Gagal memuat menu.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filteredProducts = products.filter((product) => matchesFilter(product, selectedFilter))

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setSelectedFilter(filter.key)}
            className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-3xl border px-4 py-4 text-sm font-semibold transition ${
              selectedFilter === filter.key
                ? "border-rose-600 bg-rose-50 text-rose-600 shadow-sm"
                : "border-slate-200 bg-white text-slate-800 hover:border-rose-400 hover:text-rose-600"
            }`}
          >
            <span className="text-2xl">{filter.icon}</span>
            <span>{filter.label}</span>
            <span className={`h-1 w-10 rounded-full transition ${selectedFilter === filter.key ? "bg-rose-600" : "bg-transparent"}`} />
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-6 text-slate-600">Memuat menu...</div>
      ) : error ? (
        <div className="p-6 rounded-3xl border border-rose-200 bg-rose-50 text-rose-700">
          <p>{error}</p>
        </div>
      ) : !filteredProducts.length ? (
        <div className="p-6 rounded-3xl border border-slate-200 bg-white text-slate-600">
          Menu tidak tersedia untuk pilihan ini.
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm"
              >
              <div className="relative overflow-hidden bg-slate-100">
                <img
                  src={product.imageUrl || "/makanan.jpg"}
                  alt={product.name}
                  className="h-64 w-full object-cover transition duration-300 hover:scale-105"
                />
                <div className="absolute right-4 top-4 rounded-2xl bg-white/90 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur">
                  Rp {product.price}
                </div>
              </div>

              <div className="space-y-4 px-5 py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-3">
                      {product.description || "Deskripsi tidak tersedia untuk produk ini."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= (product.rating ?? 4) ? "text-amber-400" : "text-slate-200"}>
                      ★
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button onClick={() => setQuickViewProduct(product)} className="flex-1 rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-rose-700">
                    Quick View
                  </button>
                  <button onClick={() => addItem(product, 1)} className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-200 bg-white text-rose-600 transition hover:border-rose-300 hover:bg-rose-50">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2 4h14M7 13h10m-6 8a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

          <QuickViewModal
            open={Boolean(quickViewProduct)}
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={(product, quantity) => addItem(product, quantity)}
          />
        </>
      )}
    </div>
  )
}
