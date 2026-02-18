export interface MetaAd {
  id: string
  title: string
  image: string
  productName: string
  platform: "Facebook" | "Instagram"
  adType: "Image" | "Video" | "Carousel"
  engagement: number
  impressions: number
  clicks: number
  ctr: number // Click-through rate percentage
  spend: number
  revenue: number
  roas: number // Return on ad spend
  date: string
  category: string
  status: "active" | "paused" | "ended"
}

export const sampleAds: MetaAd[] = [
  {
    id: "ad-001",
    title: "Summer Collection Launch",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
    productName: "Premium Sunglasses",
    platform: "Facebook",
    adType: "Video",
    engagement: 15420,
    impressions: 125000,
    clicks: 3420,
    ctr: 2.74,
    spend: 1250.0,
    revenue: 8750.0,
    roas: 7.0,
    date: "2024-01-15",
    category: "Fashion",
    status: "active",
  },
  {
    id: "ad-002",
    title: "Fitness Tracker Campaign",
    image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400",
    productName: "Smart Fitness Watch",
    platform: "Instagram",
    adType: "Carousel",
    engagement: 22340,
    impressions: 180000,
    clicks: 4890,
    ctr: 2.72,
    spend: 1890.0,
    revenue: 12450.0,
    roas: 6.59,
    date: "2024-01-12",
    category: "Electronics",
    status: "active",
  },
  {
    id: "ad-003",
    title: "Home Decor Special",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    productName: "Modern Wall Art",
    platform: "Facebook",
    adType: "Image",
    engagement: 9870,
    impressions: 95000,
    clicks: 2100,
    ctr: 2.21,
    spend: 890.0,
    revenue: 4200.0,
    roas: 4.72,
    date: "2024-01-10",
    category: "Home & Decor",
    status: "active",
  },
  {
    id: "ad-004",
    title: "Beauty Essentials",
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400",
    productName: "Skincare Set",
    platform: "Instagram",
    adType: "Video",
    engagement: 31200,
    impressions: 245000,
    clicks: 6780,
    ctr: 2.77,
    spend: 2450.0,
    revenue: 18900.0,
    roas: 7.71,
    date: "2024-01-08",
    category: "Beauty",
    status: "active",
  },
  {
    id: "ad-005",
    title: "Tech Gadgets Sale",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    productName: "Wireless Earbuds",
    platform: "Facebook",
    adType: "Carousel",
    engagement: 18900,
    impressions: 165000,
    clicks: 4120,
    ctr: 2.5,
    spend: 1650.0,
    revenue: 10200.0,
    roas: 6.18,
    date: "2024-01-05",
    category: "Electronics",
    status: "paused",
  },
  {
    id: "ad-006",
    title: "Pet Products Launch",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
    productName: "Pet Grooming Kit",
    platform: "Instagram",
    adType: "Image",
    engagement: 12450,
    impressions: 110000,
    clicks: 2890,
    ctr: 2.63,
    spend: 1100.0,
    revenue: 5780.0,
    roas: 5.25,
    date: "2024-01-03",
    category: "Pet Supplies",
    status: "active",
  },
]

