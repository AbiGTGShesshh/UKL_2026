"use client"

import DashboardHeader from "@/components/dashboard/header"
import ProductGrid from "@/components/admin/product-grid"

export default function AdminProductPage() {
  return (
    <div>
      <DashboardHeader />
      <main className="max-w-6xl mx-auto p-6">
        <ProductGrid />
      </main>
    </div>
  )
}
