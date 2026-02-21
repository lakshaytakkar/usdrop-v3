

import { Suspense, useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { Logo } from "@/components/layout/logo"
import { apiFetch, setAccessToken } from "@/lib/supabase"
import { useRouter, useSearchParams } from "@/hooks/use-router"
import { getUserRedirectPath } from "@/lib/utils/user-redirects"
import { useToast } from "@/hooks/use-toast"
import { Shield, Crown, User } from "lucide-react"

function LoginFormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border bg-card p-0 md:grid md:grid-cols-2">
        <div className="p-[18px] md:p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-pulse h-6 w-32 bg-muted rounded" />
            <div className="animate-pulse h-4 w-48 bg-muted rounded" />
            <div className="animate-pulse h-9 w-full bg-muted rounded mt-4" />
            <div className="animate-pulse h-9 w-full bg-muted rounded" />
            <div className="animate-pulse h-9 w-full bg-muted rounded" />
          </div>
        </div>
        <div className="bg-muted relative hidden md:block min-h-[300px]" />
      </div>
    </div>
  )
}

const quickLogins = [
  { label: "Sign in as Admin", email: "admin@usdrop.ai", password: "usdrop", Icon: Shield },
  { label: "Sign in as Pro User", email: "pro@usdrop.ai", password: "usdrop", Icon: Crown },
  { label: "Sign in as Free User", email: "free@usdrop.ai", password: "usdrop", Icon: User },
]

function DevQuickLoginPanel() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const [searchParams] = useSearchParams()
  const { showSuccess, showError } = useToast()

  const handleLogin = async (user: typeof quickLogins[0]) => {
    setLoading(user.email)
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: user.password }),
      })
      const data = await res.json()
      if (!res.ok) { showError(data.error || "Login failed"); setLoading(null); return }
      if (data.token) setAccessToken(data.token)
      showSuccess(`Signed in as ${user.label.replace("Sign in as ", "")}`)
      const redirectedFrom = searchParams.get("redirectedFrom")
      if (redirectedFrom) { router.push(redirectedFrom); router.refresh(); return }
      const userRes = await apiFetch("/api/auth/user")
      if (userRes.ok) {
        const userData = await userRes.json()
        router.push(getUserRedirectPath(userData))
        router.refresh()
      } else {
        router.push("/home")
        router.refresh()
      }
    } catch {
      showError("Login failed")
      setLoading(null)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50" data-testid="dev-quick-login-panel">
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 w-56">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Dev Quick Login</p>
        <div className="space-y-2">
          {quickLogins.map((ql) => (
            <button
              key={ql.email}
              onClick={() => handleLogin(ql)}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-2 h-9 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              data-testid={`button-login-${ql.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {loading === ql.email ? (
                <div className="h-3.5 w-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ql.Icon className="h-3.5 w-3.5 text-gray-500" />
                  <span>{ql.label}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-[18px] md:p-[30px]">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
      <DevQuickLoginPanel />
    </div>
  )
}
