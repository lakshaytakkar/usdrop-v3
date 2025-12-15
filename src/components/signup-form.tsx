"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { validateEmail } from "@/lib/utils/validation"
import { getRedirectUrl } from "@/lib/utils/auth"
import Link from "next/link"
import { Mail } from "lucide-react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showSuccess, showError } = useToast()
  
  const [email, setEmail] = useState("")
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errors, setErrors] = useState<{ 
    email?: string
    general?: string 
  }>({})

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Frontend validation
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      setErrors({ email: emailValidation.error })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/magic-link/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || "Failed to send magic link" })
        showError(data.error || "Failed to send magic link")
        setLoading(false)
        return
      }

      setMagicLinkSent(true)
      showSuccess("Magic link sent! Please check your email.")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send magic link. Please try again."
      setErrors({ general: errorMessage })
      showError(errorMessage)
      setLoading(false)
    }
  }

  // Show success state after magic link is sent
  if (magicLinkSent) {
    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-[18px] md:p-6">
              <FieldGroup className="gap-5">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-xl font-bold">Check your email</h1>
                  <p className="text-muted-foreground text-balance text-sm">
                    We sent a magic link to <strong>{email}</strong>
                  </p>
                  <p className="text-muted-foreground text-xs mt-2">
                    Click the link in the email to verify your account and complete signup.
                  </p>
                </div>

                <FieldDescription className="text-center text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMagicLinkSent(false)
                      setEmail("")
                      setErrors({})
                    }}
                    className="underline underline-offset-2 hover:no-underline"
                  >
                    Use a different email
                  </button>
                </FieldDescription>
              </FieldGroup>
            </div>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/images/ui/login-bg-vertical.png"
                alt="Background"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-purple-900/40 to-violet-900/40 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-[18px] md:p-6" onSubmit={handleEmailSubmit}>
            <FieldGroup className="gap-5">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <h1 className="text-xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance text-sm">
                  Sign up to get started
                </p>
              </div>

              {errors.general && (
                <div className="rounded-md bg-destructive/15 p-2 text-xs text-destructive">
                  {errors.general}
                </div>
              )}

              <Field>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full h-9 text-sm"
                  disabled={loading || googleLoading}
                  onClick={async () => {
                    setGoogleLoading(true)
                    try {
                      const redirectTo = getRedirectUrl(searchParams, "/")
                      // Pass signup=true to indicate this is a signup flow
                      window.location.href = `/api/auth/google?redirectTo=${encodeURIComponent(redirectTo)}&signup=true`
                    } catch (error) {
                      setGoogleLoading(false)
                      showError("Failed to initiate Google sign-up. Please try again.")
                    }
                  }}
                >
                  {googleLoading ? (
                    <>
                      <svg className="mr-1.5 h-3 w-3 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing up...
                    </>
                  ) : (
                    <>
                      <svg className="mr-1.5 h-3 w-3" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Sign up with Google
                    </>
                  )}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card -my-1.5">
                Or continue with
              </FieldSeparator>

              <Field className="gap-2">
                <FieldLabel htmlFor="email" className="text-sm">Email</FieldLabel>
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
                  className="h-9 text-sm"
                />
                <FieldError className="text-xs">{errors.email}</FieldError>
              </Field>
              
              <Field>
                <Button
                  type="submit"
                  className="w-full h-9 text-sm"
                  disabled={loading || !email}
                >
                  {loading ? "Sending magic link..." : "Continue with email"}
                </Button>
              </Field>
              
              <FieldDescription className="text-center text-xs">
                Already have an account? <Link href="/login" className="underline underline-offset-2">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/images/ui/login-bg-vertical.png"
              alt="Background"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-purple-900/40 to-violet-900/40 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-[18px] text-center text-xs">
        By creating an account, you agree to our <Link href="/terms" className="underline underline-offset-2">Terms of Service</Link>{" "}
        and <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  )
}