"use client"

import Link from "next/link"
import DashboardHeader from "@/components/dashboard/header"

export default function CustomerDashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      {/* HERO BANNER - RESPONSIVE HEIGHT */}
      <section className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] overflow-hidden">
        <img
          src="/banner.jpg"
          alt="Restaurant Banner"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl text-white">
              <span className="inline-block bg-yellow-400 text-black text-xs sm:text-sm font-semibold px-4 py-1 rounded-full mb-4 sm:mb-5">
                RESTO A&V
              </span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                Nikmati Hidangan
                <br />
                Terbaik Kami
              </h1>

              <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed">
                Temukan berbagai menu favorit dengan cita rasa
                terbaik. Pesan makanan dengan mudah dan nikmati
                pengalaman kuliner yang istimewa.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap gap-4">
                <Link
                  href="/dashboard/customer/menu"
                  className="
                    w-full sm:w-auto
                    text-center
                    bg-rose-600
                    hover:bg-rose-700
                    text-white
                    px-8
                    py-2.5 sm:py-3
                    rounded-md
                    text-sm sm:text-base font-medium
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

      {/* CONTENT - ADJUSTED PADDING & GRID ORDER */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            {/* IMAGE - FLOWS DOWN ON MOBILE */}
            <div className="order-2 lg:order-1">
              <img
                src="/nyumi.jpg"
                alt="Food"
                className="
                  w-full
                  h-[250px] sm:h-[350px] md:h-[400px] lg:h-auto
                  rounded-2xl
                  shadow-xl
                  object-cover
                "
              />
            </div>

            {/* TEXT - READ FIRST ON MOBILE */}
            <div className="order-1 lg:order-2">
              <span className="text-rose-600 text-xs sm:text-sm font-semibold uppercase tracking-widest">
                Best Seller
              </span>

              <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Mau Pesan
                <br className="hidden sm:inline" /> Makanan?
              </h2>

              <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-500 leading-relaxed">
                Jelajahi menu favorit kami dan pesan hidangan
                lezat hanya dalam beberapa klik. Nikmati makanan
                berkualitas dengan pelayanan terbaik.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap gap-4">
                <Link
                  href="/dashboard/customer/menu"
                  className="
                    w-full sm:w-auto
                    text-center
                    bg-rose-600
                    hover:bg-rose-700
                    text-white
                    px-8
                    py-2.5 sm:py-3
                    rounded-md
                    text-sm sm:text-base font-medium
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

      {/* FEATURE SECTION - ADAPTIVE GRID */}
      <section className="bg-slate-50 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Kenapa Memilih Kami?
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-500">
              Pengalaman terbaik untuk menikmati makanan favorit.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Bahan Berkualitas
              </h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Semua menu dibuat menggunakan bahan pilihan terbaik untuk menjaga kesegaran rasa.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Pengiriman Cepat
              </h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Pesanan diproses secara instan dan dikirim dengan cepat langsung ke meja Anda.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-100 sm:col-span-2 md:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Harga Terjangkau
              </h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Nikmati hidangan berkelas restoran bintang lima tanpa khawatir dompet tipis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}