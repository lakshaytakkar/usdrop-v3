export interface CompetitorStore {
  id: string
  name: string
  url: string
  logo?: string
  category: string
  country?: string
  monthly_traffic: number
  monthly_revenue: number | null
  growth: number
  products_count?: number
  rating?: number
  verified: boolean
  created_at: string
  updated_at: string
}

export const sampleCompetitorStores: CompetitorStore[] = [
  {
    id: "cs_001",
    name: "TechGadgets Store",
    url: "techgadgets.com",
    category: "Electronics",
    country: "USA",
    monthly_traffic: 125000,
    monthly_revenue: 450000,
    growth: 15.5,
    products_count: 1250,
    rating: 4.8,
    verified: true,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "cs_002",
    name: "Fashion Forward",
    url: "fashionforward.com",
    category: "Fashion",
    country: "UK",
    monthly_traffic: 89000,
    monthly_revenue: 320000,
    growth: 22.3,
    products_count: 890,
    rating: 4.6,
    verified: true,
    created_at: "2024-01-09T00:00:00Z",
    updated_at: "2024-01-09T00:00:00Z",
  },
  {
    id: "cs_003",
    name: "Home Decor Plus",
    url: "homedecorplus.com",
    category: "Home & Decor",
    country: "Canada",
    monthly_traffic: 67000,
    monthly_revenue: 245000,
    growth: 8.7,
    products_count: 560,
    rating: 4.4,
    verified: false,
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-08T00:00:00Z",
  },
  {
    id: "cs_004",
    name: "Beauty Essentials",
    url: "beautyessentials.com",
    category: "Beauty",
    country: "USA",
    monthly_traffic: 150000,
    monthly_revenue: 520000,
    growth: 18.2,
    products_count: 2100,
    rating: 4.9,
    verified: true,
    created_at: "2024-01-07T00:00:00Z",
    updated_at: "2024-01-07T00:00:00Z",
  },
  {
    id: "cs_005",
    name: "Sports Zone",
    url: "sportszone.com",
    category: "Sports & Fitness",
    country: "Australia",
    monthly_traffic: 95000,
    monthly_revenue: 380000,
    growth: 12.5,
    products_count: 980,
    rating: 4.7,
    verified: true,
    created_at: "2024-01-06T00:00:00Z",
    updated_at: "2024-01-06T00:00:00Z",
  },
]



