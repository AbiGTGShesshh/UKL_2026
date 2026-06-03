import Link from "next/link"
import DashboardHeader from "@/components/dashboard/header"
import CustomerProductGrid from "@/components/customer/product-grid"

export default function CustomerMenuPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-10 rounded-[32px] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-rose-600">Customer Menu</p>
              <h1 className="mt-3 text-4xl font-bold text-slate-900">Pilihan Favorit Kami</h1>
              <p className="mt-4 max-w-2xl text-slate-600">
                Temukan hidangan terbaik dari menu kami, siap disantap kapan saja.
              </p>
            </div>

            <Link
              href="/dashboard/customer"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Kembali ke dashboard
            </Link>
          </div>
        </div>

        <CustomerProductGrid />
      </main>
    </div>
  )
}
