export type ProductCategory = 
  | "all"
  | "fashion"
  | "home-decor"
  | "beauty"
  | "sports-fitness"
  | "kitchen"
  | "home-garden"
  | "gadgets"
  | "pets"
  | "mother-kids"
  | "other";

export interface WinningProduct {
  id: number;
  image: string;
  title: string;
  profitMargin: number;
  potRevenue: number;
  category: ProductCategory;
  isLocked: boolean;
  foundDate: string;
}

export const winningProducts: WinningProduct[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    title: "Smart Watch Fitness Tracker with Heart Rate Monitor",
    profitMargin: 45.99,
    potRevenue: 125000,
    category: "gadgets",
    isLocked: false,
    foundDate: "2024-01-15"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    title: "Wireless Noise Cancelling Headphones Premium",
    profitMargin: 52.50,
    potRevenue: 185000,
    category: "gadgets",
    isLocked: false,
    foundDate: "2024-01-14"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    title: "Portable Power Bank 20000mAh Fast Charging",
    profitMargin: 38.75,
    potRevenue: 98000,
    category: "gadgets",
    isLocked: true,
    foundDate: "2024-01-13"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    title: "Boho Style Summer Maxi Dress with Floral Print",
    profitMargin: 42.00,
    potRevenue: 142000,
    category: "fashion",
    isLocked: false,
    foundDate: "2024-01-12"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
    title: "Minimalist Leather Crossbody Bag for Women",
    profitMargin: 48.25,
    potRevenue: 156000,
    category: "fashion",
    isLocked: true,
    foundDate: "2024-01-11"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    title: "LED Strip Lights RGB Smart Home Lighting Kit",
    profitMargin: 35.50,
    potRevenue: 95000,
    category: "home-decor",
    isLocked: false,
    foundDate: "2024-01-10"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    title: "Aromatherapy Essential Oil Diffuser with LED",
    profitMargin: 41.75,
    potRevenue: 112000,
    category: "home-decor",
    isLocked: false,
    foundDate: "2024-01-09"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop",
    title: "Minimalist Wall Art Set of 3 Prints",
    profitMargin: 39.99,
    potRevenue: 87000,
    category: "home-decor",
    isLocked: true,
    foundDate: "2024-01-08"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    title: "Korean Skincare Set - 10 Step Routine Bundle",
    profitMargin: 55.00,
    potRevenue: 198000,
    category: "beauty",
    isLocked: false,
    foundDate: "2024-01-07"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop",
    title: "Jade Roller and Gua Sha Facial Tool Set",
    profitMargin: 44.50,
    potRevenue: 125000,
    category: "beauty",
    isLocked: true,
    foundDate: "2024-01-06"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1598662957477-06b3d1471a20?w=400&h=400&fit=crop",
    title: "Professional Makeup Brush Set 15 Pieces",
    profitMargin: 37.25,
    potRevenue: 78000,
    category: "beauty",
    isLocked: false,
    foundDate: "2024-01-05"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    title: "Resistance Bands Set with Workout Guide",
    profitMargin: 33.75,
    potRevenue: 92000,
    category: "sports-fitness",
    isLocked: false,
    foundDate: "2024-01-04"
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    title: "Premium Yoga Mat with Carrying Strap",
    profitMargin: 36.50,
    potRevenue: 105000,
    category: "sports-fitness",
    isLocked: true,
    foundDate: "2024-01-03"
  },
  {
    id: 14,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=400&fit=crop",
    title: "Smart Jump Rope with Counter and App",
    profitMargin: 29.99,
    potRevenue: 68000,
    category: "sports-fitness",
    isLocked: false,
    foundDate: "2024-01-02"
  },
  {
    id: 15,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    title: "Stainless Steel Kitchen Knife Set 8 Pieces",
    profitMargin: 46.00,
    potRevenue: 135000,
    category: "kitchen",
    isLocked: false,
    foundDate: "2024-01-01"
  },
  {
    id: 16,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    title: "Electric Milk Frother for Coffee and Latte",
    profitMargin: 32.25,
    potRevenue: 75000,
    category: "kitchen",
    isLocked: true,
    foundDate: "2023-12-31"
  },
  {
    id: 17,
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop",
    title: "Silicone Baking Mat Set Non-Stick",
    profitMargin: 28.50,
    potRevenue: 62000,
    category: "kitchen",
    isLocked: false,
    foundDate: "2023-12-30"
  },
  {
    id: 18,
    image: "https://images.unsplash.com/photo-1585845740473-1fb3aa1b2b7d?w=400&h=400&fit=crop",
    title: "Succulent Planter Set with Drainage",
    profitMargin: 34.75,
    potRevenue: 88000,
    category: "home-garden",
    isLocked: false,
    foundDate: "2023-12-29"
  },
  {
    id: 19,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    title: "Garden Tool Set 10 Piece with Carry Bag",
    profitMargin: 41.00,
    potRevenue: 115000,
    category: "home-garden",
    isLocked: true,
    foundDate: "2023-12-28"
  },
  {
    id: 20,
    image: "https://images.unsplash.com/photo-1585859715112-bbdf8e3d19f8?w=400&h=400&fit=crop",
    title: "Solar Powered Garden Lights String 50 LED",
    profitMargin: 27.99,
    potRevenue: 72000,
    category: "home-garden",
    isLocked: false,
    foundDate: "2023-12-27"
  },
  {
    id: 21,
    image: "https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=400&h=400&fit=crop",
    title: "Orthopedic Memory Foam Dog Bed Large",
    profitMargin: 49.50,
    potRevenue: 142000,
    category: "pets",
    isLocked: false,
    foundDate: "2023-12-26"
  },
  {
    id: 22,
    image: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400&h=400&fit=crop",
    title: "Interactive Cat Toy with Feathers and Bells",
    profitMargin: 24.75,
    potRevenue: 58000,
    category: "pets",
    isLocked: true,
    foundDate: "2023-12-25"
  },
  {
    id: 23,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop",
    title: "Automatic Pet Feeder with Timer",
    profitMargin: 43.25,
    potRevenue: 125000,
    category: "pets",
    isLocked: false,
    foundDate: "2023-12-24"
  },
  {
    id: 24,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop",
    title: "Baby Monitor with Camera and App Control",
    profitMargin: 58.00,
    potRevenue: 215000,
    category: "mother-kids",
    isLocked: false,
    foundDate: "2023-12-23"
  },
  {
    id: 25,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    title: "Organic Baby Clothing Set 5 Pieces",
    profitMargin: 36.50,
    potRevenue: 95000,
    category: "mother-kids",
    isLocked: true,
    foundDate: "2023-12-22"
  },
  {
    id: 26,
    image: "https://images.unsplash.com/photo-1586019530647-f22f5c836e55?w=400&h=400&fit=crop",
    title: "Silicone Baby Feeding Set BPA Free",
    profitMargin: 31.75,
    potRevenue: 82000,
    category: "mother-kids",
    isLocked: false,
    foundDate: "2023-12-21"
  },
  {
    id: 27,
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop",
    title: "Car Phone Holder Magnetic Dashboard Mount",
    profitMargin: 22.50,
    potRevenue: 55000,
    category: "other",
    isLocked: false,
    foundDate: "2023-12-20"
  },
  {
    id: 28,
    image: "https://images.unsplash.com/photo-1610634802582-8bc4c4b3a0e1?w=400&h=400&fit=crop",
    title: "Reusable Silicone Food Storage Bags Set",
    profitMargin: 26.00,
    potRevenue: 67000,
    category: "other",
    isLocked: true,
    foundDate: "2023-12-19"
  },
  {
    id: 29,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop",
    title: "Laptop Stand Adjustable Aluminum",
    profitMargin: 34.99,
    potRevenue: 92000,
    category: "other",
    isLocked: false,
    foundDate: "2023-12-18"
  },
  {
    id: 30,
    image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=400&fit=crop",
    title: "USB-C Hub Multiport Adapter 7-in-1",
    profitMargin: 39.75,
    potRevenue: 108000,
    category: "gadgets",
    isLocked: true,
    foundDate: "2023-12-17"
  }
];

