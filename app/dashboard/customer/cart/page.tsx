"use client";

import Link from "next/link";
import DashboardHeader from "@/components/dashboard/header";
import { useCart } from "@/components/cart-context";
import toast, { Toaster } from "react-hot-toast";

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;

  // Fungsi penangan perubahan kuantitas dengan validasi stok
  const handleQuantityChange = (id: number, currentQty: number, targetQty: number, maxStock: number) => {
    // 1. Jangan biarkan kuantitas kurang dari 1
    if (targetQty < 1) return;

    // 2. Validasi Kritis: Cek apakah target melampaui stok yang ada
    if (targetQty > maxStock) {
      toast.error(`Maaf, stok item ini terbatas hanya sampai ${maxStock} pcs saja.`);
      return;
    }

    // 3. Jika aman, jalankan fungsi update dari context
    updateQuantity(id, targetQty);
  };

  return (
    <>
      <DashboardHeader />
      <Toaster position="top-center" />

      <div className="min-h-screen bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1650px] px-4 py-6 sm:px-10 sm:py-12">
          {items.length === 0 ? (
            <div className="border border-gray-200 bg-white p-8 sm:p-12 text-center rounded-xl">
              <h2 className="text-xl sm:text-2xl font-semibold">Cart is Empty</h2>
              <p className="mt-3 text-sm text-gray-500">Add some products first</p>
              <Link
                href="/dashboard/customer/menu"
                className="mt-6 inline-block bg-red-600 px-6 py-3 text-sm font-bold text-white rounded hover:bg-red-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_500px]">
              
              {/* LEFT: DAFTAR KERANJANG */}
              <div className="bg-white p-4 sm:p-6 border border-gray-200 rounded-xl">
                
                {/* TAMPILAN DESKTOP (TABLE MODE) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-300 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <th className="w-[120px] py-4"></th>
                        <th className="py-4 text-left">Product</th>
                        <th className="py-4 text-center">Price Details</th>
                        <th className="py-4 text-center">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="py-6">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="flex h-6 w-6 items-center justify-center border border-red-500 text-xs text-red-500 rounded hover:bg-red-50 transition-colors"
                                title="Remove item"
                              >
                                ×
                              </button>
                              <img
                                src={item.imageUrl || "/makanan.jpg"}
                                alt={item.name}
                                className="h-16 w-16 rounded object-cover border border-gray-100"
                              />
                            </div>
                          </td>
                          <td>
                            <h3 className="text-base font-bold text-slate-800">{item.name}</h3>
                            <p className="text-xs text-amber-600 font-medium mt-0.5">
                              Sisa Stok: {item.stock ?? 0} pcs
                            </p>
                          </td>
                          <td className="text-center">
                            <div className="text-sm text-slate-600">
                              <span>{item.quantity}</span>
                              <span className="mx-1">×</span>
                              <span className="font-semibold text-gray-800">
                                Rp {item.price.toLocaleString("id-ID")}
                              </span>
                              <span className="mx-1">=</span>
                              <span className="font-bold text-red-600">
                                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, item.quantity - 1, item.stock ?? 999)}
                                className="text-2xl text-gray-400 hover:text-gray-700 px-2 select-none"
                              >
                                ‹
                              </button>
                              <div className="flex h-9 w-12 items-center justify-center border border-gray-300 bg-slate-50 text-sm font-bold rounded text-slate-800">
                                {item.quantity}
                              </div>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, item.quantity + 1, item.stock ?? 999)}
                                disabled={item.quantity >= (item.stock ?? 999)}
                                className="text-2xl text-gray-400 hover:text-gray-700 px-2 select-none disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                ›
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* TAMPILAN MOBILE (CARD MODE) */}
                <div className="block md:hidden space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                      <div className="flex gap-3 items-start">
                        <img
                          src={item.imageUrl || "/makanan.jpg"}
                          alt={item.name}
                          className="h-14 w-14 rounded object-cover border shrink-0 bg-white"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-slate-800 truncate">{item.name}</h3>
                          <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Stok: {item.stock ?? 0} pcs</p>
                          <p className="text-xs text-slate-500 mt-1">
                            @ Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 border border-red-200 rounded p-1 hover:bg-red-50"
                        >
                          <span className="text-xs font-bold px-1">Hapus</span>
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-200/60">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, item.quantity - 1, item.stock ?? 999)}
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 bg-white rounded text-lg text-gray-500"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold w-6 text-center text-slate-800">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, item.quantity + 1, item.stock ?? 999)}
                            disabled={item.quantity >= (item.stock ?? 999)}
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 bg-white rounded text-lg text-gray-500 disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400 block">Subtotal</span>
                          <span className="text-sm font-black text-red-600">
                            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* RIGHT: ORDER SUMMARY */}
              <div className="h-fit border border-gray-200 bg-white p-5 sm:p-8 rounded-xl shadow-sm">
                <h2 className="mb-4 sm:mb-6 text-lg font-black uppercase tracking-wide text-slate-800">
                  Order Summary
                </h2>
                
                {/* LIST ITEM MODEL NOTA */}
                <div className="space-y-3 border-b border-gray-200 pb-4 max-h-[220px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="text-xs sm:text-sm">
                      <p className="font-bold text-slate-700 truncate">{item.name}</p>
                      <div className="mt-0.5 flex items-center justify-between text-gray-500">
                        <span>
                          {item.quantity} × Rp {item.price.toLocaleString("id-ID")}
                        </span>
                        <span className="font-semibold text-slate-800">
                          Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-800">Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PPN (12%)</span>
                    <span className="font-medium text-slate-800">Rp {tax.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-dashed border-gray-300 pt-4">
                  <div className="flex items-center justify-between text-base sm:text-lg font-black">
                    <span className="text-slate-800">TOTAL</span>
                    <span className="text-red-600">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                
                <Link
                  href="/dashboard/customer/checkout"
                  className="mt-6 block w-full bg-red-600 py-3 text-center text-xs sm:text-sm font-bold uppercase text-white rounded-lg hover:bg-red-700 transition-all shadow-md shadow-red-600/10 active:scale-[0.99]"
                >
                  Proceed To Checkout
                </Link>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}