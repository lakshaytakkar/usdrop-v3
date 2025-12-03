export interface JourneyTask {
  id: string;
  title: string;
  description?: string;
  link?: string;
  completed: boolean;
}

export interface JourneyStage {
  id: string;
  number: number;
  title: string;
  description: string;
  tasks: JourneyTask[];
}

export const journeyStages: JourneyStage[] = [
  {
    id: "onboarding",
    number: 1,
    title: "Onboarding & Setup",
    description: "Get started with USDrop and access essential training resources",
    tasks: [
      {
        id: "onboarding-1",
        title: "Complete account setup",
        description: "Finish your profile and account configuration",
        completed: false,
      },
      {
        id: "onboarding-2",
        title: "Access Academy for framework training",
        description: "Learn the USDrop framework and best practices",
        link: "/academy",
        completed: false,
      },
      {
        id: "onboarding-3",
        title: "Review Intelligence articles",
        description: "Read strategic insights and industry knowledge",
        link: "/intelligence",
        completed: false,
      },
    ],
  },
  {
    id: "product-research",
    number: 2,
    title: "Product Research",
    description: "Discover winning products and analyze market opportunities",
    tasks: [
      {
        id: "research-1",
        title: "Explore Winning Products",
        description: "Browse curated winning products database",
        link: "/winning-products",
        completed: false,
      },
      {
        id: "research-2",
        title: "Browse Product Hunt",
        description: "Discover trending products and validate demand",
        link: "/product-hunt",
        completed: false,
      },
      {
        id: "research-3",
        title: "Research Competitor Stores",
        description: "Analyze successful stores in your niche",
        link: "/competitor-stores",
        completed: false,
      },
      {
        id: "research-4",
        title: "Analyze Categories",
        description: "Explore product categories and trends",
        link: "/categories",
        completed: false,
      },
    ],
  },
  {
    id: "brand-identity",
    number: 3,
    title: "Brand Identity",
    description: "Create your brand logo and visual identity",
    tasks: [
      {
        id: "brand-1",
        title: "Create brand logo using Logo Studio",
        description: "Design your brand logo with AI-powered tools",
        link: "/ai-toolkit/logo-studio",
        completed: false,
      },
      {
        id: "brand-2",
        title: "Design store banner using Image Studio",
        description: "Create professional store banners and graphics",
        link: "/ai-toolkit/image-studio",
        completed: false,
      },
      {
        id: "brand-3",
        title: "Finalize brand name and domain",
        description: "Choose your brand name and secure your domain",
        completed: false,
      },
    ],
  },
  {
    id: "product-selection",
    number: 4,
    title: "Product Selection",
    description: "Curate your product catalog and analyze profitability",
    tasks: [
      {
        id: "selection-1",
        title: "Add 5 products to My Products",
        description: "Build your initial product selection",
        link: "/picklist",
        completed: false,
      },
      {
        id: "selection-2",
        title: "Create product collections",
        description: "Organize products into collections",
        link: "/picklist",
        completed: false,
      },
      {
        id: "selection-3",
        title: "Use Profit Calculator for analysis",
        description: "Calculate profit margins and pricing",
        link: "/ai-toolkit/profit-calculator",
        completed: false,
      },
    ],
  },
  {
    id: "store-setup",
    number: 5,
    title: "Store Setup",
    description: "Set up your Shopify store and configure settings",
    tasks: [
      {
        id: "store-1",
        title: "Connect Shopify store",
        description: "Link your Shopify account to USDrop",
        link: "/shopify-stores",
        completed: false,
      },
      {
        id: "store-2",
        title: "Complete store policies",
        description: "Add privacy policy, terms of service, and refund policy",
        link: "/shopify-stores",
        completed: false,
      },
      {
        id: "store-3",
        title: "Upload products to store",
        description: "Import your selected products to Shopify",
        link: "/shopify-stores",
        completed: false,
      },
    ],
  },
  {
    id: "creative-assets",
    number: 6,
    title: "Creative Assets",
    description: "Generate professional product images and ad creatives",
    tasks: [
      {
        id: "creative-1",
        title: "Generate product images with Image Studio",
        description: "Create multiple product views and angles",
        link: "/ai-toolkit/image-studio",
        completed: false,
      },
      {
        id: "creative-2",
        title: "Create model ads with Model Studio",
        description: "Generate model advertisements for apparel",
        link: "/ai-toolkit/model-studio",
        completed: false,
      },
      {
        id: "creative-3",
        title: "Design ad creatives with Ad Studio",
        description: "Create compelling ad visuals and copy",
        link: "/ai-toolkit/ad-studio",
        completed: false,
      },
    ],
  },
  {
    id: "campaign-planning",
    number: 7,
    title: "Campaign Planning",
    description: "Plan your advertising strategy and campaigns",
    tasks: [
      {
        id: "campaign-1",
        title: "Use Campaign Studio for strategy",
        description: "Plan your Meta advertising campaigns",
        link: "/ai-toolkit/campaign-studio",
        completed: false,
      },
      {
        id: "campaign-2",
        title: "Research Meta Ads",
        description: "Analyze competitor ads and strategies",
        link: "/meta-ads",
        completed: false,
      },
      {
        id: "campaign-3",
        title: "Plan budget and targeting",
        description: "Define your ad budget and target audience",
        link: "/ai-toolkit/campaign-studio",
        completed: false,
      },
    ],
  },
  {
    id: "launch-optimize",
    number: 8,
    title: "Launch & Optimize",
    description: "Launch your campaigns and continuously improve performance",
    tasks: [
      {
        id: "launch-1",
        title: "Launch first campaign",
        description: "Start your first Meta advertising campaign",
        completed: false,
      },
      {
        id: "launch-2",
        title: "Track performance",
        description: "Monitor ROAS, CTR, and other key metrics",
        completed: false,
      },
      {
        id: "launch-3",
        title: "Optimize based on results",
        description: "Adjust campaigns based on performance data",
        completed: false,
      },
      {
        id: "launch-4",
        title: "Continue learning from Academy",
        description: "Keep improving with ongoing training",
        link: "/academy",
        completed: false,
      },
    ],
  },
];

