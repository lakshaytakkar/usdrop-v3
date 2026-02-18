export interface Supplier {
  id: string
  name: string
  logo?: string
  profileImage?: string
  coverImage?: string
  managerName?: string
  country: string
  category: string
  rating: number
  reviews: number
  minOrder: number
  leadTime: string
  verified: boolean
  specialties: string[]
  description: string
  contactEmail?: string
  website?: string
}

export const sampleSuppliers: Supplier[] = [
  {
    id: "usdrop-private-001",
    name: "USDrop Private Supplier",
    country: "Dongguan, China",
    category: "All Categories",
    rating: 5.0,
    reviews: 1250,
    minOrder: 0,
    leadTime: "1 day",
    verified: true,
    specialties: ["All Products"],
    description: "Your trusted private supplier offering comprehensive product solutions across all categories with fast fulfillment and competitive pricing.",
    profileImage: "/images/suppliers/warehouse-worker-thumbnail.png",
    coverImage: "/images/suppliers/packing-operation.png",
    managerName: "Juice Chen",
    contactEmail: "juice.chen@usdrop.com",
  },
]

