"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  imageUrl?: string;
  stock?: number;
  rating?: number;
};

export default function QuickViewModal({
  open,
  product,
  onClose,
  onAddToCart,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setQuantity(product.stock && product.stock > 0 ? 1 : 0);
    }
  }, [product]);

  useEffect(() => {
    if (!open) {
      setQuantity(1);
    }
  }, [open]);

  if (!open || !product) return null;

  const stock = product.stock ?? 0;

  const handleAddToCart = () => {
    if (!onAddToCart) return;

    if (stock <= 0) {
      toast.error("Produk sedang habis");
      return;
    }

    onAddToCart(product, quantity);

    toast.success("Added to cart", {
      description: `${quantity} × ${product.name}`,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl overflow-hidden rounded-[36px] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div />
          <button
            onClick={onClose}
            className="text-slate-500 transition hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] px-6 py-6">
          {/* Image */}
          <div className="rounded-[28px] bg-slate-100 p-6">
            <img
              src={product.imageUrl || "/makanan.jpg"}
              alt={product.name}
              className="h-full w-full rounded-[28px] object-cover"
            />
          </div>

          {/* Detail */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                {product.name}
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                {product.description ||
                  "Deskripsi belum tersedia untuk produk ini."}
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-lg font-semibold text-rose-600">
                Rp {product.price.toLocaleString("id-ID")}
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>
                  {product.category
                    ? product.category.toUpperCase()
                    : "LAINNYA"}
                </span>

                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-600">
                  Stock {stock}
                </span>
              </div>

              {stock <= 0 && (
                <p className="font-medium text-red-500">
                  Out of Stock
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
              {/* Quantity */}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <button
                  type="button"
                  disabled={stock <= 0}
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  className="h-10 w-10 rounded-2xl border border-slate-300 bg-white text-lg font-semibold transition hover:bg-slate-100 disabled:opacity-50"
                >
                  −
                </button>

                <input
                  type="number"
                  disabled={stock <= 0}
                  min={1}
                  max={stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(
                        stock,
                        Math.max(
                          1,
                          Number(e.target.value) || 1
                        )
                      )
                    )
                  }
                  className="w-20 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-center text-sm outline-none disabled:bg-slate-100"
                />

                <button
                  type="button"
                  disabled={stock <= 0 || quantity >= stock}
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(stock, current + 1)
                    )
                  }
                  className="h-10 w-10 rounded-2xl border border-slate-300 bg-white text-lg font-semibold transition hover:bg-slate-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>

              {/* Add To Cart */}
              <button
                type="button"
                disabled={stock <= 0}
                onClick={handleAddToCart}
                className={`inline-flex h-14 items-center justify-center rounded-3xl px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white transition ${
                  stock <= 0
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}