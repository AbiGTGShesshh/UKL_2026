"use client";

import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/header";

export default function AdminDashboardPage() {
  const router = useRouter();

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
                Welcome Admin
              </h1>

              <p className="mt-6 text-lg text-slate-200 leading-relaxed">
                Manage menu items, customer orders, products, and restaurant
                operations from one centralized dashboard.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => router.push("/dashboard/admin/product")}
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
                  Manage Menu
                </button>
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
                Admin Panel
              </span>

              <h2 className="mt-3 text-5xl font-extrabold text-slate-900 leading-tight">
                Restaurant
                <br />
                Management
              </h2>

              <p className="mt-6 text-lg text-slate-500 leading-relaxed">
                Monitor orders, manage products, update menu information, and
                keep your restaurant running efficiently through one integrated
                platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
