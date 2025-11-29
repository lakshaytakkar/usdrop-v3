export interface HandPickedProduct {
  id: string
  image: string
  title: string
  profit_margin: number
  pot_revenue: number
  category: string
  is_locked: boolean
  found_date: string
  filters: string[] | null
  description: string | null
  supplier_info: Record<string, any> | null
  unlock_price: number | null
  detailed_analysis: string | null
  created_at: string
  updated_at: string
}

export interface ProductPick {
  id: string
  image: string
  title: string
  buy_price: number
  sell_price: number
  profit_per_order: number
  trend_data: number[] | null
  category: string
  rating: number | null
  reviews_count: number
  description: string | null
  supplier_id: string | null
  additional_images: string[] | null
  specifications: Record<string, any> | null
  created_at: string
  updated_at: string
  // Joined data
  supplier?: {
    id: string
    name: string
    company_name: string | null
    logo: string | null
  }
}

export type ProductCategory =
  | "fashion"
  | "home-decor"
  | "beauty"
  | "sports-fitness"
  | "kitchen"
  | "home-garden"
  | "gadgets"
  | "pets"
  | "mother-kids"
  | "other"







