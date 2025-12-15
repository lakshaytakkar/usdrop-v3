// Shopify store helper functions for mapping database responses to TypeScript interfaces

import { ShopifyStore } from "@/app/shopify-stores/data/stores"

/**
 * Database shopify_stores row with user relationship
 */
export interface ShopifyStoreRow {
  id: string
  user_id: string
  name: string
  url: string
  logo: string | null
  status: string
  connected_at: string | null
  last_synced_at: string | null
  sync_status: string
  api_key: string | null
  access_token: string | null
  shopify_store_id: string | null
  products_count: number
  monthly_revenue: number | null
  monthly_traffic: number | null
  niche: string | null
  country: string | null
  currency: string
  plan: string
  created_at: string
  updated_at: string
  profiles?: {
    id: string
    email: string
    full_name: string | null
  } | null
}

/**
 * Map database store row to ShopifyStore interface
 */
export function mapShopifyStoreFromDB(data: ShopifyStoreRow): ShopifyStore {
  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    url: data.url,
    logo: data.logo || undefined,
    status: data.status as "connected" | "disconnected" | "syncing" | "error",
    connected_at: data.connected_at || new Date().toISOString(),
    last_synced_at: data.last_synced_at,
    sync_status: data.sync_status as "success" | "failed" | "pending" | "never",
    api_key: data.api_key || "",
    access_token: data.access_token || "",
    products_count: data.products_count || 0,
    monthly_revenue: data.monthly_revenue ? Number(data.monthly_revenue) : null,
    monthly_traffic: data.monthly_traffic || null,
    niche: data.niche || null,
    country: data.country || null,
    currency: data.currency || "USD",
    plan: data.plan as "basic" | "shopify" | "advanced" | "plus",
    user: data.profiles
      ? {
          id: data.profiles.id,
          email: data.profiles.email,
          full_name: data.profiles.full_name,
        }
      : undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
    // Legacy compatibility
    connectedAt: data.connected_at || undefined,
  }
}

/**
 * Map ShopifyStore to database format for updates
 */
export function mapShopifyStoreToDB(store: Partial<ShopifyStore>): Partial<ShopifyStoreRow> {
  const dbStore: Partial<ShopifyStoreRow> = {}

  if (store.name !== undefined) dbStore.name = store.name
  if (store.url !== undefined) dbStore.url = store.url
  if (store.logo !== undefined) dbStore.logo = store.logo || null
  if (store.status !== undefined) dbStore.status = store.status
  if (store.connected_at !== undefined) dbStore.connected_at = store.connected_at || null
  if (store.last_synced_at !== undefined) dbStore.last_synced_at = store.last_synced_at || null
  if (store.sync_status !== undefined) dbStore.sync_status = store.sync_status
  if (store.api_key !== undefined) dbStore.api_key = store.api_key || null
  if (store.access_token !== undefined) dbStore.access_token = store.access_token || null
  if (store.products_count !== undefined) dbStore.products_count = store.products_count
  if (store.monthly_revenue !== undefined) dbStore.monthly_revenue = store.monthly_revenue ?? null
  if (store.monthly_traffic !== undefined) dbStore.monthly_traffic = store.monthly_traffic || null
  if (store.niche !== undefined) dbStore.niche = store.niche || null
  if (store.country !== undefined) dbStore.country = store.country || null
  if (store.currency !== undefined) dbStore.currency = store.currency
  if (store.plan !== undefined) dbStore.plan = store.plan

  return dbStore
}

/**
 * Normalize Shopify store URL format
 * Converts various formats to standard: storename.myshopify.com
 */
export function normalizeShopifyStoreUrl(url: string): string {
  let normalized = url.trim().toLowerCase()
  
  // Remove protocol if present
  normalized = normalized.replace(/^https?:\/\//, "")
  
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, "")
  
  // If it doesn't include .myshopify.com, add it
  if (!normalized.includes(".")) {
    normalized = `${normalized}.myshopify.com`
  } else if (!normalized.includes(".myshopify.com")) {
    // If it has a domain but not myshopify.com, extract the subdomain
    const match = normalized.match(/^([a-zA-Z0-9-]+)/)
    if (match) {
      normalized = `${match[1]}.myshopify.com`
    }
  }
  
  return normalized
}

/**
 * Validate Shopify store URL format
 */
export function validateShopifyStoreUrl(url: string): boolean {
  if (!url || !url.trim()) return false
  
  const normalized = normalizeShopifyStoreUrl(url)
  const shopifyPattern = /^[a-zA-Z0-9-]+\.myshopify\.com$/
  
  return shopifyPattern.test(normalized)
}

/**
 * Mask API key for UI display
 * Shows first 4 and last 4 characters, masks the rest
 */
export function maskApiKey(key: string | null | undefined): string {
  if (!key || key.length === 0) return "••••••••"
  
  if (key.length <= 8) {
    return "•".repeat(key.length)
  }
  
  const start = key.substring(0, 4)
  const end = key.substring(key.length - 4)
  const masked = "•".repeat(Math.max(0, key.length - 8))
  
  return `${start}${masked}${end}`
}

/**
 * Mask access token for UI display
 * Shows first 4 and last 4 characters, masks the rest
 */
export function maskAccessToken(token: string | null | undefined): string {
  if (!token || token.length === 0) return "••••••••"
  
  if (token.length <= 8) {
    return "•".repeat(token.length)
  }
  
  const start = token.substring(0, 4)
  const end = token.substring(token.length - 4)
  const masked = "•".repeat(Math.max(0, token.length - 8))
  
  return `${start}${masked}${end}`
}

