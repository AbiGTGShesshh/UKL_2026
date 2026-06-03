"use client"

import React from "react"

type Product = {
  id: number
  name: string
  price: number
  description?: string
  category?: string
  stock?: number
  imageUrl?: string
  rating?: number
}

type ProductCardProps = {
  product: Product
  onEdit: (p: Product) => void
  onDelete: (id: number) => void
  onQuickView: (p: Product) => void
  onAddToCart: (product: Product, quantity?: number) => void
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onQuickView,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl || "/makanan.jpg"}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-300 hover:scale-105"
        />

        <div className="absolute right-4 top-4 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-lg">
          Rp {product.price.toLocaleString("id-ID")}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900">
              {product.name}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm text-slate-600">
              {product.description ||
                "Deskripsi tidak tersedia untuk produk ini."}
            </p>
          </div>

          <button
            onClick={() => onEdit(product)}
            className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-950 shadow-sm transition hover:bg-amber-500"
          >
            Edit
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-600">
            {product.category?.toUpperCase() || "LAINNYA"}
          </span>

          <span className="text-sm font-semibold text-slate-500">
            Stock {product.stock ?? 0}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <button
            onClick={() => onQuickView(product)}
            className="rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-rose-700"
          >
            Quick View
          </button>

          <button
            onClick={() => onAddToCart(product, 1)}
            className="flex items-center justify-center rounded-3xl bg-amber-400 px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-950 shadow-sm transition hover:bg-amber-500"
            aria-label="Tambah ke Keranjang"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2 4h14M7 13h10m-6 8a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className="rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-rose-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}