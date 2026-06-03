import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function parseJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".")
  if (parts.length !== 3) return null

  try {
    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=")
    const decoded = atob(padded)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

function resolveRole(token: string | undefined): string | null {
  if (!token) return null
  const payload = parseJwtPayload(token)
  if (!payload) return null

  const data = payload as Record<string, unknown>
  const rawRole =
    data["role"] ??
    data["role_name"] ??
    (data["user"] as Record<string, unknown> | undefined)?.["role"] ??
    (data["user"] as Record<string, unknown> | undefined)?.["role_name"] ??
    (data["data"] as Record<string, unknown> | undefined)?.["role"] ??
    (data["data"] as Record<string, unknown> | undefined)?.["role_name"]

  if (typeof rawRole === "string") {
    const normalized = rawRole.toLowerCase().trim()
    if (normalized.includes("admin")) return "admin"
    if (normalized.includes("customer") || normalized === "user") return "customer"
    return normalized
  }

  if (typeof rawRole === "boolean") {
    return rawRole ? "admin" : "customer"
  }

  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value
  const role = resolveRole(token)

  const isDashboard = pathname.startsWith("/dashboard")
  const isLoginPage = pathname === "/login"
  const isSignupPage = pathname === "/signup"

  if (isDashboard) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (pathname === "/dashboard/admin" && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/customer", request.url))
    }

    if (pathname === "/dashboard/customer" && role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url))
    }

    return NextResponse.next()
  }

  if ((isLoginPage || isSignupPage) && token) {
    const destination = role === "admin" ? "/dashboard/admin" : "/dashboard/customer"
    return NextResponse.redirect(new URL(destination, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
