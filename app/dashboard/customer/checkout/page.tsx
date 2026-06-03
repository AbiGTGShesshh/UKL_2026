"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/header";
import { useCart } from "@/components/cart-context";
import { Toaster, toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;

  // 🌟 Fungsi helper untuk membaca cookie non-httpOnly di sisi Client
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const handleSubmit = async () => {
    if (!agree) {
      toast.error("Please agree to the terms and conditions first");
      return;
    }

    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setLoading(true);
      
      // 🌟 Ambil data role yang sudah kita set terbuka di cookie tadi
      const rawRole = getCookie("role");
      const role = rawRole ? rawRole.trim().toLowerCase() : null;

      const payload = {
        items: items.map((item) => ({
          menuId: item.id,
          quantity: item.quantity,
        })),
      };

      // 🌟 Kerennya httpOnly cookie: kamu tidak perlu manual ambil token & menaruhnya di header Authorization!
      // Browser otomatis menyertakan cookie 'token' kamu di request ini asalkan berada di domain yang sama.
      // Catatan: Jika API backend kereta api (railway) kamu beda domain, pastikan menambahkan { credentials: 'include' }
      const response = await fetch(
        "https://ukael-sama-abebeye-production.up.railway.app/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Jika backend-mu mewajibkan header "Authorization: Bearer <token>", kamu harus tetap menyimpan token cadangan di localStorage/cookie biasa untuk dibaca di sini.
            // Namun jika API-mu membaca langsung dari Cookie HTTP-Only, line di bawah ini bisa dihapus.
            Authorization: `Bearer ${getCookie("token") || localStorage.getItem("token")}`, 
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create order");
      }

      toast.success("Order berhasil dibuat!");
      clearCart();

      // PENGKONDISIAN ROUTING DARI COOKIE ROLE
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "customer" || role === "user") {
        router.push("/dashboard/customer");
      } else {
        // Fallback aman jika role bermasalah agar tidak terlempar ke 404 /dashboard
        router.push("/dashboard/customer");
      }

    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <DashboardHeader />

      <div className="min-h-screen bg-[#f7f7f7] py-12">
        <div className="mx-auto max-w-3xl">
          <div className="border bg-gray-100 p-8">
            <h2 className="mb-6 text-center text-2xl font-bold uppercase">
              Your Order
            </h2>

            {/* ORDER TABLE */}
            <div className="bg-white">
              <table className="w-full border">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-4 text-left uppercase">Product</th>
                    <th className="px-4 py-4 text-right uppercase">Sub Total</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-4">
                        {item.name} x {item.quantity}
                      </td>
                      <td className="px-4 py-4 text-right font-medium">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}

                  <tr className="border-b">
                    <td className="px-4 py-4 font-bold">Subtotal</td>
                    <td className="px-4 py-4 text-right font-bold text-red-600">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="px-4 py-4 font-bold">PPN (12%)</td>
                    <td className="px-4 py-4 text-right text-red-600">
                      Rp {tax.toLocaleString("id-ID")}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-4 py-4 text-lg font-bold">Total</td>
                    <td className="px-4 py-4 text-right text-lg font-bold text-red-600">
                      Rp {total.toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* PAYMENT */}
            <div className="mt-8">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <span>Cash On Delivery</span>
              </label>

              <label className="mt-3 flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "TRANSFER"}
                  onChange={() => setPaymentMethod("TRANSFER")}
                />
                <span>Bank Transfer</span>
              </label>
            </div>

            {/* TERMS */}
            <div className="mt-6">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>
                  I have read and agree to the website terms and conditions
                </span>
              </label>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-8 w-full bg-red-600 py-4 text-sm font-bold uppercase text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Proceed To Checkout"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}