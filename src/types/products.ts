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

// For backward compatibility - can be used during migration
export type ProductPick = Product
export type WinningProduct = Product & { metadata: ProductMetadata & { is_winning: true } }
export type HandPickedProduct = Product & { source: ProductSource & { source_type: 'hand_picked' } }

