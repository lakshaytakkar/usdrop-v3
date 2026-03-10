
import { apiFetch, setAccessToken } from '@/lib/supabase'
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "@/hooks/use-router"
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
import { Link } from "wouter"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { OTPInput } from "@/components/auth/otp-input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [searchParams] = useSearchParams()
  const { showSuccess, showError } = useToast()

  const [step, setStep] = useState<"form" | "otp">("form")
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [otp, setOtp] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendLoading, setResendLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    fullName?: string
    password?: string
    confirmPassword?: string
    otp?: string
    general?: string
  }>({})

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: typeof errors = {}

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain a lowercase letter"
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain an uppercase letter"
    } else if (!/\d/.test(password)) {
      newErrors.password = "Password must contain a number"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const response = await apiFetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || "Failed to create account" })
        showError(data.error || "Failed to create account")
        setLoading(false)
        return
      }

      if (data.requiresVerification) {
        showSuccess("Verification code sent! Check your email.")
        setStep("otp")
        setResendCooldown(60)
      } else if (data.token) {
        setAccessToken(data.token)
        showSuccess("Account created successfully!")
        const redirectedFrom = searchParams.get('redirectedFrom')
        router.push(redirectedFrom || "/free-learning")
        router.refresh()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create account. Please try again."
      setErrors({ general: errorMessage })
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (otp.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit code" })
      return
    }

    setLoading(true)

    try {
      const response = await apiFetch("/api/auth/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || "Verification failed" })
        showError(data.error || "Verification failed")
        setLoading(false)
        return
      }

      if (data.token) {
        setAccessToken(data.token)
      }

      showSuccess("Account created successfully!")
      const redirectedFrom = searchParams.get('redirectedFrom')
      router.push(redirectedFrom || "/free-learning")
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Verification failed. Please try again."
      setErrors({ general: errorMessage })
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendLoading) return
    setResendLoading(true)
    setErrors({})

    try {
      const response = await apiFetch("/api/auth/signup/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || "Failed to resend code" })
        showError(data.error || "Failed to resend code")
        return
      }

      showSuccess("Verification code sent! Check your email.")
      setOtp("")
      setResendCooldown(60)
    } catch (error) {
      showError("Failed to resend code. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  if (step === "otp") {
    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-[18px] md:p-6" onSubmit={handleVerifyOtp}>
              <FieldGroup className="gap-5">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <h1 className="text-xl font-bold" data-testid="text-verify-title">Verify your email</h1>
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
                  <FieldLabel className="text-sm text-center">Enter verification code</FieldLabel>
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
                    data-testid="button-verify-otp"
                  >
                    {loading ? "Verifying..." : "Create account"}
                  </Button>
                </Field>

                <FieldDescription className="text-center text-xs">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading || resendCooldown > 0}
                    className="underline underline-offset-2 hover:no-underline disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-resend-otp"
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : resendLoading
                      ? "Sending..."
                      : "Resend code"}
                  </button>
                </FieldDescription>

                <FieldDescription className="text-center text-xs">
                  <button
                    type="button"
                    onClick={() => { setStep("form"); setOtp(""); setErrors({}) }}
                    className="inline-flex items-center gap-1 underline underline-offset-2 hover:no-underline"
                    data-testid="button-back-to-form"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to sign up
                  </button>
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
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-[18px] md:p-6" onSubmit={handleSignup}>
            <FieldGroup className="gap-5">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <h1 className="text-xl font-bold" data-testid="text-signup-title">Create an account</h1>
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
                  data-testid="button-google-signup"
                  onClick={async () => {
                    setGoogleLoading(true)
                    try {
                      const redirectTo = getRedirectUrl(searchParams, "/")
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
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Sign up with Google
                    </>
                  )}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card -my-1.5">
                Or continue with email
              </FieldSeparator>

              <Field className="gap-2">
                <FieldLabel htmlFor="fullName" className="text-sm">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    setErrors((prev) => ({ ...prev, fullName: undefined }))
                  }}
                  disabled={loading}
                  aria-invalid={errors.fullName ? "true" : "false"}
                  className="h-9 text-sm"
                  data-testid="input-full-name"
                />
                <FieldError className="text-xs">{errors.fullName}</FieldError>
              </Field>

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
                  data-testid="input-email"
                />
                <FieldError className="text-xs">{errors.email}</FieldError>
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="password" className="text-sm">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setErrors((prev) => ({ ...prev, password: undefined }))
                    }}
                    required
                    disabled={loading}
                    aria-invalid={errors.password ? "true" : "false"}
                    className="h-9 text-sm pr-9"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    tabIndex={-1}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError className="text-xs">{errors.password}</FieldError>
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="confirmPassword" className="text-sm">Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                    }}
                    required
                    disabled={loading}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    className="h-9 text-sm pr-9"
                    data-testid="input-confirm-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    tabIndex={-1}
                    data-testid="button-toggle-confirm-password"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError className="text-xs">{errors.confirmPassword}</FieldError>
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full h-9 text-sm"
                  disabled={loading || !email || !password || !confirmPassword}
                  data-testid="button-create-account"
                >
                  {loading ? "Sending verification code..." : "Create account"}
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
