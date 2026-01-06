import { UserMetadata } from "@/types/user-metadata"

export type UserRole =
  | "external_free"
  | "external_pro"
  | "internal_admin"
  | "internal_user"

export interface UserCapabilities {
  canAccessProTools: boolean
  canLoadMore: boolean
  canViewPremiumDetails: boolean
  canUseAiToolkitPro: boolean
}

export interface UserPermissions {
  role: UserRole
  plan: string
  isFree: boolean
  isPro: boolean
  capabilities: UserCapabilities
}

interface GetUserPermissionsParams {
  metadata?: UserMetadata | null
  planOverride?: string | null
}

const normalizePlan = (plan?: string | null) => {
  if (!plan) return "free"
  const slug = plan.toLowerCase()
  if (slug.includes("pro")) return "pro"
  if (slug.includes("paid") || slug.includes("premium")) return "pro"
  return "free"
}

/**
 * Map user metadata + plan to a frontend permission model.
 * Safe defaults: free external user with minimal capabilities.
 */
export function getUserPermissions(params: GetUserPermissionsParams = {}): UserPermissions {
  const { metadata, planOverride } = params

  const plan = normalizePlan(planOverride ?? metadata?.plan)
  const isPro = plan === "pro"
  const isFree = !isPro

  let role: UserRole = "external_free"

  if (metadata?.isInternal) {
    role = metadata.internalRole ? "internal_admin" : "internal_user"
  } else {
    role = isPro ? "external_pro" : "external_free"
  }

  const capabilities: UserCapabilities = {
    canAccessProTools: isPro,
    canLoadMore: isPro,
    canViewPremiumDetails: isPro,
    canUseAiToolkitPro: isPro,
  }

  return {
    role,
    plan,
    isFree,
    isPro,
    capabilities,
  }
}

