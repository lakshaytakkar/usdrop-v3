export interface ProductPick {
  id: string;
  image: string;
  title: string;
  buy_price: number;
  sell_price: number;
  profit_per_order: number;
  trend_data: number[] | null;
  category: string;
  rating: number | null;
  reviews_count: number;
  description: string | null;
  supplier_id: string | null;
  additional_images: string[] | null;
  specifications: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export type ProductCategory =
  | "fashion"
  | "home-decor"
  | "beauty"
  | "sports-fitness"
  | "kitchen"
  | "gadgets"
  | "home-garden"
  | "pets"
  | "mother-kids"
  | string; // Allow other categories from CSV












