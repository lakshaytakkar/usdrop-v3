export interface CompetitorStore {
  id: number;
  name: string;
  url: string;
  logo?: string;
  category: string;
  monthlyRevenue: number;
  monthlyTraffic: number;
  growth: number;
  country: string;
  products: number;
  rating: number;
  verified: boolean;
}

export const competitorStores: CompetitorStore[] = [
  {
    id: 1,
    name: "TrendyGadgets Pro",
    url: "trendygadgets.com",
    logo: "https://ui-avatars.com/api/?name=TG&background=6366f1&color=fff",
    category: "Electronics",
    monthlyRevenue: 285000,
    monthlyTraffic: 145000,
    growth: 28.5,
    country: "USA",
    products: 458,
    rating: 4.8,
    verified: true
  },
  {
    id: 2,
    name: "FashionHub Elite",
    url: "fashionhubelite.com",
    logo: "https://ui-avatars.com/api/?name=FH&background=ec4899&color=fff",
    category: "Fashion",
    monthlyRevenue: 425000,
    monthlyTraffic: 235000,
    growth: 42.3,
    country: "UK",
    products: 892,
    rating: 4.9,
    verified: true
  },
  {
    id: 3,
    name: "Home Décor Haven",
    url: "homedecor haven.com",
    logo: "https://ui-avatars.com/api/?name=HD&background=10b981&color=fff",
    category: "Home & Living",
    monthlyRevenue: 195000,
    monthlyTraffic: 98000,
    growth: 18.7,
    country: "Canada",
    products: 324,
    rating: 4.6,
    verified: true
  },
  {
    id: 4,
    name: "BeautyBox Store",
    url: "beautyboxstore.com",
    logo: "https://ui-avatars.com/api/?name=BB&background=f43f5e&color=fff",
    category: "Beauty & Health",
    monthlyRevenue: 312000,
    monthlyTraffic: 156000,
    growth: 35.2,
    country: "USA",
    products: 567,
    rating: 4.7,
    verified: true
  },
  {
    id: 5,
    name: "FitLife Essentials",
    url: "fitlifeessentials.com",
    logo: "https://ui-avatars.com/api/?name=FL&background=f59e0b&color=fff",
    category: "Sports & Fitness",
    monthlyRevenue: 218000,
    monthlyTraffic: 112000,
    growth: 25.8,
    country: "Australia",
    products: 389,
    rating: 4.8,
    verified: true
  },
  {
    id: 6,
    name: "KitchenPro Unlimited",
    url: "kitchenprounlimited.com",
    logo: "https://ui-avatars.com/api/?name=KP&background=8b5cf6&color=fff",
    category: "Kitchen & Dining",
    monthlyRevenue: 165000,
    monthlyTraffic: 82000,
    growth: 15.4,
    country: "USA",
    products: 234,
    rating: 4.5,
    verified: false
  },
  {
    id: 7,
    name: "Pet Paradise Shop",
    url: "petparadiseshop.com",
    logo: "https://ui-avatars.com/api/?name=PP&background=06b6d4&color=fff",
    category: "Pets",
    monthlyRevenue: 245000,
    monthlyTraffic: 128000,
    growth: 31.6,
    country: "UK",
    products: 412,
    rating: 4.9,
    verified: true
  },
  {
    id: 8,
    name: "Baby Bliss Store",
    url: "babyblissstore.com",
    logo: "https://ui-avatars.com/api/?name=BB&background=fb923c&color=fff",
    category: "Baby & Kids",
    monthlyRevenue: 298000,
    monthlyTraffic: 142000,
    growth: 38.9,
    country: "USA",
    products: 523,
    rating: 4.8,
    verified: true
  },
  {
    id: 9,
    name: "Garden Glory",
    url: "gardenglory.com",
    logo: "https://ui-avatars.com/api/?name=GG&background=22c55e&color=fff",
    category: "Garden & Outdoor",
    monthlyRevenue: 178000,
    monthlyTraffic: 92000,
    growth: 22.1,
    country: "Canada",
    products: 287,
    rating: 4.6,
    verified: false
  },
  {
    id: 10,
    name: "SmartHome Central",
    url: "smarthomecentral.com",
    logo: "https://ui-avatars.com/api/?name=SH&background=3b82f6&color=fff",
    category: "Electronics",
    monthlyRevenue: 385000,
    monthlyTraffic: 198000,
    growth: 45.7,
    country: "USA",
    products: 645,
    rating: 4.9,
    verified: true
  },
  {
    id: 11,
    name: "Luxury Watches Co",
    url: "luxurywatchesco.com",
    logo: "https://ui-avatars.com/api/?name=LW&background=a855f7&color=fff",
    category: "Fashion",
    monthlyRevenue: 542000,
    monthlyTraffic: 185000,
    growth: 52.3,
    country: "Switzerland",
    products: 156,
    rating: 4.9,
    verified: true
  },
  {
    id: 12,
    name: "Eco Living Market",
    url: "ecolivingmarket.com",
    logo: "https://ui-avatars.com/api/?name=EL&background=16a34a&color=fff",
    category: "Home & Living",
    monthlyRevenue: 142000,
    monthlyTraffic: 75000,
    growth: 19.4,
    country: "Germany",
    products: 298,
    rating: 4.7,
    verified: true
  },
  {
    id: 13,
    name: "Outdoor Adventure Gear",
    url: "outdooradventuregear.com",
    logo: "https://ui-avatars.com/api/?name=OA&background=ea580c&color=fff",
    category: "Sports & Fitness",
    monthlyRevenue: 325000,
    monthlyTraffic: 165000,
    growth: 41.2,
    country: "USA",
    products: 478,
    rating: 4.8,
    verified: true
  },
  {
    id: 14,
    name: "Artisan Crafts Hub",
    url: "artisancraftshub.com",
    logo: "https://ui-avatars.com/api/?name=AC&background=dc2626&color=fff",
    category: "Handmade",
    monthlyRevenue: 98000,
    monthlyTraffic: 52000,
    growth: 12.8,
    country: "UK",
    products: 892,
    rating: 4.5,
    verified: false
  },
  {
    id: 15,
    name: "Tech Innovators Shop",
    url: "techinnovatorsshop.com",
    logo: "https://ui-avatars.com/api/?name=TI&background=0891b2&color=fff",
    category: "Electronics",
    monthlyRevenue: 465000,
    monthlyTraffic: 245000,
    growth: 48.6,
    country: "USA",
    products: 723,
    rating: 4.9,
    verified: true
  },
  {
    id: 16,
    name: "Vintage Fashion Finds",
    url: "vintagefashionfinds.com",
    logo: "https://ui-avatars.com/api/?name=VF&background=be123c&color=fff",
    category: "Fashion",
    monthlyRevenue: 215000,
    monthlyTraffic: 115000,
    growth: 28.3,
    country: "USA",
    products: 634,
    rating: 4.7,
    verified: true
  },
  {
    id: 17,
    name: "Wellness & Vitamins Co",
    url: "wellnessvitaminsco.com",
    logo: "https://ui-avatars.com/api/?name=WV&background=059669&color=fff",
    category: "Beauty & Health",
    monthlyRevenue: 387000,
    monthlyTraffic: 192000,
    growth: 36.9,
    country: "Canada",
    products: 425,
    rating: 4.8,
    verified: true
  },
  {
    id: 18,
    name: "Kids Fun World",
    url: "kidsfunworld.com",
    logo: "https://ui-avatars.com/api/?name=KF&background=facc15&color=000",
    category: "Baby & Kids",
    monthlyRevenue: 256000,
    monthlyTraffic: 135000,
    growth: 32.5,
    country: "USA",
    products: 589,
    rating: 4.7,
    verified: true
  },
  {
    id: 19,
    name: "Auto Accessories Pro",
    url: "autoaccessoriespro.com",
    logo: "https://ui-avatars.com/api/?name=AA&background=475569&color=fff",
    category: "Automotive",
    monthlyRevenue: 342000,
    monthlyTraffic: 178000,
    growth: 39.4,
    country: "USA",
    products: 512,
    rating: 4.6,
    verified: true
  },
  {
    id: 20,
    name: "Book Lovers Paradise",
    url: "bookloversparadise.com",
    logo: "https://ui-avatars.com/api/?name=BL&background=7c3aed&color=fff",
    category: "Books & Media",
    monthlyRevenue: 125000,
    monthlyTraffic: 68000,
    growth: 16.7,
    country: "UK",
    products: 1245,
    rating: 4.8,
    verified: true
  }
];

