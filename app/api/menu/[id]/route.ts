import { NextRequest } from "next/server"

const getApiBase = () => {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || ""
}

async function proxy(request: Request, path: string) {
  const API = getApiBase()
  if (!API) return new Response(JSON.stringify({ error: "API_URL not configured" }), { status: 500 })

  const target = `${API.replace(/\/$/, "")}${path}`
  const method = request.method
  console.log(`[proxy:id] ${method} -> ${target}`)

  const headers = new Headers()
  for (const [k, v] of request.headers) {
    if (k.toLowerCase() === "host") continue
    headers.set(k, v)
  }

  const cookies = request.headers.get("cookie")
  if (cookies && !headers.has("authorization")) {
    const token = cookies
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("token="))
      ?.split("=")[1]
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
  }

  let body: any = undefined
  if (method !== "GET" && method !== "HEAD") {
    try {
      body = await request.text()
    } catch (e) {
      body = undefined
    }
  }

  let res: Response
  try {
    res = await fetch(target, { method, headers, body, redirect: "manual" })
  } catch (err) {
    console.error("[proxy:id] fetch error", err)
    return new Response(JSON.stringify({ error: "Upstream fetch failed" }), { status: 502 })
  }
  const buf = await res.arrayBuffer()

  if (!res.ok) {
    const text = new TextDecoder().decode(buf)
    console.error(`[proxy:id] upstream response error ${res.status}:`, text.slice(0, 1000))
  }

  const outHeaders = new Headers()
  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      outHeaders.append("set-cookie", value)
    } else {
      outHeaders.set(key, value)
    }
  })

  return new Response(buf, { status: res.status, headers: outHeaders })
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return proxy(request, `/menu/${id}`)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return proxy(request, `/menu/${id}`)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return proxy(request, `/menu/${id}`)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return proxy(request, `/menu/${id}`)
}
