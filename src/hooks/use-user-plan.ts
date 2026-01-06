"use client"

import { useUserPlanContext } from "@/contexts/user-plan-context"

interface UseUserPlanReturn {
  plan: string | null
  isFree: boolean
  isPro: boolean
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to access user plan information
 * Now uses shared context to avoid duplicate API calls
 */
export function useUserPlan(): UseUserPlanReturn {
  const { plan, isFree, isPro, isLoading, error, refetch } = useUserPlanContext()

  return {
    plan,
    isFree,
    isPro,
    isLoading,
    error,
    refetch,
  }
}

