// Plan helper functions for mapping database responses to TypeScript interfaces

import { SubscriptionPlan } from "@/types/admin/plans"

/**
 * Database subscription_plans row
 */
export interface PlanRow {
  id: string
  name: string
  slug: string
  description: string | null
  price_monthly: number
  price_annual: number | null
  price_yearly: number | null
  features: string[] | null
  popular: boolean | null
  active: boolean | null
  is_public: boolean | null
  display_order: number | null
  key_pointers: string | null
  trial_days: number | null
  created_at: string
  updated_at: string
}

/**
 * Map database plan row to SubscriptionPlan interface
 */
export function mapPlanFromDB(data: PlanRow): SubscriptionPlan {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    priceMonthly: Number(data.price_monthly),
    priceAnnual: data.price_annual ? Number(data.price_annual) : null,
    priceYearly: data.price_yearly ? Number(data.price_yearly) : null,
    features: data.features || [],
    popular: data.popular || false,
    active: data.active ?? true,
    isPublic: data.is_public ?? true,
    displayOrder: data.display_order ?? 0,
    keyPointers: data.key_pointers,
    trialDays: data.trial_days ?? 0,
    createdAt: data.created_at ? new Date(data.created_at) : null,
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
  }
}

/**
 * Map SubscriptionPlan to database format for updates
 */
export function mapPlanToDB(plan: Partial<SubscriptionPlan>): Partial<PlanRow> {
  const dbPlan: Partial<PlanRow> = {}

  if (plan.name !== undefined) dbPlan.name = plan.name
  if (plan.slug !== undefined) dbPlan.slug = plan.slug
  if (plan.description !== undefined) dbPlan.description = plan.description ?? null
  if (plan.priceMonthly !== undefined) dbPlan.price_monthly = plan.priceMonthly
  if (plan.priceAnnual !== undefined) dbPlan.price_annual = plan.priceAnnual ?? null
  if (plan.priceYearly !== undefined) dbPlan.price_yearly = plan.priceYearly ?? null
  if (plan.features !== undefined) dbPlan.features = plan.features
  if (plan.popular !== undefined) dbPlan.popular = plan.popular
  if (plan.active !== undefined) dbPlan.active = plan.active
  if (plan.isPublic !== undefined) dbPlan.is_public = plan.isPublic
  if (plan.displayOrder !== undefined) dbPlan.display_order = plan.displayOrder
  if (plan.keyPointers !== undefined) dbPlan.key_pointers = plan.keyPointers ?? null
  if (plan.trialDays !== undefined) dbPlan.trial_days = plan.trialDays
  if (plan.updatedAt !== undefined && plan.updatedAt !== null) dbPlan.updated_at = plan.updatedAt.toISOString()

  return dbPlan
}

/**
 * Validate slug format (lowercase, alphanumeric, hyphens, underscores)
 */
export function validatePlanSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9_-]+$/
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100
}

/**
 * Generate slug from plan name
 * Converts to lowercase, replaces spaces with hyphens, removes special chars
 */
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100) // Limit length
}

