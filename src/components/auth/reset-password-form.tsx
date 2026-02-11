"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
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
import { validatePassword, validatePasswordConfirmation } from "@/lib/utils/validation"
import { getPasswordStrength, getPasswordStrengthProgress, getPasswordStrengthBarColor } from "@/lib/utils/password"
import Link from "next/link"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { showSuccess, showError } = useToast()
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ 
    password?: string
    confirmPassword?: string
    token?: string
    general?: string 
  }>({})

  const passwordStrength = getPasswordStrength(password)
  const passwordProgress = getPasswordStrengthProgress(password)
  const passwordColor = getPasswordStrengthBarColor(password)

  useEffect(() => {
    // If no session after loading, user didn't come from email link
    if (!authLoading && !user) {
      setErrors({ 
        token: "No active reset session found. Please click the password reset link from your email." 
      })
    }
  }, [user, authLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Frontend validation
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setErrors({ password: passwordValidation.errors[0] })
      return
    }

    const confirmValidation = validatePasswordConfirmation(password, confirmPassword)
    if (!confirmValidation.valid) {
      setErrors({ confirmPassword: confirmValidation.error })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error?.includes("expired") || data.error?.includes("invalid")) {
          setErrors({ token: data.error })
        } else {
          setErrors({ general: data.error || "Failed to reset password" })
        }
        showError(data.error || "Failed to reset password")
        return
      }

      showSuccess("Password reset successfully! Redirecting to login...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reset password. Please try again."
      setErrors({ general: errorMessage })
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Show error if no session (user didn't come from email link)
  if (authLoading) {
    return (
      <Card className={cn("w-full max-w-md", className)} {...props}>
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center justify-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (errors.token || !user) {
    return (
      <Card className={cn("w-full max-w-md", className)} {...props}>
        <CardContent className="p-6 md:p-8">
          <FieldGroup>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-destructive/15 p-3">
                <svg
                  className="h-6 w-6 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Invalid Reset Link</h2>
                <p className="text-muted-foreground mt-2">
                  {errors.token || "This password reset link is invalid or has expired."}
                </p>
              </div>
              <Field>
                <Link href="/auth/forgot-password">
                  <Button className="w-full">
                    Request New Reset Link
                  </Button>
                </Link>
              </Field>
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
                Enter your new password below.
              </p>
            </div>

            {errors.general && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {errors.general}
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                required
                disabled={loading}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <FieldError>{errors.password}</FieldError>
              {password && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Password strength</span>
                    <span className={passwordColor}>
                      {passwordStrength === 0 && "Very Weak"}
                      {passwordStrength === 1 && "Weak"}
                      {passwordStrength === 2 && "Fair"}
                      {passwordStrength === 3 && "Good"}
                      {passwordStrength === 4 && "Strong"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordColor}`}
                      style={{ width: `${passwordProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                }}
                required
                disabled={loading}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
              />
              <FieldError>{errors.confirmPassword}</FieldError>
            </Field>
            
            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Resetting password..." : "Reset password"}
              </Button>
            </Field>
            
            <FieldDescription className="text-center">
              <Link href="/login" className="underline underline-offset-2">
                Back to login
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
