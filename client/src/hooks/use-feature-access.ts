import { useRoleAccess } from "./use-role-access"

interface UseFeatureAccessReturn {
  canAccess: boolean
  isLoading: boolean
  isFree: boolean
  isPro: boolean
  isMentorship: boolean
  plan: string | null
}

export function useFeatureAccess(): UseFeatureAccessReturn {
  const { plan, isFree, isPro, loading } = useRoleAccess()

  const normalizedPlan = plan?.toLowerCase() || 'free';
  const isMentorship = normalizedPlan === 'mentorship';

  return {
    canAccess: isPro || isMentorship,
    isLoading: loading,
    isFree: !isPro && !isMentorship,
    isPro,
    isMentorship,
    plan,
  }
}

export const FREE_ACCESS_PATHS = [
  "/framework",
  "/mentorship",
  "/settings",
  "/profile",
  "/framework/my-roadmap",
  "/framework/my-profile",
  "/framework/my-credentials",
  "/free-learning",
]

export function isPathFreeAccess(pathname: string): boolean {
  return FREE_ACCESS_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
}
