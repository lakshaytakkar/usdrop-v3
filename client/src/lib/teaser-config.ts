export type TeaserStrategy =
  | "list-blur"
  | "card-lock"
  | "button-lock"
  | "full-page-lock"
  | "partial-lock"
  | "none"

export interface TeaserPageConfig {
  strategy: TeaserStrategy
  visibleItems: number
  lockMessage: string
  ctaText: string
  contentType: string
}

const DEFAULT_CTA = "Go to Free Learning"
const DEFAULT_MSG = "Complete Free Learning to unlock"

export const teaserConfig: Record<string, TeaserPageConfig> = {
  "/products/product-hunt": {
    strategy: "card-lock",
    visibleItems: 4,
    lockMessage: "Complete Free Learning to explore all products",
    ctaText: DEFAULT_CTA,
    contentType: "products",
  },
  "/products/winning-products": {
    strategy: "list-blur",
    visibleItems: 4,
    lockMessage: "Complete Free Learning to see all winning products",
    ctaText: DEFAULT_CTA,
    contentType: "products",
  },
  "/products/competitor-stores": {
    strategy: "list-blur",
    visibleItems: 4,
    lockMessage: "Complete Free Learning to view all competitor stores",
    ctaText: DEFAULT_CTA,
    contentType: "stores",
  },
  "/products/categories": {
    strategy: "card-lock",
    visibleItems: 4,
    lockMessage: "Complete Free Learning to browse all categories",
    ctaText: DEFAULT_CTA,
    contentType: "categories",
  },
  "/products/seasonal-collections": {
    strategy: "card-lock",
    visibleItems: 4,
    lockMessage: "Complete Free Learning to see all seasonal collections",
    ctaText: DEFAULT_CTA,
    contentType: "collections",
  },
  "/products/trending": {
    strategy: "card-lock",
    visibleItems: 4,
    lockMessage: "Complete Free Learning to see all trending products",
    ctaText: DEFAULT_CTA,
    contentType: "products",
  },

  "/framework/my-products": {
    strategy: "list-blur",
    visibleItems: 3,
    lockMessage: "Complete Free Learning to manage all your products",
    ctaText: DEFAULT_CTA,
    contentType: "products",
  },
  "/framework/my-store": {
    strategy: "button-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to connect your store",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/framework/my-roadmap": {
    strategy: "card-lock",
    visibleItems: 3,
    lockMessage: "Complete Free Learning to unlock your full roadmap",
    ctaText: DEFAULT_CTA,
    contentType: "steps",
  },
  "/framework/my-learning": {
    strategy: "card-lock",
    visibleItems: 2,
    lockMessage: "Complete Free Learning to access all mentorship courses",
    ctaText: DEFAULT_CTA,
    contentType: "courses",
  },
  "/framework/my-sessions": {
    strategy: "card-lock",
    visibleItems: 3,
    lockMessage: "Complete Free Learning to watch all mentorship sessions",
    ctaText: DEFAULT_CTA,
    contentType: "sessions",
  },
  "/framework/my-rnd": {
    strategy: "full-page-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to access R&D tools",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/framework/my-apps": {
    strategy: "button-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to manage your apps",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },

  "/tools/description-generator": {
    strategy: "button-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to generate descriptions",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/tools/email-templates": {
    strategy: "button-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to generate email templates",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/tools/policy-generator": {
    strategy: "button-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to generate policies",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/tools/invoice-generator": {
    strategy: "button-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to generate invoices",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/tools/cro-checklist": {
    strategy: "card-lock",
    visibleItems: 3,
    lockMessage: "Complete Free Learning to access the full CRO checklist",
    ctaText: DEFAULT_CTA,
    contentType: "items",
  },

  "/ai-studio/model-studio": {
    strategy: "full-page-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to access AI Model Studio",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/ai-studio/whitelabelling": {
    strategy: "full-page-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to access Whitelabelling",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/ads/meta-ads": {
    strategy: "button-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to create Meta Ads",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/ads/videos": {
    strategy: "card-lock",
    visibleItems: 4,
    lockMessage: "Complete Free Learning to browse all ad videos",
    ctaText: DEFAULT_CTA,
    contentType: "videos",
  },

  "/blogs": {
    strategy: "card-lock",
    visibleItems: 4,
    lockMessage: "Complete Free Learning to read all articles",
    ctaText: DEFAULT_CTA,
    contentType: "articles",
  },
  "/selling-channels": {
    strategy: "card-lock",
    visibleItems: 3,
    lockMessage: "Complete Free Learning to explore all selling channels",
    ctaText: DEFAULT_CTA,
    contentType: "channels",
  },
  "/fulfillment": {
    strategy: "button-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to access fulfillment tools",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/private-supplier": {
    strategy: "full-page-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to access private suppliers",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/shopify-stores": {
    strategy: "button-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to connect Shopify stores",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/store-research": {
    strategy: "button-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to research stores",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/research-tools": {
    strategy: "button-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to use research tools",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
  "/intelligence-hub": {
    strategy: "card-lock",
    visibleItems: 3,
    lockMessage: "Complete Free Learning to access all intelligence reports",
    ctaText: DEFAULT_CTA,
    contentType: "reports",
  },
  "/resources": {
    strategy: "card-lock",
    visibleItems: 3,
    lockMessage: "Complete Free Learning to access all resources",
    ctaText: DEFAULT_CTA,
    contentType: "resources",
  },
  "/prompt-analyzer": {
    strategy: "button-lock",
    visibleItems: 0,
    lockMessage: "Complete Free Learning to analyze prompts",
    ctaText: DEFAULT_CTA,
    contentType: "features",
  },
}

export function getTeaserConfig(path: string): TeaserPageConfig | null {
  const exactMatch = teaserConfig[path]
  if (exactMatch) return exactMatch

  for (const [key, config] of Object.entries(teaserConfig)) {
    if (path.startsWith(key + "/")) return config
  }

  return null
}

export function shouldApplyTeaser(path: string): boolean {
  return getTeaserConfig(path) !== null
}
