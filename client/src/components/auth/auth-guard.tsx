

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "@/hooks/use-router"
import { useAuth } from "@/contexts/auth-context"
import { BlueSpinner } from "@/components/ui/blue-spinner"

export function AuthGuard({ 
  children, 
  requireAuth = true,
  redirectTo = "/login"
}: { 
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (loading) {
      setShouldRender(false)
      return
    }

    if (requireAuth && !user) {
      router.push(`${redirectTo}?redirectedFrom=${encodeURIComponent(pathname)}`)
      setShouldRender(false)
      return
    }

    if (!requireAuth && user) {
      router.push("/")
      setShouldRender(false)
      return
    }

    setShouldRender(true)
  }, [user, loading, requireAuth, router, pathname, redirectTo])

  if (loading || !shouldRender) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <BlueSpinner size="lg" label="Verifying access..." />
      </div>
    )
  }

  return <>{children}</>
}
