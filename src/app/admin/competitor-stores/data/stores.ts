export interface CompetitorStore {
  id: string
  name: string
  url: string
  category: string
  monthly_traffic: number
  monthly_revenue: number | null
  growth: number
  created_at: string
  updated_at: string
}

export const sampleCompetitorStores: CompetitorStore[] = [
  {
    id: "cs_001",
    name: "TechGadgets Store",
    url: "techgadgets.com",
    category: "Electronics",
    monthly_traffic: 125000,
    monthly_revenue: 450000,
    growth: 15.5,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "cs_002",
    name: "Fashion Forward",
    url: "fashionforward.com",
    category: "Fashion",
    monthly_traffic: 89000,
    monthly_revenue: 320000,
    growth: 22.3,
    created_at: "2024-01-09T00:00:00Z",
    updated_at: "2024-01-09T00:00:00Z",
  },
  {
    id: "cs_003",
    name: "Home Decor Plus",
    url: "homedecorplus.com",
    category: "Home & Decor",
    monthly_traffic: 67000,
    monthly_revenue: 245000,
    growth: 8.7,
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-08T00:00:00Z",
  },
]


