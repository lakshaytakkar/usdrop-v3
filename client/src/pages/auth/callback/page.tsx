import { useEffect, useState } from "react"
import { useRouter } from "@/hooks/use-router"
import { setAccessToken, clearAccessToken, apiFetch } from "@/lib/supabase"
import { getUserRedirectPath } from "@/lib/utils/user-redirects"
import type { UserMetadata } from "@/types/user-metadata"
import { FullPageSpinner } from "@/components/ui/blue-spinner"

function parseFragment(): Record<string, string> {
  const hash = window.location.hash.substring(1)
  if (!hash) return {}
  const params = new URLSearchParams(hash)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

async function fetchUserAndRedirect(
  router: ReturnType<typeof useRouter>,
  redirectTo: string
) {
  try {
    const res = await apiFetch("/api/auth/user")
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
  } catch {
    clearAccessToken()
    router.push("/login")
    router.refresh()
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

    const redirectTo = urlParams.get("redirectTo") || fragment.redirectTo || "/framework"

    if (fragment.access_token) {
      apiFetch("/api/auth/google/exchange", {
        method: "POST",
        body: JSON.stringify({ access_token: fragment.access_token }),
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json()
            setAccessToken(data.token)
            await fetchUserAndRedirect(router, redirectTo)
          } else {
            const errData = await res.json().catch(() => ({}))
            setError(errData.error || "Google sign-in failed. Please try again.")
            setTimeout(() => {
              router.push(`/login?error=${encodeURIComponent(errData.error || "Google sign-in failed.")}`)
            }, 2000)
          }
        })
        .catch(() => {
          setError("Google sign-in failed. Please try again.")
          setTimeout(() => {
            router.push("/login?error=" + encodeURIComponent("Google sign-in failed."))
          }, 2000)
        })
      return
    }

    if (fragment.token) {
      setAccessToken(fragment.token)
      fetchUserAndRedirect(router, redirectTo)
      return
    }

    router.push("/login")
  }, [])

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-destructive mb-2" data-testid="text-error">{error}</p>
          <p className="text-xs text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <FullPageSpinner />
}
