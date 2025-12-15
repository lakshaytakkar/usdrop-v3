// Admin User Types

export type InternalUserRole = "superadmin" | "admin" | "manager" | "executive"
export type ExternalUserPlan = "free" | "trial" | "basic" | "pro" | "enterprise" | "premium" | string
export type UserStatus = "active" | "inactive" | "suspended"
export type PermissionLevel = "trial" | "hidden" | "locked" | "limited_access" | "full_access"

export interface InternalUser {
  id: string
  name: string
  email: string
  role: InternalUserRole
  status: UserStatus
  createdAt: Date
  updatedAt: Date
  phoneNumber?: string
  username?: string
  avatarUrl?: string
}

export interface ExternalUser {
  id: string
  name: string
  email: string
  plan: ExternalUserPlan
  status: UserStatus
  subscriptionDate: Date
  expiryDate: Date
  createdAt: Date
  updatedAt: Date
  isTrial?: boolean
  trialEndsAt?: Date | null
  subscriptionStatus?: string
  credits?: number
  phoneNumber?: string
  username?: string
  avatarUrl?: string
}

export interface Activity {
  id: string
  type: "subscription" | "login" | "feature_usage" | "plan_change" | "visibility_change" | "other"
  description: string
  timestamp: Date
  metadata?: Record<string, any>
}

