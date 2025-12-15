"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Loader from "@/components/kokonutui/loader"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = window.location.pathname
      router.push(`/login?redirectedFrom=${encodeURIComponent(currentPath)}`)
    }
  }, [user, loading, router])

  if (loading) {
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

  if (!user) {
    return null
  }

  return <>{children}</>
}
