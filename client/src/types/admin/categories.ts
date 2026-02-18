export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  thumbnail: string | null
  parent_category_id: string | null
  trending: boolean
  product_count: number
  avg_profit_margin: number | null
  growth_percentage: number | null
  created_at: string
  updated_at: string
  // Joined data
  parent_category?: {
    id: string
    name: string
    slug: string
  }
}

























