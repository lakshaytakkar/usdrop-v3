export interface TrafficSource {
  type: "direct" | "search" | "social" | "referrals"
  percentage: number
  value?: number
}

export interface StoreProduct {
  id: string
  name: string
  image: string
  price?: number
  addedDate?: string
}

export interface StoreResearchData {
  storeUrl: string
  storeName?: string
  popularityRank: number
  growth: number // percentage
  category: string
  trafficSources: TrafficSource[]
  monthlyRevenue?: number
  monthlyTraffic?: number
  hasInsufficientData?: boolean
  products: StoreProduct[]
}

// Sample data for demonstration
export const getStoreResearchData = async (
  storeUrl: string
): Promise<StoreResearchData | null> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return sample data
  return {
    storeUrl: storeUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    storeName: "Example Store",
    popularityRank: 12345,
    growth: 15.5,
    category: "Fashion",
    trafficSources: [
      { type: "direct", percentage: 35, value: 35000 },
      { type: "search", percentage: 40, value: 40000 },
      { type: "social", percentage: 20, value: 20000 },
      { type: "referrals", percentage: 5, value: 5000 },
    ],
    monthlyRevenue: 125000,
    monthlyTraffic: 100000,
    hasInsufficientData: false,
    products: [
      {
        id: "prod-1",
        name: "Premium T-Shirt",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        price: 29.99,
        addedDate: "2024-01-15",
      },
      {
        id: "prod-2",
        name: "Designer Jeans",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        price: 79.99,
        addedDate: "2024-01-14",
      },
      {
        id: "prod-3",
        name: "Casual Sneakers",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        price: 59.99,
        addedDate: "2024-01-13",
      },
      {
        id: "prod-4",
        name: "Winter Jacket",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        price: 129.99,
        addedDate: "2024-01-12",
      },
    ],
  }
}

