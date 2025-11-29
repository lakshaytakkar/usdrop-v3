export interface Article {
  id: string
  title: string
  slug: string
  content: string // Rich HTML content
  excerpt: string // Short summary
  featured_image: string | null
  author_id: string
  author?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  status: "draft" | "published" | "archived" | "scheduled"
  published_at: string | null
  scheduled_publish_at: string | null
  created_at: string
  updated_at: string
  views: number
  reading_time: number // Minutes
  tags: string[]
  category: string | null
  seo_title: string | null
  seo_description: string | null
  is_featured: boolean
  is_pinned: boolean
}

const categories = [
  "E-commerce Tips",
  "Product Research",
  "Marketing",
  "Dropshipping",
  "Shopify",
  "SEO",
  "Social Media",
  "Business Growth",
  "Case Studies",
  "Tutorials",
]

const tags = [
  "beginner",
  "advanced",
  "shopify",
  "marketing",
  "seo",
  "social-media",
  "dropshipping",
  "ecommerce",
  "product-research",
  "case-study",
  "tutorial",
  "tips",
  "strategy",
  "analytics",
  "conversion",
]

const sampleAuthors = [
  { id: "author-001", name: "Sarah Johnson", email: "sarah@usdrop.com", avatar: null },
  { id: "author-002", name: "Michael Chen", email: "michael@usdrop.com", avatar: null },
  { id: "author-003", name: "Emily Rodriguez", email: "emily@usdrop.com", avatar: null },
  { id: "author-004", name: "David Kim", email: "david@usdrop.com", avatar: null },
  { id: "author-005", name: "Jessica Martinez", email: "jessica@usdrop.com", avatar: null },
]

const articleTitles = [
  "10 Essential Shopify Apps for Dropshipping Success",
  "How to Find Winning Products in 2024",
  "The Complete Guide to Facebook Ads for E-commerce",
  "SEO Strategies That Actually Work for Online Stores",
  "Building a Brand: From Zero to $100K in 6 Months",
  "Instagram Marketing: A Step-by-Step Guide",
  "Understanding Your Analytics: Metrics That Matter",
  "Product Photography Tips That Convert",
  "Email Marketing Automation for E-commerce",
  "The Psychology of Pricing: Maximize Your Profits",
  "Customer Retention Strategies That Work",
  "How to Handle Returns and Refunds Like a Pro",
  "Scaling Your Business: When and How to Grow",
  "The Future of E-commerce: Trends to Watch",
  "Content Marketing for Online Stores",
  "Influencer Partnerships: A Complete Guide",
  "Mobile Commerce: Optimizing for Mobile Shoppers",
  "Payment Gateways: Choosing the Right One",
  "Inventory Management Best Practices",
  "Customer Service Excellence in E-commerce",
  "Social Proof: Building Trust with Reviews",
  "A/B Testing Your Product Pages",
  "International Shipping Made Easy",
  "Tax Compliance for Online Businesses",
  "Building an Email List: Strategies That Convert",
  "Product Descriptions That Sell",
  "Video Marketing for E-commerce",
  "The Power of Upselling and Cross-selling",
  "Seasonal Marketing Campaigns",
  "Competitor Analysis: Learn from the Best",
  "Conversion Rate Optimization Tips",
  "Building a Community Around Your Brand",
  "Sustainable E-commerce Practices",
  "Voice Commerce: The Next Frontier",
  "AR/VR in E-commerce: What's Next",
  "Subscription Models: Recurring Revenue",
  "Marketplace Selling: Amazon, eBay, and More",
  "B2B E-commerce: Strategies for Success",
  "Personalization in Online Shopping",
  "The Role of AI in E-commerce",
  "Crisis Management for Online Businesses",
  "Building a Multi-Channel Strategy",
  "Customer Journey Mapping",
  "The Importance of Site Speed",
  "Accessibility in E-commerce",
  "Data Privacy and GDPR Compliance",
  "Affiliate Marketing Programs",
  "Live Chat: Enhancing Customer Experience",
  "Product Bundling Strategies",
  "Exit Intent Popups That Convert",
  "Building a Mobile App for Your Store",
]

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// Generate excerpt from content
function generateExcerpt(content: string, length: number = 150): string {
  const text = content.replace(/<[^>]*>/g, "").trim()
  return text.length > length ? text.substring(0, length) + "..." : text
}

// Generate sample HTML content
function generateContent(title: string): string {
  return `
    <h2>Introduction</h2>
    <p>This is a comprehensive guide about ${title.toLowerCase()}. In this article, we'll explore the key concepts, best practices, and actionable strategies you can implement today.</p>
    
    <h2>Key Concepts</h2>
    <p>Understanding the fundamentals is crucial for success. Let's dive into the core concepts that will help you master this topic.</p>
    
    <ul>
      <li>First important point to consider</li>
      <li>Second key concept to understand</li>
      <li>Third essential element for success</li>
    </ul>
    
    <h2>Best Practices</h2>
    <p>Here are some proven strategies that industry leaders use:</p>
    
    <ol>
      <li>Start with a clear plan</li>
      <li>Implement gradually</li>
      <li>Measure and optimize</li>
    </ol>
    
    <h2>Actionable Steps</h2>
    <p>Ready to get started? Follow these steps to begin your journey:</p>
    
    <p><strong>Step 1:</strong> Define your goals and objectives.</p>
    <p><strong>Step 2:</strong> Research and gather resources.</p>
    <p><strong>Step 3:</strong> Create an implementation timeline.</p>
    
    <h2>Conclusion</h2>
    <p>By following the strategies outlined in this article, you'll be well on your way to achieving your goals. Remember, consistency and continuous learning are key to long-term success.</p>
  `.trim()
}

// Calculate reading time from content
function calculateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "")
  const words = text.split(/\s+/).length
  return Math.ceil(words / 200) // Average reading speed: 200 words per minute
}

// Generate random date within range
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString()
}

// Generate random number in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate articles
export const sampleArticles: Article[] = articleTitles.map((title, index) => {
  const now = new Date()
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
  const created_at = randomDate(sixMonthsAgo, now)
  
  const statuses: Array<"draft" | "published" | "archived" | "scheduled"> = [
    "draft",
    "published",
    "published",
    "published",
    "scheduled",
    "archived",
  ]
  const status = statuses[index % statuses.length]
  
  const author = sampleAuthors[index % sampleAuthors.length]
  const category = categories[index % categories.length]
  const selectedTags = tags.slice(0, randomInt(2, 5))
  
  const content = generateContent(title)
  const reading_time = calculateReadingTime(content)
  const views = status === "published" ? randomInt(100, 50000) : randomInt(0, 500)
  
  const published_at = status === "published" || status === "scheduled" 
    ? randomDate(new Date(created_at), now) 
    : null
  
  const scheduled_publish_at = status === "scheduled"
    ? randomDate(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000))
    : null
  
  const is_featured = index % 5 === 0
  const is_pinned = index % 10 === 0 && status === "published"
  
  return {
    id: `article-${String(index + 1).padStart(3, "0")}`,
    title,
    slug: generateSlug(title),
    content,
    excerpt: generateExcerpt(content),
    featured_image: index % 3 === 0 ? `/images/articles/article-${index + 1}.jpg` : null,
    author_id: author.id,
    author: {
      ...author,
      avatar: author.avatar || null,
    },
    status,
    published_at,
    scheduled_publish_at,
    created_at,
    updated_at: randomDate(new Date(created_at), now),
    views,
    reading_time,
    tags: selectedTags,
    category,
    seo_title: index % 2 === 0 ? `${title} | USDrop Intelligence` : null,
    seo_description: index % 2 === 0 ? generateExcerpt(content, 160) : null,
    is_featured,
    is_pinned,
  }
})

