"use client";

import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/header";

export default function AdminDashboardPage() {
  const router = useRouter();

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
                Welcome Admin
              </h1>

              <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed">
                Manage menu items, customer orders, products, and restaurant
                operations from one centralized dashboard.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => router.push("/dashboard/admin/product")}
                  className="
                    w-full sm:w-auto
                    bg-rose-600
                    hover:bg-rose-700
                    text-white
                    px-6 sm:px-8
                    py-2.5 sm:py-3
                    rounded-md
                    text-sm sm:text-base font-medium
                    transition
                    shadow-sm
                  "
                >
                  Manage Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT - ADJUSTED PADDING & GRID ORDER */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            {/* IMAGE - DOCK DOWN AT MOBILE VIA GRID ORDER */}
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

            {/* TEXT - READ FIRST AT MOBILE */}
            <div className="order-1 lg:order-2">
              <span className="text-rose-600 text-xs sm:text-sm font-semibold uppercase tracking-widest">
                Admin Panel
              </span>

              <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Restaurant
                <br className="hidden sm:inline" /> Management
              </h2>

              <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-500 leading-relaxed">
                Monitor orders, manage products, update menu information, and
                keep your restaurant running efficiently through one integrated
                platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                {/* Tempat untuk button tambahan nanti */}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}