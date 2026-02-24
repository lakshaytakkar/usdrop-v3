import { useEffect, useState } from "react"
import { useRouter } from "@/hooks/use-router"
import { setAccessToken, clearAccessToken, apiFetch } from "@/lib/supabase"
import { getUserRedirectPath } from "@/lib/utils/user-redirects"
import type { UserMetadata } from "@/types/user-metadata"
import { FullPageSpinner } from "@/components/ui/blue-spinner"

function parseFragment(): { token: string | null; redirectTo: string | null; error: string | null } {
  const hash = window.location.hash.substring(1)
  if (!hash) return { token: null, redirectTo: null, error: null }
  const params = new URLSearchParams(hash)
  return {
    token: params.get("token"),
    redirectTo: params.get("redirectTo"),
    error: params.get("error"),
  }
}

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlError = urlParams.get("error")
    const fragment = parseFragment()

    window.history.replaceState(null, "", window.location.pathname)

    if (urlError || fragment.error) {
      const errorMsg = urlError || fragment.error || "Authentication failed"
      setError(errorMsg)
      setTimeout(() => {
        router.push(`/login?error=${encodeURIComponent(errorMsg)}`)
      }, 2000)
      return
    }

    const token = fragment.token
    const redirectTo = fragment.redirectTo || "/framework"

    if (!token) {
      router.push("/login")
      return
    }

    setAccessToken(token)

    apiFetch("/api/auth/user")
      .then(async (res) => {
        if (res.ok) {
          const userData = await res.json()
          const metadata: UserMetadata = {
            id: userData.user?.id || '',
            email: userData.user?.email || '',
            fullName: userData.user?.full_name || null,
            username: null,
            avatarUrl: userData.user?.avatar_url || null,
            isInternal: userData.user?.internal_role != null,
            internalRole: userData.user?.internal_role || null,
            isExternal: userData.user?.internal_role == null,
            plan: userData.plan || 'free',
            planName: userData.planName || 'Free',
            status: userData.user?.status || 'active',
            onboardingCompleted: userData.user?.onboarding_completed || false,
            subscriptionStatus: null,
          }
          const finalRedirect = getUserRedirectPath(metadata)
          router.push(redirectTo !== "/framework" ? redirectTo : finalRedirect)
        } else {
          clearAccessToken()
          router.push("/login?error=" + encodeURIComponent("Session expired. Please sign in again."))
        }
        router.refresh()
      })
      .catch(() => {
        clearAccessToken()
        router.push("/login")
        router.refresh()
      })
  }, [])

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-destructive mb-2">{error}</p>
          <p className="text-xs text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <FullPageSpinner />
}
