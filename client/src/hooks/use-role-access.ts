

import { useMemo } from "react"
import { useUnifiedUser } from "@/contexts/unified-user-context"
import { useUserPlan } from "./use-user-plan"
import { getUserPermissions, UserPermissions } from "@/lib/auth/get-user-permissions"

interface UseRoleAccessReturn extends UserPermissions {
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/**
 * Unified hook to read role/plan/capabilities from cached contexts.
 * - Hydrates from sessionStorage via UnifiedUserProvider and UserPlanProvider.
 * - Returns safe defaults (free external) on errors.
 */
export function useRoleAccess(): UseRoleAccessReturn {
  const { metadata, loading: metadataLoading, error: metadataError, refreshMetadata } = useUnifiedUser()
  const { plan, isFree, isPro, isLoading: planLoading, error: planError, refetch: refreshPlan } = useUserPlan()

  const permissions = useMemo(() => {
    return getUserPermissions({
      metadata,
      planOverride: plan ?? metadata?.plan ?? (isPro ? "pro" : isFree ? "free" : "free"),
    })
  }, [metadata, plan, isFree, isPro])

  const loading = metadataLoading || planLoading
  const error = metadataError ?? planError

  const refresh = async () => {
    await Promise.all([refreshMetadata(), refreshPlan()])
  }

  return {
    ...permissions,
    loading,
    error,
    refresh,
  }
}

