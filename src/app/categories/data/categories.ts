export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  productCount: number;
  avgProfitMargin: number;
  growth: number;
  trending: boolean;
  subcategories: string[];
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    description: "Gadgets, smart devices, and consumer electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    productCount: 1245,
    avgProfitMargin: 42.5,
    growth: 35.8,
    trending: true,
    subcategories: ["Smart Home", "Wearables", "Audio", "Accessories"]
  },
  {
    id: 2,
    name: "Fashion & Accessories",
    description: "Clothing, jewelry, bags, and fashion accessories",
    image: "/categories/fashion-accessories.png",
    productCount: 2187,
    avgProfitMargin: 55.2,
    growth: 42.3,
    trending: true,
    subcategories: ["Women's Fashion", "Men's Fashion", "Jewelry", "Bags"]
  },
  {
    id: 3,
    name: "Home & Garden",
    description: "Home decor, furniture, and garden essentials",
    image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400&h=300&fit=crop",
    productCount: 1543,
    avgProfitMargin: 48.7,
    growth: 28.5,
    trending: true,
    subcategories: ["Decor", "Furniture", "Garden Tools", "Lighting"]
  },
  {
    id: 4,
    name: "Beauty & Personal Care",
    description: "Skincare, makeup, and beauty tools",
    image: "/categories/beauty-personal-care.png",
    productCount: 987,
    avgProfitMargin: 62.3,
    growth: 45.9,
    trending: true,
    subcategories: ["Skincare", "Makeup", "Hair Care", "Tools"]
  },
  {
    id: 5,
    name: "Sports & Fitness",
    description: "Exercise equipment, activewear, and fitness accessories",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=300&fit=crop",
    productCount: 876,
    avgProfitMargin: 38.5,
    growth: 32.4,
    trending: true,
    subcategories: ["Gym Equipment", "Yoga", "Running", "Sports Nutrition"]
  },
  {
    id: 6,
    name: "Kitchen & Dining",
    description: "Cookware, appliances, and dining accessories",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop",
    productCount: 654,
    avgProfitMargin: 41.2,
    growth: 22.7,
    trending: false,
    subcategories: ["Cookware", "Appliances", "Utensils", "Storage"]
  },
  {
    id: 7,
    name: "Pet Supplies",
    description: "Pet food, toys, and accessories",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop",
    productCount: 543,
    avgProfitMargin: 45.8,
    growth: 38.2,
    trending: true,
    subcategories: ["Dog Supplies", "Cat Supplies", "Pet Toys", "Pet Care"]
  },
  {
    id: 8,
    name: "Baby & Kids",
    description: "Baby products, toys, and children's essentials",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop",
    productCount: 892,
    avgProfitMargin: 52.4,
    growth: 35.6,
    trending: true,
    subcategories: ["Baby Care", "Toys", "Clothing", "Nursery"]
  },
  {
    id: 9,
    name: "Automotive",
    description: "Car accessories, parts, and maintenance products",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
    productCount: 467,
    avgProfitMargin: 35.9,
    growth: 18.3,
    trending: false,
    subcategories: ["Accessories", "Parts", "Tools", "Care Products"]
  },
  {
    id: 10,
    name: "Outdoor & Camping",
    description: "Camping gear, outdoor equipment, and adventure essentials",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop",
    productCount: 398,
    avgProfitMargin: 43.7,
    growth: 29.8,
    trending: false,
    subcategories: ["Camping", "Hiking", "Fishing", "Outdoor Gear"]
  },
  {
    id: 11,
    name: "Office Supplies",
    description: "Stationery, desk accessories, and office essentials",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop",
    productCount: 324,
    avgProfitMargin: 39.2,
    growth: 15.6,
    trending: false,
    subcategories: ["Stationery", "Desk Accessories", "Organization", "Tech"]
  },
  {
    id: 12,
    name: "Toys & Games",
    description: "Educational toys, games, and entertainment",
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop",
    productCount: 756,
    avgProfitMargin: 47.5,
    growth: 33.1,
    trending: true,
    subcategories: ["Educational", "Board Games", "Puzzles", "Outdoor Toys"]
  },
  {
    id: 13,
    name: "Health & Wellness",
    description: "Health products, supplements, and wellness essentials",
    image: "/categories/health-wellness.png",
    productCount: 621,
    avgProfitMargin: 58.3,
    growth: 40.5,
    trending: true,
    subcategories: ["Supplements", "Fitness", "Nutrition", "Self Care"]
  },
  {
    id: 14,
    name: "Books & Media",
    description: "Books, e-readers, and media accessories",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    productCount: 432,
    avgProfitMargin: 28.4,
    growth: 12.8,
    trending: false,
    subcategories: ["Books", "E-readers", "Audiobooks", "Accessories"]
  },
  {
    id: 15,
    name: "Arts & Crafts",
    description: "Art supplies, craft materials, and creative tools",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop",
    productCount: 589,
    avgProfitMargin: 44.6,
    growth: 26.3,
    trending: false,
    subcategories: ["Art Supplies", "Crafting", "DIY", "Tools"]
  }
];

