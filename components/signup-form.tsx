"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type Status = {
  type: "success" | "error"
  message: string
} | null

interface ApiResponse {
  message?: string
}

export function SignupForm(
  props: React.ComponentProps<typeof Card>
) {
  const [status, setStatus] = useState<Status>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const form = event.currentTarget

    setStatus(null)
    setIsLoading(true)

    const formData = new FormData(form)

    const name = String(formData.get("name") ?? "").trim()
    const username = String(formData.get("username") ?? "").trim()
    const password = String(formData.get("password") ?? "").trim()
    const confirmPassword = String(
      formData.get("confirm-password") ?? ""
    ).trim()

    if (!name || !username || !password || !confirmPassword) {
      setStatus({
        type: "error",
        message: "Please complete all fields.",
      })
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setStatus({
        type: "error",
        message: "Password must be at least 6 characters.",
      })
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match.",
      })
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          password,
        }),
      })

      let data: ApiResponse | null = null
      let text = ""

      try {
        text = await res.text()

        if (text) {
          try {
            data = JSON.parse(text)
          } catch {
            data = null
          }
        }
      } catch (err) {
        console.error(
          "Error reading signup response body:",
          err
        )
      }

      if (!res.ok) {
        const msg =
          data?.message ||
          text ||
          `Unable to create account (status ${res.status})`

        setStatus({
          type: "error",
          message: msg,
        })

        return
      }

      const successMsg =
        data?.message ||
        "Account created successfully."

      setStatus({
        type: "success",
        message: successMsg,
      })

      form.reset()

      setTimeout(() => {
        router.push("/login")
      }, 1000)
    } catch (error) {
      console.error("Signup network error:", error)

      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Network error. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {status && (
              <div
                className={
                  "mb-4 rounded-2xl border px-4 py-3 text-sm " +
                  (status.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-200"
                    : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200")
                }
              >
                {status.message}
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="name">
                Full Name
              </FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="username">
                Username
              </FieldLabel>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="yourusername"
                required
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
              />
              <FieldDescription>
                Must be at least 6 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
              />
              <FieldDescription>
                Please confirm your password.
              </FieldDescription>
            </Field>

            <Field>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Creating account..."
                    : "Create Account"}
                </Button>

                <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <a href="/login">Sign in</a>
                </FieldDescription>
              </div>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}