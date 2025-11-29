import { HandPickedProduct, ProductPick } from "@/types/admin/products"
import { productPicks as realProductPicks } from "@/data/product-picks"

export const sampleHandPickedProducts: HandPickedProduct[] = [
  {
    id: "hp_001",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
    title: "Premium Wireless Earbuds",
    profit_margin: 45,
    pot_revenue: 12500,
    category: "gadgets",
    is_locked: false,
    found_date: "2024-01-15",
    filters: ["wireless", "audio"],
    description: "High-quality wireless earbuds with noise cancellation",
    supplier_info: { name: "Tech Supplier Co", min_order: 50 },
    unlock_price: 9.99,
    detailed_analysis: "Strong market demand, high profit margins",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "hp_002",
    image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400",
    title: "Smart Fitness Watch",
    profit_margin: 52,
    pot_revenue: 18900,
    category: "sports-fitness",
    is_locked: true,
    found_date: "2024-01-14",
    filters: ["fitness", "wearable"],
    description: "Advanced fitness tracking watch with heart rate monitor",
    supplier_info: { name: "Fitness Gear Pro", min_order: 30 },
    unlock_price: 14.99,
    detailed_analysis: "Trending product with excellent reviews",
    created_at: "2024-01-14T14:00:00Z",
    updated_at: "2024-01-14T14:00:00Z",
  },
  {
    id: "hp_003",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    title: "Modern Wall Art Set",
    profit_margin: 38,
    pot_revenue: 8500,
    category: "home-decor",
    is_locked: false,
    found_date: "2024-01-13",
    filters: ["decor", "art"],
    description: "Contemporary wall art pieces for modern homes",
    supplier_info: { name: "Home Decor Plus", min_order: 20 },
    unlock_price: 7.99,
    detailed_analysis: "Good profit margin, steady demand",
    created_at: "2024-01-13T09:00:00Z",
    updated_at: "2024-01-13T09:00:00Z",
  },
]

// Use real product picks data from CSV processing
export const sampleProductPicks: ProductPick[] = realProductPicks.map((pick) => ({
  ...pick,
  // Ensure supplier is properly typed (it's null in our data, but the type expects an object)
  supplier: pick.supplier_id ? {
    id: pick.supplier_id,
    name: "Supplier",
    company_name: null,
    logo: null,
  } : undefined,
}))





