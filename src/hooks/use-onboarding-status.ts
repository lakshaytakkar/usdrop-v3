"use client"

import { useState, useEffect, useCallback } from "react"
import { OnboardingStatus } from "@/types/onboarding"

interface UseOnboardingStatusReturn {
  isComplete: boolean
  progressPercentage: number
  completedVideos: number
  totalVideos: number
  completedModules: number
  totalModules: number
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  status: OnboardingStatus | null
}

// Simple in-memory cache
let cache: {
  data: OnboardingStatus | null
  timestamp: number | null
} = {
  data: null,
  timestamp: null,
}

const CACHE_DURATION = 30000 // 30 seconds

export function useOnboardingStatus(): UseOnboardingStatusReturn {
  const [status, setStatus] = useState<OnboardingStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check cache first
      const now = Date.now()
      if (
        cache.data &&
        cache.timestamp &&
        now - cache.timestamp < CACHE_DURATION
      ) {
        setStatus(cache.data)
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/onboarding/status")
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `HTTP ${response.status}: Failed to fetch onboarding status`
        throw new Error(errorMessage)
      }

      const data: OnboardingStatus = await response.json()
      
      // Update cache
      cache.data = data
      cache.timestamp = now

      setStatus(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load onboarding status"
      setError(errorMessage)
      console.error("Error fetching onboarding status:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  return {
    isComplete: status?.onboarding_completed || false,
    progressPercentage: status?.onboarding_progress || 0,
    completedVideos: status?.completed_videos || 0,
    totalVideos: status?.total_videos || 0,
    completedModules: status?.completed_modules || 0,
    totalModules: status?.total_modules || 0,
    isLoading,
    error,
    refetch: fetchStatus,
    status,
  }
}

