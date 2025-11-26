"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Default admin page - redirects to /admin/internal-users
 * This ensures /admin route works and defaults to internal users page
 */
export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to internal users page as the default admin page
    router.replace("/admin/internal-users")
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-muted-foreground">Redirecting to internal users...</div>
    </div>
  )
}

