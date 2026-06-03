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

  const handleSubmit = async () => {
  if (!agree) {
    toast.error(
      "Please agree to the terms and conditions first"
    );
    return;
  }

  if (items.length === 0) {
    toast.error("Cart is empty");
    return;
  }

  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token not found. Please login again.");
      return;
    }

    const payload = {
      items: items.map((item) => ({
        menuId: item.id,
        quantity: item.quantity,
      })),
    };

    const response = await fetch(
      "https://ukael-sama-abebeye-production.up.railway.app/order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", result);

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to create order"
      );
    }

    toast.success("Order berhasil dibuat!");

    clearCart();

    // HAPUS router.push()
    // router.push("/dashboard/customer/order-success");
  } catch (error) {
    console.error(error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to submit order"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <>
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

                    <th className="px-4 py-4 text-right uppercase">
                      Sub Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-4">
                        {item.name} x {item.quantity}
                      </td>

                      <td className="px-4 py-4 text-right font-medium">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
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
