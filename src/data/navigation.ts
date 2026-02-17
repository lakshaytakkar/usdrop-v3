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
  UserCircle,
  KeyRound,
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
    label: "Framework",
    items: [
      { title: "Home", icon: Home, url: "/home", isPro: false },
      { title: "My Roadmap", icon: Map, url: "/my-roadmap", isPro: false },
      { title: "My Profile", icon: UserCircle, url: "/my-profile", isPro: false },
      { title: "My Credentials", icon: KeyRound, url: "/my-credentials", isPro: false },
    ],
  },
  {
    label: "Mentorship",
    items: [
      { title: "Mentorship", icon: GraduationCap, url: "/mentorship", isPro: false },
    ],
  },
  {
    label: "Product",
    items: [
      { title: "Product Hunt", icon: TrendingUp, url: "/product-hunt", isPro: true },
      { title: "Winning Products", icon: Trophy, url: "/winning-products", isPro: true },
      { title: "Categories", icon: Grid3x3, url: "/categories", isPro: true },
      { title: "Seasonal Collections", icon: Calendar, url: "/seasonal-collections", isPro: true },
      { title: "Competitor Stores", icon: Store, url: "/competitor-stores", isPro: true },
    ],
  },
  {
    label: "Videos & Ads",
    items: [
      { title: "Meta Ads", icon: BarChart3, url: "/meta-ads", isPro: true },
    ],
  },
  {
    label: "Order Fulfilment",
    items: [
      { title: "Private Supplier", icon: Package, url: "/suppliers", isPro: true },
      { title: "Selling Channels", icon: ExternalLink, url: "/selling-channels", isPro: true },
      { title: "Shipping Calculator", icon: Truck, url: "/shipping-calculator", isPro: true },
    ],
  },
  {
    label: "Shopify",
    items: [
      { title: "My Store", icon: ShoppingBag, url: "/my-store", isPro: true },
      { title: "My Products", icon: Bookmark, url: "/my-products", isPro: true },
    ],
  },
  {
    label: "Studio",
    items: [
      { title: "Whitelabelling", icon: Badge, url: "/studio/whitelabelling", isPro: true },
      { title: "Model Studio", icon: User, url: "/studio/model-studio", isPro: true },
    ],
  },
  {
    label: "Important Tools",
    items: [
      { title: "Description Generator", icon: PenTool, url: "/tools/description-generator", isPro: true },
      { title: "Email Templates", icon: Mail, url: "/tools/email-templates", isPro: true },
      { title: "Policy Generator", icon: Shield, url: "/tools/policy-generator", isPro: true },
      { title: "Invoice Generator", icon: Receipt, url: "/tools/invoice-generator", isPro: true },
      { title: "Profit Calculator", icon: Calculator, url: "/tools/profit-calculator", isPro: true },
    ],
  },
  {
    label: "Blogs",
    items: [
      { title: "Blogs", icon: Newspaper, url: "/blogs", isPro: true },
    ],
  },
  {
    label: "Webinars",
    items: [
      { title: "Webinars", icon: Video, url: "/webinars", isPro: true },
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
