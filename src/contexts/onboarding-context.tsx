"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { OnboardingStatus } from "@/types/onboarding"

interface OnboardingContextType {
  isComplete: boolean
  progressPercentage: number
  completedVideos: number
  totalVideos: number
  completedModules: number
  totalModules: number
  
  plan: string | null
  isFree: boolean
  isPro: boolean
  isAdmin: boolean
  internalRole: string | null
  
  isLoading: boolean
  error: string | null
  
  refetch: () => Promise<void>
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

interface OnboardingProviderProps {
  children: ReactNode
}

const ADMIN_ROLES = ["admin", "super_admin", "editor", "moderator"]

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [status, setStatus] = useState<OnboardingStatus | null>(null)
  const [plan, setPlan] = useState<string | null>(null)
  const [internalRole, setInternalRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch both in parallel
      const [statusResponse, userResponse] = await Promise.all([
        fetch("/api/onboarding/status"),
        fetch("/api/auth/user")
      ])

      // Handle onboarding status
      if (statusResponse.ok) {
        // Check if response is JSON before parsing
        const statusContentType = statusResponse.headers.get("content-type")
        if (statusContentType && statusContentType.includes("application/json")) {
          try {
            const statusData: OnboardingStatus = await statusResponse.json()
            setStatus(statusData)
          } catch (parseError) {
            console.warn("Failed to parse onboarding status JSON:", parseError)
            // Set defaults on parse error
            setStatus({
              onboarding_completed: false,
              onboarding_completed_at: null,
              onboarding_progress: 0,
              completed_videos: 0,
              total_videos: 6,
              completed_modules: 0,
              total_modules: 6,
            })
          }
        } else {
          // Not JSON, set defaults
          setStatus({
            onboarding_completed: false,
            onboarding_completed_at: null,
            onboarding_progress: 0,
            completed_videos: 0,
            total_videos: 6,
            completed_modules: 0,
            total_modules: 6,
          })
        }
      } else {
        // Default values if API fails
        setStatus({
          onboarding_completed: false,
          onboarding_completed_at: null,
          onboarding_progress: 0,
          completed_videos: 0,
          total_videos: 6,
          completed_modules: 0,
          total_modules: 6,
        })
      }

      // Handle user plan
      if (userResponse.ok) {
        // Check if response is JSON before parsing
        const userContentType = userResponse.headers.get("content-type")
        if (userContentType && userContentType.includes("application/json")) {
          try {
            const userData = await userResponse.json()
            setPlan(userData.plan || "free")
            setInternalRole(userData.user?.internal_role || null)
          } catch (parseError) {
            console.warn("Failed to parse user data JSON:", parseError)
            setPlan("free")
            setInternalRole(null)
          }
        } else {
          setPlan("free")
        }
      } else {
        setPlan("free")
      }
    } catch (err) {
      console.error("Error fetching onboarding data:", err)
      setError(err instanceof Error ? err.message : "Failed to load data")
      // Set defaults on error
      setPlan("free")
      setStatus({
        onboarding_completed: false,
        onboarding_completed_at: null,
        onboarding_progress: 0,
        completed_videos: 0,
        total_videos: 6,
        completed_modules: 0,
        total_modules: 6,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const isAdminUser = internalRole != null && ADMIN_ROLES.includes(internalRole)
  const isFreeUser = !isAdminUser && (plan === "free" || plan === null)

  const value: OnboardingContextType = {
    isComplete: isFreeUser ? false : (status?.onboarding_completed || false),
    progressPercentage: status?.onboarding_progress || 0,
    completedVideos: status?.completed_videos || 0,
    totalVideos: status?.total_videos || 6,
    completedModules: status?.completed_modules || 0,
    totalModules: status?.total_modules || 6,
    plan,
    isFree: isFreeUser,
    isPro: isAdminUser || plan === "pro",
    isAdmin: isAdminUser,
    internalRole,
    isLoading,
    error,
    refetch: fetchData,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding(): OnboardingContextType {
  const context = useContext(OnboardingContext)
  if (!context) {
    // Return default values if used outside provider (graceful fallback)
    return {
      isComplete: false,
      progressPercentage: 0,
      completedVideos: 0,
      totalVideos: 6,
      completedModules: 0,
      totalModules: 6,
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

