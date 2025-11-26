export interface Supplier {
  id: string
  name: string
  logo?: string
  country: string
  category: string
  rating: number
  reviews: number
  minOrder: number
  leadTime: string
  verified: boolean
  specialties: string[]
  description: string
  contactEmail: string
  website?: string
}

export const sampleSuppliers: Supplier[] = [
  {
    id: "sup-001",
    name: "Global Electronics Supply",
    country: "China",
    category: "Electronics",
    rating: 4.8,
    reviews: 342,
    minOrder: 100,
    leadTime: "7-14 days",
    verified: true,
    specialties: ["Smartphones", "Tablets", "Accessories"],
    description: "Leading supplier of consumer electronics with fast shipping and competitive pricing.",
    contactEmail: "contact@globalelectronics.com",
    website: "https://globalelectronics.com",
  },
  {
    id: "sup-002",
    name: "Fashion Forward Co.",
    country: "Vietnam",
    category: "Fashion",
    rating: 4.7,
    reviews: 289,
    minOrder: 50,
    leadTime: "10-15 days",
    verified: true,
    specialties: ["Apparel", "Accessories", "Footwear"],
    description: "Premium fashion supplier specializing in trendy apparel and accessories.",
    contactEmail: "info@fashionforward.com",
    website: "https://fashionforward.com",
  },
  {
    id: "sup-003",
    name: "Home Essentials Direct",
    country: "India",
    category: "Home & Kitchen",
    rating: 4.6,
    reviews: 156,
    minOrder: 75,
    leadTime: "12-18 days",
    verified: true,
    specialties: ["Kitchenware", "Home Decor", "Storage"],
    description: "Quality home and kitchen products at wholesale prices.",
    contactEmail: "sales@homeessentials.com",
  },
  {
    id: "sup-004",
    name: "Beauty Products Hub",
    country: "South Korea",
    category: "Beauty",
    rating: 4.9,
    reviews: 512,
    minOrder: 200,
    leadTime: "5-10 days",
    verified: true,
    specialties: ["Skincare", "Cosmetics", "Hair Care"],
    description: "K-beauty products supplier with authentic Korean brands.",
    contactEmail: "hello@beautyhub.com",
    website: "https://beautyhub.com",
  },
  {
    id: "sup-005",
    name: "Fitness Gear Pro",
    country: "USA",
    category: "Sports & Fitness",
    rating: 4.5,
    reviews: 198,
    minOrder: 150,
    leadTime: "7-12 days",
    verified: true,
    specialties: ["Fitness Equipment", "Sportswear", "Supplements"],
    description: "Premium fitness equipment and accessories from trusted manufacturers.",
    contactEmail: "contact@fitnessgear.com",
  },
  {
    id: "sup-006",
    name: "Pet Supplies Plus",
    country: "Canada",
    category: "Pet Supplies",
    rating: 4.7,
    reviews: 234,
    minOrder: 80,
    leadTime: "10-14 days",
    verified: true,
    specialties: ["Pet Toys", "Pet Food", "Pet Accessories"],
    description: "Comprehensive pet supplies for all your furry friends.",
    contactEmail: "info@petsupplies.com",
  },
]

