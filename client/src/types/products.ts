// Unified Product Types
// Replaces ProductPick, WinningProduct, HandPickedProduct

import { Category } from './categories'

export type ProductSourceType = 'scraped' | 'ai_standardized' | 'manual' | 'hand_picked'

export interface Product {
  id: string
  title: string
  image: string
  description: string | null
  category_id: string | null
  category?: Category
  buy_price: number
  sell_price: number
  profit_per_order: number
  additional_images: string[]
  specifications: Record<string, any> | null
  rating: number | null
  reviews_count: number
  trend_data: number[]
  supplier_id: string | null
  supplier?: Supplier
  created_at: string
  updated_at: string
  
  // Joined from product_metadata
  metadata?: ProductMetadata
  
  // Joined from product_source
  source?: ProductSource
}

export interface ProductMetadata {
  id: string
  product_id: string
  is_winning: boolean
  is_locked: boolean
  unlock_price: number | null
  profit_margin: number | null
  pot_revenue: number | null
  revenue_growth_rate: number | null
  items_sold: number | null
  avg_unit_price: number | null
  revenue_trend: number[]
  found_date: string | null
  detailed_analysis: string | null
  filters: string[]
  created_at: string
  updated_at: string
}

export interface ProductSource {
  id: string
  product_id: string
  source_type: ProductSourceType
  source_id: string | null
  standardized_at: string | null
  standardized_by: string | null
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  name: string
  company_name: string | null
  logo: string | null
  created_at: string
  updated_at: string
}

// API Response Types
export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ProductResponse {
  product: Product
}

// Query Parameters
export interface ProductsQueryParams {
  source_type?: ProductSourceType
  is_winning?: boolean
  is_locked?: boolean
  category_id?: string
  search?: string
  page?: number
  pageSize?: number
  sortBy?: 'created_at' | 'sell_price' | 'profit_per_order' | 'rating'
  sortOrder?: 'asc' | 'desc'
}

// Product Research Types
export interface ProductResearch {
  id: string
  product_id: string
  competitor_pricing: {
    competitors: Array<{name: string, price: number | string, url?: string}>
    price_range: {min: number | string, max: number | string, avg: number | string}
  } | null
  seasonal_demand: string | null
  audience_targeting: {
    demographics: {age: string, gender: string}
    interests: string[]
    suggestions: string[]
  } | null
  supplier_notes: string | null
  social_proof: {
    likes: number
    comments: number
    shares: number
    virality_score: number
  } | null
  fulfillment: {
    total_price: number
    product_cost: number
    shipping_cost: number
    shipping_days: string
  } | null
  complements: Array<{name?: string, title?: string, url?: string, image?: string}> | null
  profit_calculator: {
    pc_ratio: number | null
    other_fees: number | null
    product_cost: number | null
    profit_margin: number | null
    selling_price: number | null
    shipping_cost: number | null
    break_even_roas: number | null
    net_profit_per_sale: number | null
  } | null
  demand_saturation: {
    stores_selling_count: number
    saturation_level?: string
    monthly_searches?: number
    competition_score?: number
  } | null
  amazon_reviews: Array<{rating?: number, text?: string, title?: string}> | null
  instagram_influencers: Array<{name?: string, followers?: number, url?: string}> | null
  research_date: string
  created_at: string
  updated_at: string
}

export interface CompetitorStore {
  id: string
  name: string
  url: string
  logo: string | null
  category_id: string | null
  category?: {id: string, name: string, slug: string} | null
  country: string | null
  monthly_traffic: number | null
  monthly_revenue: number | null
  growth: number | null
  products_count: number | null
  rating: number | null
  verified: boolean
}

// For backward compatibility - can be used during migration
export type ProductPick = Product
export type WinningProduct = Product & { metadata: ProductMetadata & { is_winning: true } }
export type HandPickedProduct = Product & { source: ProductSource & { source_type: 'hand_picked' } }

