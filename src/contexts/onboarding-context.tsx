"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { OnboardingStatus } from "@/types/onboarding"
import { useUserPlanContext } from "@/contexts/user-plan-context"
import { useAuth } from "@/contexts/auth-context"

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

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [status, setStatus] = useState<OnboardingStatus | null>(null)
  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()
  const { plan, isFree, isPro, isAdmin, internalRole, isLoading: planLoading } = useUserPlanContext()

  const fetchOnboardingStatus = useCallback(async () => {
    if (!user) {
      setStatus(null)
      setIsLoadingOnboarding(false)
      return
    }

    try {
      setIsLoadingOnboarding(true)
      setError(null)

      const statusResponse = await fetch("/api/onboarding/status")

      if (statusResponse.ok) {
        const statusContentType = statusResponse.headers.get("content-type")
        if (statusContentType && statusContentType.includes("application/json")) {
          try {
            const statusData: OnboardingStatus = await statusResponse.json()
            setStatus(statusData)
          } catch (parseError) {
            console.warn("Failed to parse onboarding status JSON:", parseError)
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
    } catch (err) {
      console.error("Error fetching onboarding data:", err)
      setError(err instanceof Error ? err.message : "Failed to load data")
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
      setIsLoadingOnboarding(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    fetchOnboardingStatus()
  }, [authLoading, fetchOnboardingStatus])

  const value: OnboardingContextType = {
    isComplete: isFree ? false : (status?.onboarding_completed || false),
    progressPercentage: status?.onboarding_progress || 0,
    completedVideos: status?.completed_videos || 0,
    totalVideos: status?.total_videos || 6,
    completedModules: status?.completed_modules || 0,
    totalModules: status?.total_modules || 6,
    plan,
    isFree,
    isPro,
    isAdmin,
    internalRole,
    isLoading: authLoading || planLoading || isLoadingOnboarding,
    error,
    refetch: fetchOnboardingStatus,
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

