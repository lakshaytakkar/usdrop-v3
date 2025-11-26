import { StoreResearchData } from "@/app/store-research/data/store-research-data"

export interface StoreResearchEntry {
  id: string
  store_url: string
  store_name: string | null
  data: StoreResearchData
  last_updated: string
  created_at: string
}

export const sampleStoreResearchEntries: StoreResearchEntry[] = [
  {
    id: "sr_001",
    store_url: "jsblueridge.com",
    store_name: "JS Blue Ridge",
    data: {
      storeUrl: "jsblueridge.com",
      storeName: "JS Blue Ridge",
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
      products: [],
    },
    last_updated: "2024-01-15T10:00:00Z",
    created_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "sr_002",
    store_url: "example-store.com",
    store_name: "Example Store",
    data: {
      storeUrl: "example-store.com",
      storeName: "Example Store",
      popularityRank: 23456,
      growth: 8.2,
      category: "Electronics",
      trafficSources: [
        { type: "direct", percentage: 30, value: 30000 },
        { type: "search", percentage: 45, value: 45000 },
        { type: "social", percentage: 15, value: 15000 },
        { type: "referrals", percentage: 10, value: 10000 },
      ],
      monthlyRevenue: 89000,
      monthlyTraffic: 100000,
      hasInsufficientData: false,
      products: [],
    },
    last_updated: "2024-01-14T14:00:00Z",
    created_at: "2024-01-09T00:00:00Z",
  },
]


