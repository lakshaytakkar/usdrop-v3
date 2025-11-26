export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  authorAvatar: string
  image: string
  category: string
  tags: string[]
  publishedDate: string
  readTime: number // in minutes
  views: number
  likes: number
  featured: boolean
}

export const sampleArticles: Article[] = [
  {
    id: "art-001",
    slug: "art-001",
    title: "10 Winning Products to Dropship in 2024",
    excerpt:
      "Discover the top trending products that are generating massive sales for dropshippers this year.",
    content: "Full article content...",
    author: "Sarah Johnson",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
    category: "Product Research",
    tags: ["Products", "Trending", "2024"],
    publishedDate: "2024-01-15",
    readTime: 8,
    views: 12450,
    likes: 342,
    featured: true,
  },
  {
    id: "art-002",
    slug: "art-002",
    title: "How to Scale Your Facebook Ads Profitably",
    excerpt: "Learn proven strategies to scale your Facebook ad campaigns while maintaining profitability.",
    content: "Full article content...",
    author: "Michael Chen",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400",
    category: "Marketing",
    tags: ["Facebook Ads", "Scaling", "ROI"],
    publishedDate: "2024-01-12",
    readTime: 12,
    views: 8920,
    likes: 256,
    featured: true,
  },
  {
    id: "art-003",
    slug: "art-003",
    title: "Store Optimization: 15 Ways to Increase Conversions",
    excerpt: "Simple but effective changes you can make to your store to boost conversion rates.",
    content: "Full article content...",
    author: "Emily Rodriguez",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    category: "Optimization",
    tags: ["Conversion", "CRO", "Store Design"],
    publishedDate: "2024-01-10",
    readTime: 10,
    views: 6780,
    likes: 189,
    featured: false,
  },
  {
    id: "art-004",
    slug: "art-004",
    title: "The Complete Guide to Supplier Management",
    excerpt: "Everything you need to know about finding, vetting, and working with suppliers.",
    content: "Full article content...",
    author: "David Williams",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400",
    category: "Suppliers",
    tags: ["Suppliers", "Sourcing", "Management"],
    publishedDate: "2024-01-08",
    readTime: 15,
    views: 5430,
    likes: 167,
    featured: false,
  },
  {
    id: "art-005",
    slug: "art-005",
    title: "Instagram Ads: A Beginner's Guide",
    excerpt: "Step-by-step guide to creating your first profitable Instagram ad campaign.",
    content: "Full article content...",
    author: "Lisa Anderson",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "Marketing",
    tags: ["Instagram", "Ads", "Beginner"],
    publishedDate: "2024-01-05",
    readTime: 9,
    views: 4560,
    likes: 134,
    featured: false,
  },
  {
    id: "art-006",
    slug: "art-006",
    title: "Customer Retention Strategies That Work",
    excerpt: "Learn how to turn one-time buyers into loyal, repeat customers.",
    content: "Full article content...",
    author: "Sarah Johnson",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
    category: "Business",
    tags: ["Retention", "Customers", "LTV"],
    publishedDate: "2024-01-03",
    readTime: 11,
    views: 3890,
    likes: 98,
    featured: false,
  },
]

