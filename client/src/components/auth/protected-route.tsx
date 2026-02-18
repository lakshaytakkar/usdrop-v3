

import { useEffect } from "react"
import { useRouter } from "@/hooks/use-router"
import { useAuth } from "@/contexts/auth-context"
import { BlueSpinner } from "@/components/ui/blue-spinner"

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
        <BlueSpinner size="lg" label="Verifying access..." />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
