"use client"

import React, { useState, useEffect } from "react"

type ProductInput = {
  id?: number
  name: string
  description?: string
  price: number
  category?: string
  imageUrl?: string
  stock?: number
  rating?: number
}

export default function ProductModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean
  onClose: () => void
  onSave: (payload: ProductInput) => Promise<void>
  initial?: ProductInput | null
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [category, setCategory] = useState<string>("MAKANAN")
  const [imageUrl, setImageUrl] = useState("")
  const [stock, setStock] = useState<number>(0)
  const [rating, setRating] = useState<number>(0)

  useEffect(() => {
    if (initial) {
      setName(initial.name || "")
      setDescription(initial.description || "")
      setPrice(initial.price || 0)
      setCategory(initial.category || "MAKANAN")
      setImageUrl(initial.imageUrl || "")
      setStock(initial.stock || 0)
      setRating(initial.rating || 0)
    } else {
      setName("")
      setDescription("")
      setPrice(0)
      setCategory("MAKANAN")
      setImageUrl("")
      setStock(0)
      setRating(0)
    }
  }, [initial, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded max-w-lg w-full shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial ? "Edit" : "Add"} Product</h3>
          <button onClick={onClose} className="text-slate-500">✕</button>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="flex gap-3">
              <div className="w-32 h-24 bg-slate-100 rounded overflow-hidden flex items-center justify-center">
              {imageUrl ? <img src={imageUrl} alt="preview" className="object-cover w-full h-full" /> : <span className="text-slate-400">No Image</span>}
            </div>
            <div className="flex-1 grid gap-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border px-2 py-2 rounded" />
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="border px-2 py-2 rounded" />
            </div>
          </div>

          <div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border px-2 py-2 rounded" />
          </div>

          <div className="grid sm:grid-cols-3 gap-2">
            <input value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Price" type="number" className="border px-2 py-2 rounded" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="border px-2 py-2 rounded">
              <option value="MAKANAN">MAKANAN</option>
              <option value="MINUMAN">MINUMAN</option>
              <option value="LAINNYA">LAINNYA</option>
            </select>
            <input value={stock} onChange={(e) => setStock(Number(e.target.value))} placeholder="Stock" type="number" className="border px-2 py-2 rounded" />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button onClick={onClose} className="px-3 py-2 border rounded">Cancel</button>
            <button
              onClick={async () => {
                if (!name.trim()) return alert("Name required")
                if (!description.trim()) return alert("Description required")
                if (!imageUrl.trim()) return alert("Image URL required")
                if (price <= 0) return alert("Price must be greater than 0")
                if (stock < 0) return alert("Stock cannot be negative")
                await onSave({ id: initial?.id, name, description, price, category: category.toUpperCase(), imageUrl, stock })
              }}
              className="px-3 py-2 bg-rose-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
