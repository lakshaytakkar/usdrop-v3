/**
 * Unified types for Competitor Stores
 */

export interface CompetitorStore {
  id: string
  name: string
  url: string
  logo?: string | null
  category_id?: string | null
  category?: {
    id: string
    name: string
    slug: string
  } | null
  country?: string | null
  monthly_traffic: number
  monthly_revenue: number | null
  growth: number
  products_count?: number | null
  rating?: number | null
  verified: boolean
  created_at: string
  updated_at: string
}

export interface CompetitorStoreProduct {
  id: string
  competitor_store_id: string
  product_id: string
  discovered_at: string
  last_seen_at: string
  competitor_store?: CompetitorStore
  product?: {
    id: string
    title: string
    image: string
  }
}

export interface CompetitorStoreQueryParams {
  category_id?: string
  country?: string
  search?: string
  verified?: boolean
  sortBy?: 'name' | 'monthly_revenue' | 'monthly_traffic' | 'growth' | 'rating' | 'created_at'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

// Transform types for external page (camelCase)
export interface CompetitorStoreExternal {
  id: number | string
  name: string
  url: string
  logo?: string
  category: string
  monthlyRevenue: number
  monthlyTraffic: number
  growth: number
  country: string
  products: number
  rating: number
  verified: boolean
}

