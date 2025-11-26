import { ShopifyStore } from "@/app/shopify-stores/data/stores"

export const adminSampleStores: ShopifyStore[] = [
  {
    id: "store-001",
    name: "My Fashion Store",
    url: "myfashionstore.myshopify.com",
    status: "connected",
    connectedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "store-002",
    name: "Tech Gadgets Hub",
    url: "techgadgets.myshopify.com",
    status: "connected",
    connectedAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "store-003",
    name: "Home Decor Plus",
    url: "homedecorplus.myshopify.com",
    status: "disconnected",
    connectedAt: "2024-01-05T09:15:00Z",
  },
]


