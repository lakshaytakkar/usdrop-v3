import { ShopifyStore } from "@/pages/shopify-stores/data/stores"

// Generate 200+ diverse stores
const niches = [
  "Fashion", "Electronics", "Home & Decor", "Beauty", "Sports", "Books",
  "Toys", "Food & Beverage", "Health & Wellness", "Pet Supplies", "Automotive",
  "Jewelry", "Art & Crafts", "Garden", "Office Supplies", "Music", "Travel",
  "Baby Products", "Fitness", "Outdoor", "Photography", "Gaming", "Software"
]

const countries = ["US", "CA", "UK", "AU", "DE", "FR", "IT", "ES", "NL", "SE", "NO", "DK", "JP", "CN", "IN", "BR", "MX"]

const plans: Array<"basic" | "shopify" | "advanced" | "plus"> = ["basic", "shopify", "advanced", "plus"]

const statuses: Array<"connected" | "disconnected" | "syncing" | "error"> = ["connected", "disconnected", "syncing", "error"]

const syncStatuses: Array<"success" | "failed" | "pending" | "never"> = ["success", "failed", "pending", "never"]

const currencies = ["USD", "CAD", "GBP", "EUR", "AUD", "JPY", "CNY", "INR"]

// Generate random date within last 6 months
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString()
}

// Generate random number in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate store name
function generateStoreName(niche: string, index: number): string {
  const prefixes = ["Premium", "Elite", "Modern", "Classic", "Trendy", "Vintage", "Luxury", "Smart", "Pro", "Ultra"]
  const suffixes = ["Store", "Shop", "Boutique", "Market", "Hub", "Outlet", "Gallery", "Collection", "World", "Plus"]
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  return `${prefix} ${niche} ${suffix} ${index > 0 ? index : ""}`.trim()
}

// Generate store URL
function generateStoreUrl(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 30) + ".myshopify.com"
}

// Generate user data
function generateUser(index: number) {
  const names = [
    "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "David Wilson",
    "Jessica Martinez", "Christopher Anderson", "Amanda Taylor", "Matthew Thomas",
    "Ashley Jackson", "Daniel White", "Melissa Harris", "James Martin", "Nicole Thompson",
    "Robert Garcia", "Michelle Martinez", "William Robinson", "Laura Clark", "Joseph Rodriguez",
    "Stephanie Lewis", "Charles Lee", "Rebecca Walker", "Thomas Hall", "Kimberly Allen"
  ]
  const name = names[index % names.length]
  const email = name.toLowerCase().replace(" ", ".") + index + "@example.com"
  return {
    id: `user-${String(index + 1).padStart(3, "0")}`,
    email,
    full_name: name
  }
}

/**
 * @deprecated This file is deprecated - use the API endpoint /api/admin/shopify-stores instead
 * Keeping this temporarily for backward compatibility
 * TODO: Remove all references to adminSampleStores
 * 
 * To seed Shopify stores, use: npx tsx scripts/seed-shopify-stores.ts
 */
// Generate stores
export const adminSampleStores: ShopifyStore[] = Array.from({ length: 220 }, (_, index) => {
  const niche = niches[index % niches.length]
  const country = countries[index % countries.length]
  const plan = plans[index % plans.length]
  const status = statuses[index % statuses.length]
  const syncStatus = syncStatuses[index % syncStatuses.length]
  const currency = currencies[index % currencies.length]
  const user = generateUser(index)
  
  const now = new Date()
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
  const connectedAt = randomDate(sixMonthsAgo, now)
  const lastSyncedAt = status === "connected" && syncStatus !== "never" 
    ? randomDate(new Date(connectedAt), now) 
    : null
  
  const productsCount = randomInt(0, 500)
  const monthlyRevenue = status === "connected" ? randomInt(1000, 200000) : randomInt(0, 50000)
  const monthlyTraffic = status === "connected" ? randomInt(500, 50000) : randomInt(0, 10000)
  
  const storeName = generateStoreName(niche, index)
  const url = generateStoreUrl(storeName)
  
  return {
    id: `store-${String(index + 1).padStart(3, "0")}`,
    user_id: user.id,
    name: storeName,
    url,
    status,
    connected_at: connectedAt,
    last_synced_at: lastSyncedAt,
    sync_status: syncStatus,
    api_key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
    access_token: `shpat_${Math.random().toString(36).substring(2, 20)}`,
    products_count: productsCount,
    monthly_revenue: monthlyRevenue,
    monthly_traffic: monthlyTraffic,
    niche,
    country,
    currency,
    plan,
    user,
    created_at: connectedAt,
    updated_at: lastSyncedAt || connectedAt,
    // Legacy compatibility
    connectedAt
  }
})
