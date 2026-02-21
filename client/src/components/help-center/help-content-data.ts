import {
  Rocket,
  Package,
  Search,
  Sparkles,
  ShoppingBag,
  CreditCard,
  HelpCircle,
  FileText,
  BookOpen,
  Settings,
} from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface CategoryCard {
  id: string
  title: string
  description: string
  icon: LucideIcon
  category: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

export interface Article {
  id: string
  title: string
  description: string
  category: string
  content: string
  tags: string[]
}

export interface SOP {
  id: string
  title: string
  description: string
  category: string
  steps: string[]
  tags: string[]
}

export const categoryCards: CategoryCard[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "New to USDrop? Learn the basics and get up and running quickly.",
    icon: Rocket,
    category: "Getting Started",
  },
  {
    id: "products-research",
    title: "Products & Research",
    description: "Find winning products with Product Hunt, competitor analysis, and market research tools.",
    icon: Search,
    category: "Products & Research",
  },
  {
    id: "fulfillment",
    title: "Fulfillment",
    description: "Manage private suppliers, calculate shipping costs, and streamline your fulfillment process.",
    icon: Package,
    category: "Fulfillment",
  },
  {
    id: "ai-studio",
    title: "AI Studio",
    description: "Create stunning visuals with Logo Studio, Model Studio, and more AI-powered tools.",
    icon: Sparkles,
    category: "AI Studio",
  },
  {
    id: "shopify",
    title: "Shopify Integration",
    description: "Connect and manage your Shopify stores, sync products, and automate workflows.",
    icon: ShoppingBag,
    category: "Shopify Integration",
  },
  {
    id: "account-billing",
    title: "Account & Billing",
    description: "Manage your subscription, update payment methods, and access billing information.",
    icon: CreditCard,
    category: "Account & Billing",
  },
]

export const faqs: FAQ[] = [
  // General FAQs
  {
    id: "faq-1",
    question: "Is there a free trial available?",
    answer: "Yes, we offer a free trial of USDrop that gives you access to core features. The free version includes basic product research tools, limited access to the Product Hunt database, and access to our community resources. You can upgrade to a paid plan anytime to unlock advanced features like AI Studio tools, unlimited product research, private supplier access, and support.",
    category: "General",
    tags: ["trial", "pricing", "free"],
  },
  {
    id: "faq-2",
    question: "What is USDrop and how does it work?",
    answer: "USDrop is an all-in-one dropshipping platform that helps you find winning products, manage suppliers, create marketing assets, and grow your e-commerce business. Our platform combines AI-powered research tools with fulfillment solutions and creative studios to streamline your entire dropshipping workflow from product discovery to order fulfillment.",
    category: "General",
    tags: ["platform", "overview", "getting started"],
  },
  {
    id: "faq-3",
    question: "How do I get started with USDrop?",
    answer: "Getting started is easy! First, create your account and choose a plan that suits your needs. Then, connect your Shopify store (if you have one) or set up a new store. Start by exploring our Product Hunt database or Winning Products section to find products to sell. Use our AI Studio tools to create product images and marketing materials, then add products to your store and start selling!",
    category: "General",
    tags: ["getting started", "onboarding", "setup"],
  },
  {
    id: "faq-4",
    question: "Do I need a Shopify store to use USDrop?",
    answer: "While USDrop integrates seamlessly with Shopify, you don't need a Shopify store to use our platform. You can use our research tools, AI Studio features, and supplier network independently. However, connecting a Shopify store unlocks automated product syncing, order management, and streamlined fulfillment workflows.",
    category: "General",
    tags: ["shopify", "integration", "requirements"],
  },
  {
    id: "faq-5",
    question: "What types of products can I find on USDrop?",
    answer: "USDrop provides access to thousands of products across various categories including electronics, home & garden, fashion, beauty, health & fitness, and more. Our Product Hunt database includes trending products, while the Winning Products section showcases products with proven sales performance. You can filter by category, profit margin, shipping time, and other criteria to find products that match your niche.",
    category: "Features",
    tags: ["products", "research", "categories"],
  },
  // Billing FAQs
  {
    id: "faq-6",
    question: "How does billing work?",
    answer: "USDrop offers flexible billing options with monthly and annual subscription plans. All plans are billed automatically on a recurring basis. You can upgrade, downgrade, or cancel your subscription at any time from your Account Settings. Annual plans offer significant savings compared to monthly billing. We accept all major credit cards and PayPal.",
    category: "Billing",
    tags: ["billing", "payment", "subscription"],
  },
  {
    id: "faq-7",
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll have immediate access to new features and the difference will be prorated. When you downgrade, changes take effect at the start of your next billing cycle. You can manage your subscription from the Account & Billing section in your settings.",
    category: "Billing",
    tags: ["plan", "upgrade", "downgrade"],
  },
  {
    id: "faq-8",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal for subscription payments. All payments are processed securely through our payment processor and your card information is encrypted and never stored on our servers.",
    category: "Billing",
    tags: ["payment", "credit card", "paypal"],
  },
  {
    id: "faq-9",
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied with USDrop within the first 30 days, contact our support team for a full refund. After the initial 30-day period, refunds are handled on a case-by-case basis. Cancellations take effect at the end of your current billing period.",
    category: "Billing",
    tags: ["refund", "cancellation", "guarantee"],
  },
  // Technical FAQs
  {
    id: "faq-10",
    question: "How do I connect my Shopify store?",
    answer: "To connect your Shopify store, navigate to the Shopify Stores section in your dashboard. Click 'Connect Store' and you'll be redirected to Shopify to authorize the connection. Once authorized, USDrop will sync your products, orders, and inventory data. You can manage multiple stores from a single USDrop account.",
    category: "Technical",
    tags: ["shopify", "integration", "setup"],
  },
  {
    id: "faq-11",
    question: "Is my data secure?",
    answer: "Absolutely. We take data security seriously and use industry-standard encryption (SSL/TLS) to protect your data in transit. All sensitive information is encrypted at rest, and we regularly undergo security audits. We never share your personal or business data with third parties except as required to provide our services. You can read our full Privacy Policy for more details.",
    category: "Technical",
    tags: ["security", "privacy", "data"],
  },
  {
    id: "faq-12",
    question: "What browsers are supported?",
    answer: "USDrop works best on modern browsers including Chrome, Firefox, Safari, and Edge (latest versions). We recommend keeping your browser updated for the best experience. Some features may have limited functionality on older browser versions or mobile browsers.",
    category: "Technical",
    tags: ["browser", "compatibility", "requirements"],
  },
  {
    id: "faq-13",
    question: "Can I use USDrop on mobile?",
    answer: "USDrop is optimized for desktop and tablet use. While you can access the platform on mobile browsers, some features may have limited functionality or may not be fully responsive. We recommend using USDrop on a desktop or tablet for the best experience. A dedicated mobile app is planned for future release.",
    category: "Technical",
    tags: ["mobile", "responsive", "app"],
  },
  // Features FAQs
  {
    id: "faq-14",
    question: "How does the AI Studio work?",
    answer: "AI Studio is a suite of AI-powered creative tools including Logo Studio, Model Studio, and more. These tools use advanced AI to create marketing materials, design logos, and produce professional-quality assets. Simply provide a prompt or upload reference images, and our AI generates professional-quality assets in seconds.",
    category: "Features",
    tags: ["ai studio", "creatives", "images"],
  },
  {
    id: "faq-15",
    question: "How do I find winning products?",
    answer: "USDrop offers multiple ways to find winning products. The Winning Products section shows products with proven sales data and high profit potential. Product Hunt database lets you explore trending products. You can also use competitor analysis tools to see what's working for other stores. Filter by category, profit margin, shipping time, and other criteria to narrow your search.",
    category: "Features",
    tags: ["products", "research", "winning"],
  },
  {
    id: "faq-16",
    question: "What is the Shipping Calculator?",
    answer: "The Shipping Calculator helps you estimate shipping costs for products from different suppliers and regions. Input the product weight, dimensions, destination country, and shipping method to get accurate cost estimates. This tool is essential for calculating profit margins and setting competitive product prices.",
    category: "Features",
    tags: ["shipping", "calculator", "costs"],
  },
  {
    id: "faq-17",
    question: "How do private suppliers work?",
    answer: "Private suppliers are verified suppliers with exclusive products and better pricing. Access to private suppliers is available on select plans. Once you have access, you can browse exclusive products, see wholesale pricing, and place orders directly through USDrop. Private suppliers typically offer faster shipping and better quality control compared to public suppliers.",
    category: "Features",
    tags: ["suppliers", "fulfillment", "private"],
  },
]

export const articles: Article[] = [
  {
    id: "article-1",
    title: "Getting Started with Product Research",
    description: "Learn how to use USDrop's product research tools to find profitable products for your store.",
    category: "Products & Research",
    content: "Product research is the foundation of a successful dropshipping business. USDrop provides several tools to help you find winning products...",
    tags: ["research", "products", "getting started"],
  },
  {
    id: "article-2",
    title: "Setting Up Your First Shopify Integration",
    description: "Step-by-step guide to connecting your Shopify store to USDrop.",
    category: "Shopify Integration",
    content: "Connecting your Shopify store to USDrop unlocks powerful automation features...",
    tags: ["shopify", "integration", "setup"],
  },
  {
    id: "article-3",
    title: "Creating Stunning Product Images with AI Studio",
    description: "Master the art of AI-generated product photography and marketing visuals.",
    category: "AI Studio",
    content: "AI Studio's tools let you create professional product images and marketing materials without expensive photoshoots...",
    tags: ["ai studio", "images", "creatives"],
  },
]

export const sops: SOP[] = [
  {
    id: "sop-1",
    title: "Product Import Workflow",
    description: "Standard operating procedure for importing products from USDrop to your store.",
    category: "Getting Started",
    steps: [
      "Research and select products using USDrop tools",
      "Review product details, pricing, and shipping information",
      "Generate product images using AI Studio if needed",
      "Click 'Add to Store' and configure product settings",
      "Review and publish products to your Shopify store",
    ],
    tags: ["products", "import", "workflow"],
  },
  {
    id: "sop-2",
    title: "Order Fulfillment Process",
    description: "Step-by-step process for fulfilling orders through USDrop suppliers.",
    category: "Fulfillment",
    steps: [
      "Receive order notification in USDrop dashboard",
      "Review order details and customer information",
      "Select supplier and verify product availability",
      "Place order with supplier through USDrop",
      "Track shipment and update customer with tracking number",
      "Mark order as fulfilled in system",
    ],
    tags: ["orders", "fulfillment", "process"],
  },
]

export const allContent = {
  categoryCards,
  faqs,
  articles,
  sops,
}


















