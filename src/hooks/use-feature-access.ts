"use client"

import { useUserPlan } from "./use-user-plan"

interface UseFeatureAccessReturn {
  /** Whether the user can access Pro features */
  canAccess: boolean
  /** Whether access check is still loading */
  isLoading: boolean
  /** Whether user is on Free plan */
  isFree: boolean
  /** Whether user is on Pro plan */
  isPro: boolean
  /** Current plan slug */
  plan: string | null
}

/**
 * Hook to check if user has access to Pro features
 * Free users only have access to My Dashboard
 * Pro users have full access (except admin pages)
 */
export function useFeatureAccess(): UseFeatureAccessReturn {
  const { plan, isFree, isPro, isLoading } = useUserPlan()

  return {
    canAccess: isPro,
    isLoading,
    isFree,
    isPro,
    plan,
  }
}

/**
 * List of paths that are accessible to Free users
 * All other paths (except admin) require Pro
 */
export const FREE_ACCESS_PATHS = [
  "/my-dashboard",
  "/home",
  "/settings",
  "/profile",
]

/**
 * Check if a given path is accessible to Free users
 */
export function isPathFreeAccess(pathname: string): boolean {
  return FREE_ACCESS_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
}

