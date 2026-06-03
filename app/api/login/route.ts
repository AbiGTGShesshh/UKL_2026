import { NextResponse } from "next/server"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ukael-sama-abebeye-production.up.railway.app"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: body.username,
        password: body.password,
      }),
    })

    const text = await response.text()

    let data

    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text }
    }

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error("Login API Error:", error)

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    )
  }
}