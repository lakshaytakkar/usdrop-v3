// Unified Category Types

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parent_category_id: string | null
  parent_category?: Category
  trending: boolean
  product_count: number
  avg_profit_margin: number | null
  growth_percentage: number | null
  created_at: string
  updated_at: string
  
  // Computed/joined fields
  subcategories?: Category[]
}

// API Response Types
export interface CategoriesResponse {
  categories: Category[]
  total: number
}

export interface CategoryResponse {
  category: Category
}

// Query Parameters
export interface CategoriesQueryParams {
  parent_category_id?: string | null
  trending?: boolean
  search?: string
  include_subcategories?: boolean
}

// For backward compatibility
export type ProductCategory = Category

