// User helper functions for mapping database responses to TypeScript interfaces

import { ExternalUser, InternalUser } from "@/types/admin/users"
import { SubscriptionPlan } from "@/types/admin/plans"

/**
 * Database profile row with subscription_plans relationship
 */
interface ProfileWithPlan {
  id: string
  full_name: string | null
  email: string
  internal_role: string | null
  status: string | null
  subscription_plan_id: string | null
  subscription_status: string | null
  subscription_started_at: string | null
  subscription_ends_at: string | null
  is_trial: boolean | null
  trial_ends_at: string | null
  credits: number | null
  phone_number: string | null
  username: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  subscription_plans?: {
    id: string
    name: string
    slug: string
    price_monthly?: number
    features?: string[]
    trial_days?: number
  } | null
}

/**
 * Map database profile row to ExternalUser interface
 */
export function mapExternalUserFromDB(data: ProfileWithPlan): ExternalUser {
  return {
    id: data.id,
    name: data.full_name || "",
    email: data.email,
    plan: data.subscription_plans?.slug || "free",
    status: (data.status as "active" | "inactive" | "suspended") || "active",
    subscriptionDate: data.subscription_started_at
      ? new Date(data.subscription_started_at)
      : new Date(data.created_at),
    expiryDate: data.subscription_ends_at
      ? new Date(data.subscription_ends_at)
      : new Date(data.created_at),
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    isTrial: data.is_trial || false,
    trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : null,
    subscriptionStatus: data.subscription_status || "active",
    credits: data.credits || 0,
    phoneNumber: data.phone_number || undefined,
    username: data.username || undefined,
    avatarUrl: data.avatar_url || undefined,
  }
}

/**
 * Map database profile row to InternalUser interface
 */
export function mapInternalUserFromDB(data: ProfileWithPlan): InternalUser {
  return {
    id: data.id,
    name: data.full_name || "",
    email: data.email,
    role: (data.internal_role as "superadmin" | "admin" | "manager" | "executive") || "executive",
    status: (data.status as "active" | "inactive" | "suspended") || "active",
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    phoneNumber: data.phone_number || undefined,
    username: data.username || undefined,
    avatarUrl: data.avatar_url || undefined,
  }
}

/**
 * Calculate subscription end date based on start date and plan
 */
export function calculateSubscriptionEndDate(
  startDate: Date,
  plan: SubscriptionPlan | null,
  billingPeriod: "monthly" | "annual" = "monthly"
): Date {
  const endDate = new Date(startDate)
  
  if (billingPeriod === "annual") {
    endDate.setFullYear(endDate.getFullYear() + 1)
  } else {
    endDate.setMonth(endDate.getMonth() + 1)
  }
  
  return endDate
}

/**
 * Calculate trial end date based on start date and plan trial days
 */
export function calculateTrialEndDate(
  startDate: Date,
  plan: SubscriptionPlan | null
): Date | null {
  if (!plan || plan.trialDays === 0) {
    return null
  }
  
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + plan.trialDays)
  
  return endDate
}

/**
 * Get plan details from relationship data
 */
export function getPlanDetails(data: ProfileWithPlan) {
  return data.subscription_plans
    ? {
        id: data.subscription_plans.id,
        name: data.subscription_plans.name,
        slug: data.subscription_plans.slug,
        priceMonthly: data.subscription_plans.price_monthly || 0,
        features: data.subscription_plans.features || [],
        trialDays: data.subscription_plans.trial_days || 0,
      }
    : null
}

