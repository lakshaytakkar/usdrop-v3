export interface AITool {
  id: string
  name: string
  description: string
  icon: string
  category: string
  status: "available" | "coming-soon" | "premium"
  features: string[]
}

export const aiTools: AITool[] = [
  {
    id: "product-descriptions",
    name: "Product Description Generator",
    description: "Generate compelling product descriptions that convert visitors into customers",
    icon: "FileText",
    category: "Content",
    status: "available",
    features: ["SEO optimized", "Multiple variations", "Tone customization", "Bullet points"],
  },
  {
    id: "ad-copy",
    name: "Ad Copy Generator",
    description: "Create high-converting ad copy for Facebook, Instagram, and Google Ads",
    icon: "Megaphone",
    category: "Marketing",
    status: "available",
    features: ["Multiple formats", "A/B testing variants", "Platform-specific", "CTA optimization"],
  },
  {
    id: "email-templates",
    name: "Email Template Generator",
    description: "Design professional email templates for marketing campaigns and customer communication",
    icon: "Mail",
    category: "Marketing",
    status: "available",
    features: ["Responsive design", "Multiple templates", "Custom branding", "Preview mode"],
  },
  {
    id: "image-generator",
    name: "AI Image Generator",
    description: "Create stunning product images and marketing visuals with AI",
    icon: "Image",
    category: "Visual",
    status: "premium",
    features: ["Multiple styles", "Background removal", "Product mockups", "HD quality"],
  },
  {
    id: "seo-optimizer",
    name: "SEO Content Optimizer",
    description: "Optimize your product pages and blog posts for search engines",
    icon: "Search",
    category: "SEO",
    status: "available",
    features: ["Keyword research", "Content analysis", "Meta tags", "Readability score"],
  },
  {
    id: "video-scripts",
    name: "Video Script Generator",
    description: "Write engaging video scripts for product launches and marketing videos",
    icon: "Video",
    category: "Content",
    status: "coming-soon",
    features: ["Multiple formats", "Hook optimization", "Call-to-action", "Duration control"],
  },
]

