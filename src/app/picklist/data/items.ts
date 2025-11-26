export interface PicklistItem {
  id: string;
  title: string;
  image: string;
  price: number;
  category: string;
  addedDate: string;
  source: "winning-products" | "product-hunt" | "other";
}

export const picklistItems: PicklistItem[] = [
  {
    id: "picklist-1",
    title: "Smart Watch Fitness Tracker with Heart Rate Monitor",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    price: 79.99,
    category: "Gadgets",
    addedDate: "2024-01-15T10:30:00Z",
    source: "winning-products"
  },
  {
    id: "picklist-2",
    title: "Wireless Noise Cancelling Headphones Premium",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    price: 149.99,
    category: "Audio",
    addedDate: "2024-01-14T14:20:00Z",
    source: "winning-products"
  },
  {
    id: "picklist-3",
    title: "Boho Style Summer Maxi Dress with Floral Print",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    price: 45.99,
    category: "Fashion",
    addedDate: "2024-01-13T09:15:00Z",
    source: "product-hunt"
  },
  {
    id: "picklist-4",
    title: "LED Strip Lights RGB Smart Home Lighting Kit",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    price: 39.99,
    category: "Home Decor",
    addedDate: "2024-01-12T16:45:00Z",
    source: "winning-products"
  },
  {
    id: "picklist-5",
    title: "Korean Skincare Set - 10 Step Routine Bundle",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    price: 89.99,
    category: "Beauty",
    addedDate: "2024-01-11T11:00:00Z",
    source: "winning-products"
  },
  {
    id: "picklist-6",
    title: "Resistance Bands Set with Workout Guide",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    price: 27.99,
    category: "Sports & Fitness",
    addedDate: "2024-01-10T13:30:00Z",
    source: "product-hunt"
  },
  {
    id: "picklist-7",
    title: "Stainless Steel Kitchen Knife Set 8 Pieces",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    price: 64.99,
    category: "Kitchen",
    addedDate: "2024-01-09T08:20:00Z",
    source: "winning-products"
  },
  {
    id: "picklist-8",
    title: "Premium Yoga Mat with Carrying Strap",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    price: 34.99,
    category: "Sports & Fitness",
    addedDate: "2024-01-08T15:10:00Z",
    source: "other"
  }
];

