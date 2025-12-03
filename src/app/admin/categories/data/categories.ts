import { ProductCategory } from "@/types/admin/categories"

export const sampleCategories: ProductCategory[] = [
  {
    id: "cat_001",
    name: "Fashion",
    slug: "fashion",
    description: "Fashion and apparel products",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
    parent_category_id: null,
    trending: true,
    product_count: 245,
    avg_profit_margin: 42.5,
    growth_percentage: 15.3,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat_002",
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
    parent_category_id: null,
    trending: true,
    product_count: 189,
    avg_profit_margin: 38.2,
    growth_percentage: 22.1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat_003",
    name: "Home Decor",
    slug: "home-decor",
    description: "Home decoration items",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    parent_category_id: null,
    trending: false,
    product_count: 156,
    avg_profit_margin: 35.8,
    growth_percentage: 8.5,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat_004",
    name: "Men's Fashion",
    slug: "mens-fashion",
    description: "Men's clothing and accessories",
    image: null,
    parent_category_id: "cat_001",
    trending: true,
    product_count: 89,
    avg_profit_margin: 40.2,
    growth_percentage: 12.4,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    parent_category: {
      id: "cat_001",
      name: "Fashion",
      slug: "fashion",
    },
  },
  {
    id: "cat_005",
    name: "Women's Fashion",
    slug: "womens-fashion",
    description: "Women's clothing and accessories",
    image: null,
    parent_category_id: "cat_001",
    trending: true,
    product_count: 156,
    avg_profit_margin: 44.8,
    growth_percentage: 18.7,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    parent_category: {
      id: "cat_001",
      name: "Fashion",
      slug: "fashion",
    },
  },
]
















