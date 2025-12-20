"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { useToast } from "@/hooks/use-toast"
import { Logo } from "@/components/logo"
import Link from "next/link"

const RESEND_COOLDOWN_SECONDS = 60

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [checkingVerification, setCheckingVerification] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const email = searchParams.get("email") || user?.email || ""

  useEffect(() => {
    // Check if email is already verified
    const checkVerification = async () => {
      setCheckingVerification(true)

      if (user?.email_confirmed_at) {
        setIsVerified(true)
        showSuccess("Your email has already been verified!")
        // Redirect after a short delay
        setTimeout(() => {
          router.push("/my-dashboard")
        }, 2000)
        return
      }

      // If no user in context, check via API
      if (!user && email) {
        try {
          // We can't directly check verification status without auth
          // So we'll just show the verification page
          setIsVerified(false)
        } catch (error) {
          console.error("Error checking verification:", error)
        }
      }

      setCheckingVerification(false)
    }

    checkVerification()
  }, [user, email, router, showSuccess])

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleResend = async () => {
    if (!email || cooldown > 0) return

    setLoading(true)
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle rate limiting
        if (response.status === 429) {
          setCooldown(RESEND_COOLDOWN_SECONDS)
        }
        showError(data.error || "Failed to resend verification email")
        return
      }

      showSuccess("Verification email sent! Please check your inbox.")
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (error) {
      showError("Failed to resend verification email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (checkingVerification) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Checking verification status...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isVerified) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          <Card>
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
                    <h1 className="text-2xl font-bold">Email Verified</h1>
                    <p className="text-muted-foreground mt-2">
                      Your email address has been verified successfully. Redirecting...
                    </p>
                  </div>
                  <Link href="/my-dashboard">
                    <Button className="w-full">
                      Continue to Dashboard
                    </Button>
                  </Link>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardContent className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3">
                  <svg
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Verify your email</h1>
                  <p className="text-muted-foreground mt-2">
                    We&apos;ve sent a verification link to <strong>{email}</strong>.
                    Please check your inbox and click the link to verify your email address.
                  </p>
                </div>
                <Field>
                  <div className="space-y-2 w-full">
                    <Button
                      onClick={handleResend}
                      disabled={loading || cooldown > 0}
                      className="w-full"
                    >
                      {loading
                        ? "Sending..."
                        : cooldown > 0
                          ? `Resend in ${cooldown}s`
                          : "Resend verification email"}
                    </Button>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Back to login
                      </Button>
                    </Link>
                  </div>
                </Field>
                <FieldDescription>
                  {cooldown > 0
                    ? `Please wait ${cooldown} seconds before requesting another email.`
                    : "Didn't receive the email? Check your spam folder or try resending."}
                </FieldDescription>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
