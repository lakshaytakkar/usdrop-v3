"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"

export function VerifyEmailBanner() {
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!user || dismissed) {
    return null
  }

  const handleResend = async () => {
    if (!user.email) return

    setLoading(true)
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        showError(data.error || "Failed to resend verification email")
        return
      }

      showSuccess("Verification email sent! Please check your inbox.")
    } catch (error) {
      showError("Failed to resend verification email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-b bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-amber-600 dark:text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Please verify your email address.</strong> Check your inbox for a verification link.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/verify-email">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResend}
                disabled={loading}
                className="text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700"
              >
                {loading ? "Sending..." : "Resend"}
              </Button>
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
