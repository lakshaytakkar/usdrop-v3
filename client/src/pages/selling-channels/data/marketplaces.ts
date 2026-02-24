export interface Marketplace {
  id: string
  name: string
  brandColor: string
  sellerPanelUrl: string
  requirements: string[]
  isLocked: boolean
  logoUrl?: string
}

export const marketplaces: Marketplace[] = [
  {
    id: "amazon",
    name: "Amazon",
    brandColor: "#FF9900",
    sellerPanelUrl: "https://sellercentral.amazon.com/",
    logoUrl: "/images/logos/amazon.svg",
    requirements: [
      "Business License",
      "Tax ID (EIN)",
      "Bank Account",
      "Credit Card",
      "Phone Verification",
      "Product Insurance"
    ],
    isLocked: false
  },
  {
    id: "chairish",
    name: "Chairish",
    brandColor: "#1A1A1A",
    sellerPanelUrl: "https://www.chairish.com/sell",
    logoUrl: "/images/logos/chairish.svg",
    requirements: [
      "Business License",
      "Tax ID",
      "Bank Account",
      "Product Photos"
    ],
    isLocked: false
  },
  {
    id: "ebay",
    name: "eBay",
    brandColor: "#E53238",
    sellerPanelUrl: "https://www.ebay.com/sh/landing",
    logoUrl: "/images/logos/ebay.svg",
    requirements: [
      "Bank Account",
      "Credit Card",
      "Phone Verification",
      "PayPal Account"
    ],
    isLocked: false
  },
  {
    id: "creoate",
    name: "Creoate",
    brandColor: "#6366F1",
    sellerPanelUrl: "https://creoate.com/sell",
    logoUrl: "/images/logos/creoate.svg",
    requirements: [
      "Business License",
      "Tax ID",
      "Bank Account",
      "Minimum Order Volume"
    ],
    isLocked: true
  },
  {
    id: "fashiongo",
    name: "FashionGo",
    brandColor: "#E91E63",
    sellerPanelUrl: "https://www.fashiongo.net/",
    logoUrl: "/images/logos/fashiongo.svg",
    requirements: [
      "Business License",
      "Tax ID",
      "Resale Certificate",
      "Bank Account"
    ],
    isLocked: true
  },
  {
    id: "walmart",
    name: "Walmart Marketplace",
    brandColor: "#0071DC",
    sellerPanelUrl: "https://marketplace.walmart.com/",
    logoUrl: "/images/logos/walmart.svg",
    requirements: [
      "Business License",
      "Tax ID (EIN)",
      "Bank Account",
      "W-9 Form",
      "Product Catalog",
      "Minimum Sales Volume"
    ],
    isLocked: true
  },
  {
    id: "etsy",
    name: "Etsy",
    brandColor: "#F1641E",
    sellerPanelUrl: "https://www.etsy.com/sell",
    logoUrl: "/images/logos/etsy.svg",
    requirements: [
      "Bank Account",
      "Credit Card",
      "Phone Verification",
      "Identity Verification"
    ],
    isLocked: false
  },
  {
    id: "poshmark",
    name: "Poshmark",
    brandColor: "#C1272D",
    sellerPanelUrl: "https://poshmark.com/sell",
    logoUrl: "/images/logos/poshmark.svg",
    requirements: [
      "Bank Account",
      "Phone Verification",
      "Social Media Account"
    ],
    isLocked: false
  },
  {
    id: "mercari",
    name: "Mercari",
    brandColor: "#4DC3FF",
    sellerPanelUrl: "https://www.mercari.com/sell/",
    logoUrl: "/images/logos/mercari.svg",
    requirements: [
      "Bank Account",
      "Phone Verification",
      "Identity Verification"
    ],
    isLocked: false
  },
  {
    id: "bonanza",
    name: "Bonanza",
    brandColor: "#2E7D32",
    sellerPanelUrl: "https://www.bonanza.com/sell",
    logoUrl: "/images/logos/bonanza.svg",
    requirements: [
      "Bank Account",
      "Credit Card",
      "Phone Verification"
    ],
    isLocked: false
  },
  {
    id: "newegg",
    name: "Newegg",
    brandColor: "#F7931E",
    sellerPanelUrl: "https://www.newegg.com/sell",
    logoUrl: "/images/logos/newegg.svg",
    requirements: [
      "Business License",
      "Tax ID",
      "Bank Account",
      "Product Catalog",
      "Minimum Sales Volume"
    ],
    isLocked: true
  },
  {
    id: "wayfair",
    name: "Wayfair",
    brandColor: "#7B2D8E",
    sellerPanelUrl: "https://partners.wayfair.com/",
    logoUrl: "/images/logos/wayfair.svg",
    requirements: [
      "Business License",
      "Tax ID (EIN)",
      "Bank Account",
      "Product Catalog",
      "Warehouse Capability",
      "Minimum Sales Volume"
    ],
    isLocked: true
  },
  {
    id: "overstock",
    name: "Overstock",
    brandColor: "#D32F2F",
    sellerPanelUrl: "https://www.overstock.com/partners",
    logoUrl: "/images/logos/overstock.svg",
    requirements: [
      "Business License",
      "Tax ID",
      "Bank Account",
      "Product Catalog"
    ],
    isLocked: true
  },
  {
    id: "reverb",
    name: "Reverb",
    brandColor: "#2D4A9E",
    sellerPanelUrl: "https://reverb.com/sell",
    logoUrl: "/images/logos/reverb.svg",
    requirements: [
      "Bank Account",
      "Phone Verification",
      "Product Photos"
    ],
    isLocked: false
  }
]
