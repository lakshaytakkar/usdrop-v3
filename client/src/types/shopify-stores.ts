// Shopify Store Types

import { ShopifyStore } from "@/pages/shopify-stores/data/stores"

/**
 * Form data for creating/editing a Shopify store
 */
export interface ShopifyStoreFormData {
  name: string
  url: string
  logo?: string
  status?: "connected" | "disconnected" | "syncing" | "error"
  niche?: string
  country?: string
  currency?: string
  plan?: "basic" | "shopify" | "advanced" | "plus"
}

/**
 * OAuth state for Shopify OAuth flow
 */
export interface ShopifyOAuthState {
  state: string
  shop: string
  userId: string
  timestamp: number
}

/**
 * Shopify OAuth callback parameters
 */
export interface ShopifyOAuthCallbackParams {
  code: string
  state: string
  shop: string
  error?: string
  hmac?: string
}

/**
 * Response from OAuth initiation
 */
export interface ShopifyOAuthInitResponse {
  oauth_url: string
  state: string
}

