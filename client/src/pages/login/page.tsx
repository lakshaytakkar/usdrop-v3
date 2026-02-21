

import { Suspense, useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { Logo } from "@/components/layout/logo"
import { setAccessToken } from "@/lib/supabase"
import { useRouter } from "@/hooks/use-router"
import { useToast } from "@/hooks/use-toast"
import { Shield, User, Crown, ChevronUp, X } from "lucide-react"

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

const quickLoginUsers = [
  { label: "Admin", email: "admin@usdrop.ai", password: "usdrop", icon: Shield, color: "text-red-600", bg: "bg-red-50 hover:bg-red-100", border: "border-red-200" },
  { label: "Pro User", email: "pro@usdrop.ai", password: "usdrop", icon: Crown, color: "text-blue-600", bg: "bg-blue-50 hover:bg-blue-100", border: "border-blue-200" },
  { label: "Free User", email: "free@usdrop.ai", password: "usdrop", icon: User, color: "text-gray-600", bg: "bg-gray-50 hover:bg-gray-100", border: "border-gray-200" },
]

function QuickLoginWidget() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const { showSuccess, showError } = useToast()

  const handleQuickLogin = async (user: typeof quickLoginUsers[0]) => {
    setLoading(user.email)
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: user.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        showError(data.error || "Login failed")
        setLoading(null)
        return
      }
      if (data.token) {
        setAccessToken(data.token)
      }
      showSuccess(`Signed in as ${user.label}`)
      setTimeout(() => {
        router.push("/home")
        router.refresh()
      }, 300)
    } catch {
      showError("Login failed")
      setLoading(null)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50" data-testid="quick-login-widget">
      {open && (
        <div className="mb-3 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-64 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Login</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors" data-testid="button-close-quick-login">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {quickLoginUsers.map((user) => {
              const Icon = user.icon
              const isLoading = loading === user.email
              return (
                <button
                  key={user.email}
                  onClick={() => handleQuickLogin(user)}
                  disabled={!!loading}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border ${user.border} ${user.bg} transition-all text-left disabled:opacity-50`}
                  data-testid={`button-login-${user.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <Icon className={`h-4 w-4 ${user.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${user.color}`}>{user.label}</div>
                    <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
                  </div>
                  {isLoading && (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0 opacity-60" />
                  )}
                </button>
              )
            })}
          </div>
          <p className="text-[10px] text-gray-400 mt-3 text-center">Dev only — remove before launch</p>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="ml-auto flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-full shadow-lg transition-all text-sm font-medium"
        data-testid="button-toggle-quick-login"
      >
        <ChevronUp className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        Quick Login
      </button>
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
      <QuickLoginWidget />
    </div>
  )
}
