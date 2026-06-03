"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type Status = {
  type: "success" | "error"
  message: string
} | null

type ApiResp = {
  message?: string
  token?: string
  access_token?: string
  accessToken?: string
  role?: string
  role_name?: string
  isAdmin?: boolean
  user?: {
    role?: string
    role_name?: string
  }
  data?: {
    role?: string
    role_name?: string
    user?: {
      role?: string
      role_name?: string
    }
  }
}

function normalizeRole(value: unknown): string | undefined {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (normalized.includes("admin")) return "admin"
    if (normalized.includes("customer")) return "customer"
    if (normalized === "user") return "customer"
    return normalized
  }
  if (typeof value === "boolean") {
    return value ? "admin" : undefined
  }
  return undefined
}

function findRole(obj: unknown): string | undefined {
  if (typeof obj === "string" || typeof obj === "boolean") {
    return normalizeRole(obj)
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = findRole(item)
      if (result) return result
    }
    return undefined
  }

  if (typeof obj === "object" && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      const lower = key.toLowerCase()
      if (lower.includes("role") || lower.includes("admin")) {
        const role = normalizeRole(value)
        if (role) return role
        const nested = findRole(value)
        if (nested) return nested
      }
    }

    for (const value of Object.values(obj)) {
      const role = findRole(value)
      if (role) return role
    }
  }

  return undefined
}

function decodeJwtRole(token: string): string | undefined {
  const parts = token.split(".")
  if (parts.length !== 3) return undefined

  try {
    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=")
    const decoded = atob(padded)
    const parsed = JSON.parse(decoded)
    return findRole(parsed)
  } catch {
    return undefined
  }
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()

  const [status, setStatus] = useState<Status>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const form = event.currentTarget

    setStatus(null)
    setIsLoading(true)

    const formData = new FormData(form)

    const username = String(
      formData.get("username") ?? ""
    ).trim()

    const password = String(
      formData.get("password") ?? ""
    ).trim()

    if (!username || !password) {
      setStatus({
        type: "error",
        message: "Please fill in username and password.",
      })
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      let text = ""
      let data: ApiResp | null = null

      try {
        text = await res.text()

        if (text) {
          try {
            data = JSON.parse(text) as ApiResp
          } catch {
            data = null
          }
        }
      } catch (e) {
        console.error(
          "Error reading login response:",
          e
        )
      }

      if (!res.ok) {
        const msg =
          data?.message ||
          text ||
          `Login failed (${res.status})`

        setStatus({
          type: "error",
          message: msg,
        })

        return
      }

  const token =
  data?.token ??
  data?.access_token ??
  data?.accessToken ??
  null

if (token) {
  localStorage.setItem("token", token)
}

console.log("LOGIN RESPONSE:", data)
console.log("TOKEN FOUND:", token)

console.log("================================")
console.log("LOGIN RESPONSE:", data)
console.log("TOKEN FOUND:", token)
console.log("================================")

      let role = findRole(data)
      if (!role && token) {
        role = decodeJwtRole(token)
      }
      role = role ?? "customer"

      if (token) {
  try {
    const setRes = await fetch(
      "/api/auth/set-cookie",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      }
    )

    console.log(
      "SET COOKIE STATUS:",
      setRes.status
    )

    const responseText =
      await setRes.text()

    console.log(
      "SET COOKIE RESPONSE:",
      responseText
    )

    if (!setRes.ok) {
      console.log(
        "FALLBACK COOKIE USED"
      )

      document.cookie = `token=${token}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; SameSite=Lax`
    }
  } catch (err) {
    console.error(
      "SET COOKIE ERROR:",
      err
    )

    document.cookie = `token=${token}; path=/; max-age=${
      60 * 60 * 24 * 7
    }; SameSite=Lax`
  }
} else {
  console.error(
    "TOKEN NOT FOUND IN LOGIN RESPONSE"
  )
}

      try {
        localStorage.setItem(
          "role",
          String(role)
        )
      } catch {
        // ignore
      }

      const successMsg =
        data?.message ||
        text ||
        "Logged in successfully."

      setStatus({
        type: "success",
        message: successMsg,
      })

      form.reset()

      setTimeout(() => {
        if (
          String(role).toLowerCase() ===
          "admin"
        ) {
          router.push("/dashboard/admin")
        } else {
          router.push("/dashboard/customer")
        }
      }, 700)
    } catch (error) {
      console.error(
        "Login network error:",
        error
      )

      setStatus({
        type: "error",
        message:
          "Network error. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      className={cn(
        "flex flex-col gap-6 font-sans text-slate-950 dark:text-slate-100",
        className
      )}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Login to your account
          </h1>

          <p className="max-w-[26rem] text-sm leading-6 text-slate-600 dark:text-slate-400">
            Enter your username below to login
            to your account
          </p>
        </div>

        {status && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              status.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-200"
                : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200"
            )}
          >
            {status.message}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="username">
            Username
          </FieldLabel>

          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            required
            className="bg-background"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">
            Password
          </FieldLabel>

          <Input
            id="password"
            name="password"
            type="password"
            required
            className="bg-background"
          />
        </Field>

        <Field>
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Logging in..."
                : "Login"}
            </Button>

            <Button
              asChild
              variant="outline"
            >
              <a href="/signup">
                Sign up
              </a>
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}