

import { useAuth } from "@/contexts/auth-context"
import { useUserPlanContext } from "@/contexts/user-plan-context"
import { usePathname } from "@/hooks/use-router"
import { BlueSpinner } from "@/components/ui/blue-spinner"

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/pricing",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/what-is-dropshipping",
  "/who-is-this-for",
  "/auth",
]

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
}

export function AuthLoadingGate({ children }: { children: React.ReactNode }) {
  const { loading: authLoading } = useAuth()
  const { isLoading: planLoading } = useUserPlanContext()
  const pathname = usePathname()

  if (isPublicPath(pathname)) {
    return <>{children}</>
  }

  if (authLoading || planLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/30">
        <BlueSpinner size="lg" label="Loading your workspace..." />
      </div>
    )
  }

  return <>{children}</>
}
