export interface ShopifyStore {
  id: string
  user_id: string // External user who owns this store
  name: string
  url: string
  status: "connected" | "disconnected" | "syncing" | "error"
  connected_at: string
  last_synced_at: string | null
  sync_status: "success" | "failed" | "pending" | "never"
  api_key: string // Store API key (masked in UI)
  access_token: string // Store access token (masked in UI)
  products_count: number
  monthly_revenue: number | null
  monthly_traffic: number | null
  niche: string | null
  country: string | null
  currency: string
  plan: "basic" | "shopify" | "advanced" | "plus"
  user?: {
    id: string
    email: string
    full_name: string | null
  }
  created_at: string
  updated_at: string
  // Legacy fields for backward compatibility
  connectedAt?: string
}

export interface StoreProduct {
  id: string
  store_id: string
  shopify_product_id: string
  title: string
  image: string
  price: number
  compare_at_price: number | null
  status: "active" | "draft" | "archived"
  inventory_count: number
  vendor: string | null
  product_type: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export const sampleStores: ShopifyStore[] = [
  {
    id: "store-001",
    name: "My Fashion Store",
    url: "myfashionstore.myshopify.com",
    status: "connected",
    connectedAt: "2024-01-15T10:30:00Z",
    user_id: "user-001",
    connected_at: "2024-01-15T10:30:00Z",
    last_synced_at: "2024-01-20T14:30:00Z",
    sync_status: "success",
    api_key: "sk_live_abc123",
    access_token: "shpat_xyz789",
    products_count: 150,
    monthly_revenue: 45000,
    monthly_traffic: 12000,
    niche: "Fashion",
    country: "US",
    currency: "USD",
    plan: "shopify",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "store-002",
    name: "Tech Gadgets Hub",
    url: "techgadgets.myshopify.com",
    status: "connected",
    connectedAt: "2024-01-10T14:20:00Z",
    user_id: "user-002",
    connected_at: "2024-01-10T14:20:00Z",
    last_synced_at: "2024-01-20T09:15:00Z",
    sync_status: "success",
    api_key: "sk_live_def456",
    access_token: "shpat_uvw012",
    products_count: 320,
    monthly_revenue: 89000,
    monthly_traffic: 25000,
    niche: "Electronics",
    country: "US",
    currency: "USD",
    plan: "advanced",
    created_at: "2024-01-10T14:20:00Z",
    updated_at: "2024-01-20T09:15:00Z",
  },
  {
    id: "store-003",
    name: "Home Decor Plus",
    url: "homedecorplus.myshopify.com",
    status: "disconnected",
    connectedAt: "2024-01-05T09:15:00Z",
    user_id: "user-003",
    connected_at: "2024-01-05T09:15:00Z",
    last_synced_at: "2024-01-18T11:20:00Z",
    sync_status: "failed",
    api_key: "sk_live_ghi789",
    access_token: "shpat_rst345",
    products_count: 85,
    monthly_revenue: 12000,
    monthly_traffic: 3500,
    niche: "Home & Decor",
    country: "CA",
    currency: "CAD",
    plan: "basic",
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-18T11:20:00Z",
  },
]

