"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Loader from "@/components/kokonutui/loader"

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
        <Loader 
          title="Verifying authentication..." 
          subtitle="Please wait while we check your access"
          size="md"
        />
      </div>
    )
  }

  return <>{children}</>
}
