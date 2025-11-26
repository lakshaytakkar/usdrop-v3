// Admin Plan Types

export interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  description: string | null
  priceMonthly: number
  priceAnnual: number | null
  priceYearly: number | null
  features: string[]
  popular: boolean
  active: boolean
  isPublic: boolean
  displayOrder: number
  keyPointers: string | null
  trialDays: number
  createdAt: Date | null
  updatedAt: Date | null
}

export interface PlanFormData {
  name: string
  slug: string
  description?: string
  priceMonthly: number
  priceAnnual?: number
  priceYearly?: number
  features: string[]
  popular: boolean
  active: boolean
  isPublic: boolean
  displayOrder: number
  keyPointers?: string
  trialDays: number
  permissions?: Record<string, string>
  structuredFeatures?: any[]
}

