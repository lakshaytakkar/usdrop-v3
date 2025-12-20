import { SubscriptionPlan } from "@/types/admin/plans"

/**
 * @deprecated This file is deprecated - use the API endpoint /api/admin/plans instead
 * Keeping this temporarily for backward compatibility
 * TODO: Remove all references to this file
 * 
 * To seed subscription plans, use: npx tsx scripts/seed-subscription-plans.ts
 */
export const samplePlans: SubscriptionPlan[] = [
  {
    id: "plan_001",
    name: "Free",
    slug: "free",
    description: "Access to My Dashboard only",
    priceMonthly: 0,
    priceAnnual: null,
    priceYearly: null,
    features: [
      "My Dashboard access",
      "Basic profile management",
      "View-only mode for locked features",
    ],
    popular: false,
    active: true,
    isPublic: true,
    displayOrder: 1,
    keyPointers: null,
    trialDays: 0,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-15T10:00:00Z"),
  },
  {
    id: "plan_002",
    name: "Pro",
    slug: "pro",
    description: "Full access to all platform features",
    priceMonthly: 29.99,
    priceAnnual: 299.90,
    priceYearly: 299.90,
    features: [
      "Full platform access",
      "Product Hunt & Winning Products",
      "Competitor Stores analysis",
      "AI Toolkit suite",
      "AI Studio tools",
      "Shipping Calculator",
      "Private Suppliers",
      "Academy & Intelligence",
      "Priority support",
      "Export capabilities",
    ],
    popular: true,
    active: true,
    isPublic: true,
    displayOrder: 2,
    keyPointers: "Full access to everything",
    trialDays: 7,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-20T14:30:00Z"),
  },
]

