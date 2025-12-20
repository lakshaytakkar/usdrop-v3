"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"

interface UserPlanContextType {
  plan: string | null
  isFree: boolean
  isPro: boolean
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const UserPlanContext = createContext<UserPlanContextType | null>(null)

interface UserPlanProviderProps {
  children: ReactNode
}

const CACHE_KEY = "usdrop_user_plan"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface CachedPlanData {
  plan: string
  timestamp: number
}

export function UserPlanProvider({ children }: UserPlanProviderProps) {
  const [plan, setPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchUserPlan = useCallback(async (skipCache = false) => {
    try {
      // Check sessionStorage cache first
      if (!skipCache && typeof window !== "undefined") {
        try {
          const cached = sessionStorage.getItem(CACHE_KEY)
          if (cached) {
            const cachedData: CachedPlanData = JSON.parse(cached)
            const now = Date.now()
            
            // Use cached data if still valid
            if (now - cachedData.timestamp < CACHE_DURATION) {
              setPlan(cachedData.plan || "free")
              setIsLoading(false)
              setError(null)
              return
            }
          }
        } catch (cacheError) {
          // If cache parsing fails, continue to fetch
          console.warn("Failed to read plan cache:", cacheError)
        }
      }

      setIsLoading(true)
      setError(null)

      // Only fetch if user is logged in
      if (!user) {
        setPlan(null)
        setIsLoading(false)
        return
      }

      // Fetch user plan
      const response = await fetch("/api/auth/user")
      
      if (response.ok) {
        const data = await response.json()
        const userPlan = data.plan || "free"
        
        setPlan(userPlan)
        
        // Cache the result in sessionStorage
        if (typeof window !== "undefined") {
          try {
            const cacheData: CachedPlanData = {
              plan: userPlan,
              timestamp: Date.now(),
            }
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
          } catch (cacheError) {
            console.warn("Failed to cache plan data:", cacheError)
          }
        }
      } else {
        // Default to free if API fails
        setPlan("free")
        
        // Don't cache errors
        if (typeof window !== "undefined") {
          try {
            sessionStorage.removeItem(CACHE_KEY)
          } catch (cacheError) {
            // Ignore cache removal errors
          }
        }
      }
    } catch (err) {
      console.error("Error fetching user plan:", err)
      setError(err instanceof Error ? err.message : "Failed to load plan")
      setPlan("free")
      
      // Clear cache on error
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem(CACHE_KEY)
        } catch (cacheError) {
          // Ignore cache removal errors
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Fetch plan on mount and when user changes
  useEffect(() => {
    if (typeof window === "undefined") return

    if (user) {
      // User is logged in, fetch plan data (cache will prevent unnecessary refetches)
      fetchUserPlan()
    } else {
      // User logged out, clear cache and reset state
      try {
        sessionStorage.removeItem(CACHE_KEY)
        setPlan(null)
        setIsLoading(false)
        setError(null)
      } catch (cacheError) {
        // Ignore cache errors
        setPlan(null)
        setIsLoading(false)
      }
    }
  }, [user, fetchUserPlan])

  // Clear cache when user logs out (listen for storage events or auth changes)
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleStorageChange = (e: StorageEvent) => {
      // If sessionStorage is cleared, refetch plan
      if (e.key === null || e.key === CACHE_KEY) {
        fetchUserPlan(true)
      }
    }

    // Listen for storage events (from other tabs/windows)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [fetchUserPlan])

  const isFree = plan === "free" || plan === null
  const isPro = plan === "pro"

  const value: UserPlanContextType = {
    plan,
    isFree,
    isPro,
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
    // Return default values if used outside provider (graceful fallback)
    return {
      plan: "free",
      isFree: true,
      isPro: false,
      isLoading: false,
      error: null,
      refetch: async () => {},
    }
  }
  return context
}

