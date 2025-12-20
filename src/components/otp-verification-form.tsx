"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { OTPInput } from "@/components/otp-input"
import { useToast } from "@/hooks/use-toast"
import { getRedirectUrl } from "@/lib/utils/auth"
import { useSearchParams } from "next/navigation"

interface OTPVerificationFormProps {
  email: string
  isSignup?: boolean
  className?: string
  onResend?: () => void
}

export function OTPVerificationForm({
  email,
  isSignup = false,
  className,
  onResend,
}: OTPVerificationFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showSuccess, showError } = useToast()
  
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [errors, setErrors] = useState<{ otp?: string; general?: string }>({})
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (otp.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit code" })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          token: otp,
          type: isSignup ? "signup" : "signin"
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || "Invalid verification code" })
        showError(data.error || "Invalid verification code")
        return
      }

      showSuccess(isSignup ? "Account created successfully!" : "Signed in successfully")
      
      // Check if onboarding is needed
      if (data.requiresOnboarding) {
        // Store email in session/localStorage for onboarding
        if (typeof window !== "undefined") {
          sessionStorage.setItem("pendingOnboarding", "true")
          sessionStorage.setItem("onboardingEmail", email)
        }
        router.push("/home?onboarding=true")
      } else {
        // Determine redirect based on user type
        let redirectUrl: string
        if (data.isInternal) {
          redirectUrl = "/admin/internal-users"
        } else {
          redirectUrl = getRedirectUrl(searchParams, "/onboarding")
        }
        router.push(redirectUrl)
        router.refresh()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to verify code. Please try again."
      setErrors({ general: errorMessage })
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return

    setResendLoading(true)
    setErrors({})

    try {
      const response = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email,
          type: isSignup ? "signup" : "signin"
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || "Failed to resend code" })
        showError(data.error || "Failed to resend code")
        return
      }

      showSuccess("Verification code sent! Please check your email.")
      setOtp("")
      
      // Set cooldown timer
      setResendCooldown(60)
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      if (onResend) {
        onResend()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to resend code. Please try again."
      setErrors({ general: errorMessage })
      showError(errorMessage)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardContent className="p-[18px] md:p-6">
        <form onSubmit={handleVerify}>
          <FieldGroup className="gap-5">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <h1 className="text-xl font-bold">
                {isSignup ? "Verify your email" : "Enter verification code"}
              </h1>
              <p className="text-muted-foreground text-balance text-sm">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
            </div>

            {errors.general && (
              <div className="rounded-md bg-destructive/15 p-2 text-xs text-destructive">
                {errors.general}
              </div>
            )}

            <Field className="gap-2">
              <FieldLabel className="text-sm text-center">Enter code</FieldLabel>
              <OTPInput
                value={otp}
                onChange={setOtp}
                disabled={loading}
                error={!!errors.otp}
              />
              <FieldError className="text-xs text-center">{errors.otp}</FieldError>
            </Field>

            <Field>
              <Button
                type="submit"
                className="w-full h-9 text-sm"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : isSignup ? "Create account" : "Sign in"}
              </Button>
            </Field>

            <FieldDescription className="text-center text-xs">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || resendCooldown > 0}
                className="underline underline-offset-2 hover:no-underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : resendLoading
                  ? "Sending..."
                  : "Resend code"}
              </button>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

