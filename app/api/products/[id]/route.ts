import { NextResponse } from "next/server"

type Product = {
  id: number
  name: string
  price: number
  image?: string
  rating?: number
}

// Import same store instance by requiring the parent module
// Note: This is a simple demo. For production use a real DB.
let PRODUCTS: Product[] = []

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // @ts-ignore
  const mod = require("../route")
  PRODUCTS = mod.PRODUCTS || []
} catch {
  // ignore
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  const found = PRODUCTS.find((p) => p.id === id)
  if (!found) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json({ data: found })
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    const body = await request.json()
    let updated: Product | null = null
    PRODUCTS = PRODUCTS.map((p) => {
      if (p.id === id) {
        updated = { ...p, ...body }
        return updated
      }
      return p
    })
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 })
    return NextResponse.json({ data: updated })
  } catch {
    return NextResponse.json({ message: "Invalid" }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  const prev = PRODUCTS.length
  PRODUCTS = PRODUCTS.filter((p) => p.id !== id)
  if (PRODUCTS.length === prev) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json({ message: "Deleted" }, { status: 200 })
}
