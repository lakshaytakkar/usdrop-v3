"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { OnboardingStatus } from "@/types/onboarding"

interface OnboardingContextType {
  // Onboarding status
  isComplete: boolean
  progressPercentage: number
  completedVideos: number
  totalVideos: number
  completedModules: number
  totalModules: number
  
  // User plan
  plan: string | null
  isFree: boolean
  
  // Loading state
  isLoading: boolean
  error: string | null
  
  // Actions
  refetch: () => Promise<void>
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

interface OnboardingProviderProps {
  children: ReactNode
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [status, setStatus] = useState<OnboardingStatus | null>(null)
  const [plan, setPlan] = useState<string | null>(null)
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
        const statusData: OnboardingStatus = await statusResponse.json()
        setStatus(statusData)
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
        const userData = await userResponse.json()
        setPlan(userData.plan || "free")
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

  const value: OnboardingContextType = {
    isComplete: status?.onboarding_completed || false,
    progressPercentage: status?.onboarding_progress || 0,
    completedVideos: status?.completed_videos || 0,
    totalVideos: status?.total_videos || 6,
    completedModules: status?.completed_modules || 0,
    totalModules: status?.total_modules || 6,
    plan,
    isFree: plan === "free" || plan === null,
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
      isLoading: false,
      error: null,
      refetch: async () => {},
    }
  }
  return context
}

