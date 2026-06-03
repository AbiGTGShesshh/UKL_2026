"use client"

import Link from "next/link"
import DashboardHeader from "@/components/dashboard/header"

export default function CustomerDashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      {/* HERO BANNER */}
      <section className="relative w-full h-[450px] overflow-hidden">
        <img
          src="/banner.jpg"
          alt="Restaurant Banner"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-8 w-full">
            <div className="max-w-2xl text-white">
              <span className="inline-block bg-yellow-400 text-black font-semibold px-4 py-1 rounded-full mb-5">
                RESTO A&V
              </span>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                Nikmati Hidangan
                <br />
                Terbaik Kami
              </h1>

              <p className="mt-6 text-lg text-slate-200 leading-relaxed">
                Temukan berbagai menu favorit dengan cita rasa
                terbaik. Pesan makanan dengan mudah dan nikmati
                pengalaman kuliner yang istimewa.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/dashboard/customer/menu"
                  className="
                    bg-rose-600
                    hover:bg-rose-700
                    text-white
                    px-8
                    py-3
                    rounded-md
                    font-medium
                    transition
                  "
                >
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* IMAGE */}
            <div>
              <img
                src="/nyumi.jpg"
                alt="Food"
                className="
                  w-full
                  rounded-2xl
                  shadow-xl
                  object-cover
                "
              />
            </div>

            {/* TEXT */}
            <div>
              <span className="text-rose-600 font-semibold uppercase tracking-widest">
                Best Seller
              </span>

              <h2 className="mt-3 text-5xl font-extrabold text-slate-900 leading-tight">
                Mau Pesan
                <br />
                Makanan?
              </h2>

              <p className="mt-6 text-lg text-slate-500 leading-relaxed">
                Jelajahi menu favorit kami dan pesan hidangan
                lezat hanya dalam beberapa klik. Nikmati makanan
                berkualitas dengan pelayanan terbaik.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/dashboard/customer/menu"
                  className="
                    bg-rose-600
                    hover:bg-rose-700
                    text-white
                    px-8
                    py-3
                    rounded-md
                    font-medium
                    transition
                  "
                >
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              Kenapa Memilih Kami?
            </h2>

            <p className="mt-4 text-slate-500">
              Pengalaman terbaik untuk menikmati makanan favorit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold">
                Bahan Berkualitas
              </h3>

              <p className="mt-3 text-slate-500">
                Semua menu dibuat menggunakan bahan pilihan
                terbaik.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold">
                Pengiriman Cepat
              </h3>

              <p className="mt-3 text-slate-500">
                Pesanan diproses dan dikirim dengan cepat.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold">
                Harga Terjangkau
              </h3>

              <p className="mt-3 text-slate-500">
                Nikmati makanan lezat dengan harga yang ramah.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}