

import { useSearchParams } from "@/hooks/use-router"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { Logo } from "@/components/layout/logo"
import { Link } from "wouter"

function AuthCodeErrorContent() {
  const searchParams = useSearchParams()
  const errorType = searchParams.get("type") || "generic"
  const errorMessage = searchParams.get("error") || searchParams.get("description") || ""

  // Determine error details based on type
  const getErrorDetails = () => {
    switch (errorType) {
      case "expired":
        return {
          title: "Link Expired",
          message: errorMessage || "This authentication link has expired. Please request a new one.",
          actionLabel: "Request New Link",
          actionHref: "/auth/forgot-password",
        }
      case "invalid":
        return {
          title: "Invalid Link",
          message: errorMessage || "This authentication link is invalid. Please request a new one.",
          actionLabel: "Request New Link",
          actionHref: "/auth/forgot-password",
        }
      case "used":
        return {
          title: "Link Already Used",
          message: errorMessage || "This authentication link has already been used. Please request a new one if needed.",
          actionLabel: "Request New Link",
          actionHref: "/auth/forgot-password",
        }
      case "verification":
        return {
          title: "Verification Error",
          message: errorMessage || "There was an error verifying your email. Please request a new verification email.",
          actionLabel: "Resend Verification",
          actionHref: "/auth/verify-email",
        }
      default:
        return {
          title: "Authentication Error",
          message: errorMessage || "There was an error with the authentication link. This could happen if the link has expired or has already been used.",
          actionLabel: "Request New Link",
          actionHref: "/auth/forgot-password",
        }
    }
  }

  const errorDetails = getErrorDetails()

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
                  <h1 className="text-2xl font-bold">{errorDetails.title}</h1>
                  <p className="text-muted-foreground mt-2">
                    {errorDetails.message}
                  </p>
                </div>
                <Field>
                  <div className="space-y-2 w-full">
                    <Link href={errorDetails.actionHref}>
                      <Button className="w-full">
                        {errorDetails.actionLabel}
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Back to login
                      </Button>
                    </Link>
                  </div>
                </Field>
                <p className="text-sm text-muted-foreground">
                  If you continue to experience issues, please contact support.
                </p>
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
              <div className="animate-pulse rounded-full bg-muted-foreground/20 p-3 h-12 w-12" />
              <div className="space-y-2 w-full">
                <div className="animate-pulse h-8 bg-muted-foreground/20 rounded w-3/4 mx-auto" />
                <div className="animate-pulse h-4 bg-muted-foreground/20 rounded w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCodeErrorContent />
    </Suspense>
  )
}
