import { NextResponse } from "next/server"

type Product = {
  id: number
  name: string
  price: number
  image?: string
  rating?: number
}

// simple in-memory store for demo purposes
let PRODUCTS: Product[] = [
  { id: 1, name: "Lalmohon", price: 45000, image: "/makanan.jpg", rating: 4 },
  { id: 2, name: "Nasi Goreng", price: 35000, image: "/makanan.jpg", rating: 5 },
  { id: 3, name: "Es Teh", price: 8000, image: "/makanan.jpg", rating: 4 },
]

export async function GET() {
  return NextResponse.json({ data: PRODUCTS })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const id = PRODUCTS.length ? Math.max(...PRODUCTS.map((p) => p.id)) + 1 : 1
    const product: Product = {
      id,
      name: String(body.name ?? "Untitled"),
      price: Number(body.price ?? 0),
      image: body.image ?? "/makanan.jpg",
      rating: Number(body.rating ?? 0),
    }
    PRODUCTS = [product, ...PRODUCTS]
    return NextResponse.json({ data: product }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }
}
