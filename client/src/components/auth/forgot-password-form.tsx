

import { apiFetch } from '@/lib/supabase'
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { validateEmail } from "@/lib/utils/validation"
import { Link } from "wouter"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { showSuccess, showError } = useToast()
  
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({})
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccess(false)

    // Frontend validation
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      setErrors({ email: emailValidation.error })
      return
    }

    setLoading(true)

    try {
      const response = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || "Failed to send reset email" })
        showError(data.error || "Failed to send reset email")
        return
      }

      setSuccess(true)
      showSuccess("If an account exists with this email, a password reset link has been sent.")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email. Please try again."
      setErrors({ general: errorMessage })
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className={cn("w-full max-w-md", className)} {...props}>
        <CardContent className="p-6 md:p-8">
          <FieldGroup>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Check your email</h2>
                <p className="text-muted-foreground mt-2">
                  If an account exists with <strong>{email}</strong>, we&apos;ve sent a password reset link.
                </p>
              </div>
              <Field>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Back to login
                  </Button>
                </Link>
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full max-w-md", className)} {...props}>
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Reset your password</h1>
              <p className="text-muted-foreground text-balance">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            {errors.general && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {errors.general}
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                required
                disabled={loading}
                aria-invalid={errors.email ? "true" : "false"}
              />
              <FieldError>{errors.email}</FieldError>
            </Field>
            
            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </Field>
            
            <FieldDescription className="text-center">
              Remember your password? <Link href="/login" className="underline underline-offset-2">Sign in</Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
