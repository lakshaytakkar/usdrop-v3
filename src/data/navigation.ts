import {
  TrendingUp,
  Trophy,
  Store,
  Grid3x3,
  Package,
  BarChart3,
  Home,
  Bookmark,
  ShoppingBag,
  GraduationCap,
  Newspaper,
  Video,
  ExternalLink,
  Truck,
  LucideIcon,
  Map,
  Badge,
  User,
  Calculator,
  PenTool,
  Mail,
  Shield,
  Receipt,
  Calendar,
} from "lucide-react"

export interface NavItem {
  title: string
  icon: LucideIcon
  url: string
  isPro?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const externalNavGroups: NavGroup[] = [
  {
    label: "My DS Framework",
    items: [
      { title: "Home", icon: Home, url: "/home", isPro: false },
      { title: "My Mentor", icon: GraduationCap, url: "/academy", isPro: false },
      { title: "My Roadmap", icon: Map, url: "/my-journey", isPro: true },
      { title: "My Products", icon: Bookmark, url: "/my-products", isPro: true },
      { title: "My Shopify Store", icon: ShoppingBag, url: "/my-shopify-stores", isPro: true },
    ],
  },
  {
    label: "Research",
    items: [
      { title: "Product Hunt", icon: TrendingUp, url: "/product-hunt", isPro: true },
      { title: "Winning Products", icon: Trophy, url: "/winning-products", isPro: true },
      { title: "Competitor Stores", icon: Store, url: "/competitor-stores", isPro: true },
      { title: "Categories", icon: Grid3x3, url: "/categories", isPro: true },
      { title: "Seasonal Collections", icon: Calendar, url: "/seasonal-collections", isPro: true },
      { title: "Meta Ads", icon: BarChart3, url: "/meta-ads", isPro: true },
    ],
  },
  {
    label: "Learn",
    items: [
      { title: "Intelligence", icon: Newspaper, url: "/intelligence", isPro: true },
      { title: "Webinars", icon: Video, url: "/webinars", isPro: true },
    ],
  },
  {
    label: "Fulfilment",
    items: [
      { title: "Private Supplier", icon: Package, url: "/suppliers", isPro: true },
      { title: "Selling Channels", icon: ExternalLink, url: "/selling-channels", isPro: true },
      { title: "Shipping Calculator", icon: Truck, url: "/ai-toolkit/shipping-calculator", isPro: true },
    ],
  },
  {
    label: "Studio",
    items: [
      { title: "Whitelabelling", icon: Badge, url: "/ai-toolkit/logo-studio", isPro: true },
      { title: "Model Studio", icon: User, url: "/ai-toolkit/model-studio", isPro: true },
    ],
  },
  {
    label: "Toolkit",
    items: [
      { title: "Description Generator", icon: PenTool, url: "/ai-toolkit/description-generator", isPro: true },
      { title: "Email Templates", icon: Mail, url: "/ai-toolkit/email-templates", isPro: true },
      { title: "Policy Generator", icon: Shield, url: "/ai-toolkit/policy-generator", isPro: true },
      { title: "Invoice Generator", icon: Receipt, url: "/ai-toolkit/invoice-generator", isPro: true },
      { title: "Profit Calculator", icon: Calculator, url: "/ai-toolkit/profit-calculator", isPro: true },
    ],
  },
]

export function findActiveGroup(pathname: string): NavGroup | null {
  for (const group of externalNavGroups) {
    for (const item of group.items) {
      if (pathname === item.url || pathname.startsWith(item.url + "/")) {
        return group
      }
    }
  }
  return null
}

export function findActiveItem(pathname: string): NavItem | null {
  for (const group of externalNavGroups) {
    for (const item of group.items) {
      if (pathname === item.url || pathname.startsWith(item.url + "/")) {
        return item
      }
    }
  }
  return null
}
