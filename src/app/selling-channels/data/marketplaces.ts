export interface Marketplace {
  id: string
  name: string
  logo: string // path to logo image or external URL
  sellerPanelUrl: string // external URL to seller panel
  requirements: string[] // array of requirement strings
  isLocked: boolean
}

export const marketplaces: Marketplace[] = [
  {
    id: "amazon",
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    sellerPanelUrl: "https://sellercentral.amazon.com/",
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
    logo: "https://www.chairish.com/favicon.ico",
    sellerPanelUrl: "https://www.chairish.com/sell",
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
    logo: "https://www.ebay.com/favicon.ico",
    sellerPanelUrl: "https://www.ebay.com/sh/landing",
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
    logo: "https://creoate.com/favicon.ico",
    sellerPanelUrl: "https://creoate.com/sell",
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
    logo: "https://www.fashiongo.net/favicon.ico",
    sellerPanelUrl: "https://www.fashiongo.net/",
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
    logo: "https://www.walmart.com/favicon.ico",
    sellerPanelUrl: "https://marketplace.walmart.com/",
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
    logo: "https://www.etsy.com/favicon.ico",
    sellerPanelUrl: "https://www.etsy.com/sell",
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
    logo: "https://poshmark.com/favicon.ico",
    sellerPanelUrl: "https://poshmark.com/sell",
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
    logo: "https://www.mercari.com/favicon.ico",
    sellerPanelUrl: "https://www.mercari.com/sell/",
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
    logo: "https://www.bonanza.com/favicon.ico",
    sellerPanelUrl: "https://www.bonanza.com/sell",
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
    logo: "https://www.newegg.com/favicon.ico",
    sellerPanelUrl: "https://www.newegg.com/sell",
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
    logo: "https://www.wayfair.com/favicon.ico",
    sellerPanelUrl: "https://partners.wayfair.com/",
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
    logo: "https://www.overstock.com/favicon.ico",
    sellerPanelUrl: "https://www.overstock.com/partners",
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
    logo: "https://reverb.com/favicon.ico",
    sellerPanelUrl: "https://reverb.com/sell",
    requirements: [
      "Bank Account",
      "Phone Verification",
      "Product Photos"
    ],
    isLocked: false
  }
]

