"use client";

import Link from "next/link";
import DashboardHeader from "@/components/dashboard/header";
import { useCart } from "@/components/cart-context";

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;

  return (
    <>
      <DashboardHeader />

      <div className="min-h-screen bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1650px] px-10 py-12">
          {items.length === 0 ? (
            <div className="border border-gray-200 bg-white p-12 text-center">
              <h2 className="text-2xl font-semibold">Cart is Empty</h2>

              <p className="mt-3 text-gray-500">Add some products first</p>

              <Link
                href="/dashboard/customer/menu"
                className="mt-6 inline-block bg-red-600 px-6 py-3 text-white"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_500px]">
              {/* LEFT */}
              <div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="w-[120px] py-5"></th>

                      <th className="py-5 text-left text-sm font-bold uppercase">
                        Product
                      </th>

                      <th className="py-5 text-center text-sm font-bold uppercase">
                        Price
                      </th>

                      <th className="py-5 text-center text-sm font-bold uppercase">
                        Quantity
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-300">
                        <td className="py-8">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex h-6 w-6 items-center justify-center border border-red-500 text-xs text-red-500"
                            >
                              ×
                            </button>

                            <img
                              src={item.imageUrl || "/makanan.jpg"}
                              alt={item.name}
                              className="h-16 w-16 rounded object-cover"
                            />
                          </div>
                        </td>

                        <td>
                          <h3 className="text-lg font-medium">{item.name}</h3>
                        </td>

                        <td className="text-center">
                          <div className="text-sm">
                            <span>{item.quantity}</span>

                            <span className="mx-1">×</span>

                            <span className="font-semibold text-red-500">
                              Rp {item.price.toLocaleString("id-ID")}
                            </span>

                            <span className="mx-1">=</span>

                            <span className="font-semibold text-red-500">
                              Rp{" "}
                              {(item.price * item.quantity).toLocaleString(
                                "id-ID",
                              )}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="text-3xl text-gray-500"
                            >
                              ‹
                            </button>

                            <div className="flex h-10 w-14 items-center justify-center border border-gray-400 bg-white">
                              {item.quantity}
                            </div>

                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="text-3xl text-gray-500"
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

              {/* RIGHT */}
              <div className="h-fit border border-gray-300 bg-white p-8">
                <h2 className="mb-6 text-xl font-bold uppercase">
                  Order Summary
                </h2>
                {/* LIST ITEM MODEL NOTA */}
                <div className="space-y-4 border-b border-gray-300 pb-6">
                  {items.map((item) => (
                    <div key={item.id}>
                      <p className="font-medium text-gray-800">{item.name}</p>

                      <div className="mt-1 flex items-center justify-between text-sm text-gray-600">
                        <span>
                          {item.quantity} × Rp{" "}
                          {item.price.toLocaleString("id-ID")}
                        </span>

                        <span className="font-medium text-gray-800">
                          Rp{" "}
                          {(item.quantity * item.price).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* TOTAL */}
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>

                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>PPN (12%)</span>

                    <span>Rp {tax.toLocaleString("id-ID")}</span>
                  </div>
                </div>
                <div className="mt-5 border-t border-dashed border-gray-400 pt-5">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>TOTAL</span>

                    <span className="text-red-600">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                
                <Link
                  href="/dashboard/customer/checkout"
                  className="mt-6 block w-full bg-red-600 py-3 text-center text-sm font-bold uppercase text-white hover:bg-red-700"
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
