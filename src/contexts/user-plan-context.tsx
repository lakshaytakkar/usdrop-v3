"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"

interface UserPlanContextType {
  plan: string | null
  isFree: boolean
  isPro: boolean
  isAdmin: boolean
  internalRole: string | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const UserPlanContext = createContext<UserPlanContextType | null>(null)

interface UserPlanProviderProps {
  children: ReactNode
}

const CACHE_KEY = "usdrop_user_plan"
const CACHE_DURATION = 5 * 60 * 1000

interface CachedPlanData {
  plan: string
  internalRole: string | null
  timestamp: number
}

const ADMIN_ROLES = ["admin", "super_admin", "editor", "moderator"]

export function UserPlanProvider({ children }: UserPlanProviderProps) {
  const [plan, setPlan] = useState<string | null>(null)
  const [internalRole, setInternalRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()

  const applyFromCache = useCallback((): boolean => {
    if (typeof window === "undefined") return false
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        const cachedData: CachedPlanData = JSON.parse(cached)
        if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
          setPlan(cachedData.plan || "free")
          setInternalRole(cachedData.internalRole || null)
          setIsLoading(false)
          setError(null)
          return true
        }
      }
    } catch {
    }
    return false
  }, [])

  const fetchUserPlan = useCallback(async (skipCache = false) => {
    if (!user) {
      setPlan(null)
      setInternalRole(null)
      setIsLoading(false)
      setError(null)
      if (typeof window !== "undefined") {
        try { sessionStorage.removeItem(CACHE_KEY) } catch {}
      }
      return
    }

    if (!skipCache && applyFromCache()) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/auth/user")

      if (response.ok) {
        const data = await response.json()
        const userPlan = data.plan || "free"
        const userRole = data.user?.internal_role || null

        setPlan(userPlan)
        setInternalRole(userRole)

        if (typeof window !== "undefined") {
          try {
            const cacheData: CachedPlanData = {
              plan: userPlan,
              internalRole: userRole,
              timestamp: Date.now(),
            }
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
          } catch {}
        }
      } else {
        setPlan("free")
        if (typeof window !== "undefined") {
          try { sessionStorage.removeItem(CACHE_KEY) } catch {}
        }
      }
    } catch (err) {
      console.error("Error fetching user plan:", err)
      setError(err instanceof Error ? err.message : "Failed to load plan")
      setPlan("free")
      if (typeof window !== "undefined") {
        try { sessionStorage.removeItem(CACHE_KEY) } catch {}
      }
    } finally {
      setIsLoading(false)
    }
  }, [user, applyFromCache])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (authLoading) return

    if (user) {
      if (applyFromCache()) return

      const userRole = user.internal_role || null
      const isAdminUser = userRole != null && ADMIN_ROLES.includes(userRole)
      const userPlan = isAdminUser ? "pro" : (user.account_type || "free")
      setPlan(userPlan)
      setInternalRole(userRole)
      setIsLoading(false)

      fetchUserPlan()
    } else {
      try {
        sessionStorage.removeItem(CACHE_KEY)
      } catch {}
      setPlan(null)
      setInternalRole(null)
      setIsLoading(false)
      setError(null)
    }
  }, [user, authLoading, fetchUserPlan, applyFromCache])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === null || e.key === CACHE_KEY) {
        fetchUserPlan(true)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [fetchUserPlan])

  const isAdmin = internalRole != null && ADMIN_ROLES.includes(internalRole)
  const isFree = !isAdmin && (plan === "free" || plan === null)
  const isPro = isAdmin || plan === "pro"

  const value: UserPlanContextType = {
    plan,
    isFree,
    isPro,
    isAdmin,
    internalRole,
    isLoading,
    error,
    refetch: () => fetchUserPlan(true),
  }

  return (
    <UserPlanContext.Provider value={value}>
      {children}
    </UserPlanContext.Provider>
  )
}

export function useUserPlanContext(): UserPlanContextType {
  const context = useContext(UserPlanContext)
  if (!context) {
    return {
      plan: "free",
      isFree: true,
      isPro: false,
      isAdmin: false,
      internalRole: null,
      isLoading: false,
      error: null,
      refetch: async () => {},
    }
  }
  return context
}
