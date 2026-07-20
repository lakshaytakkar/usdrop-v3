import { PawPrint, Smartphone, Shirt, Home, Dumbbell, Sparkles, Grid3x3 } from "lucide-react"

/* Phase I — "Build Your Store" (Elite). On-brand (USDrop blue/indigo). */

export interface StoreBuildRequest {
  id: string
  user_id: string
  niche: string
  store_name: string | null
  tagline: string | null
  brand_color: string | null
  products_count: number
  status: BuildStatus
  store_url: string | null
  store_login: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type BuildStatus = "requested" | "building" | "ready" | "delivered" | "cancelled"

export interface Niche {
  key: string
  label: string
  blurb: string
  icon: typeof PawPrint
  gradient: string
  popularity: number
}

export const NICHES: Niche[] = [
  { key: "pets", label: "Pets", blurb: "High-repeat buyers, viral products.", icon: PawPrint, gradient: "from-blue-500 to-indigo-600", popularity: 96 },
  { key: "electronics", label: "Electronics & Gadgets", blurb: "Impulse-buy gadgets that scale fast.", icon: Smartphone, gradient: "from-indigo-500 to-blue-600", popularity: 94 },
  { key: "fashion", label: "Fashion & Apparel", blurb: "Evergreen demand, strong margins.", icon: Shirt, gradient: "from-sky-500 to-indigo-600", popularity: 92 },
  { key: "home-garden", label: "Home & Garden", blurb: "Problem-solving home upgrades.", icon: Home, gradient: "from-blue-600 to-violet-600", popularity: 90 },
  { key: "sports-fitness", label: "Sports & Fitness", blurb: "Passionate, motivated buyers.", icon: Dumbbell, gradient: "from-cyan-500 to-blue-600", popularity: 88 },
  { key: "beauty", label: "Beauty & Skincare", blurb: "Subscription-friendly, loyal customers.", icon: Sparkles, gradient: "from-violet-500 to-indigo-600", popularity: 91 },
  { key: "general", label: "General / Mixed", blurb: "A broad catalog across categories.", icon: Grid3x3, gradient: "from-slate-500 to-slate-700", popularity: 80 },
]

export function nicheLabel(key: string): string {
  return NICHES.find((n) => n.key === key)?.label || key
}

/* Representational build pipeline (team provisions until Partner provisioning is automated). */
export const BUILD_PIPELINE: BuildStatus[] = ["requested", "building", "ready", "delivered"]

export const BUILD_STATUS_META: Record<BuildStatus, { label: string; blurb: string }> = {
  requested: { label: "Requested", blurb: "We've got your brief and queued your build." },
  building: { label: "Building", blurb: "Assembling your theme, winning products and pages." },
  ready: { label: "Ready", blurb: "Your store is built — login details below." },
  delivered: { label: "Delivered", blurb: "Handed off to you. Time to start selling." },
  cancelled: { label: "Cancelled", blurb: "This build was cancelled." },
}

export function buildStatusIndex(s: BuildStatus): number {
  return BUILD_PIPELINE.indexOf(s)
}

export const BRAND_COLORS = ["#2E5BFF", "#6366F1", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#111827"]

/* What every Elite store build includes. */
export const BUILD_INCLUDES = [
  "A done-for-you Shopify store, built by our team",
  "10 proven winning products, ready to sell",
  "High-converting, on-brand theme",
  "Ready-to-sell product & policy pages",
  "Dropshipper LLC included (US company formation)",
  "China-warehouse fulfillment ready to go",
]
