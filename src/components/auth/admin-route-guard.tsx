"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

const ADMIN_ROLES = ["admin", "super_admin", "editor", "moderator"]

const ADMIN_ALLOWED_EXACT = ["/"]

const ADMIN_ALLOWED_PREFIXES = [
  "/admin",
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
  "/settings",
]

function isAdminAllowedPath(pathname: string): boolean {
  if (ADMIN_ALLOWED_EXACT.includes(pathname)) return true
  return ADMIN_ALLOWED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading || !user) return

    const internalRole = user.internal_role
    const isAdmin = internalRole && ADMIN_ROLES.includes(internalRole)

    if (isAdmin && !isAdminAllowedPath(pathname)) {
      router.replace("/admin")
    }
  }, [user, isLoading, pathname, router])

  return <>{children}</>
}
