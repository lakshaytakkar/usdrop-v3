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
  Compass,
  Palette,
  Wrench,
  FileText,
  MonitorPlay,
  MoreHorizontal,
} from "lucide-react"

export interface NavItem {
  title: string
  icon: LucideIcon
  url: string
  isPro?: boolean
  iconSrc?: string
  description?: string
}

export interface NavGroup {
  label: string
  icon: LucideIcon
  iconSrc?: string
  items: NavItem[]
  isDropdown?: boolean
}

export const externalNavGroups: NavGroup[] = [
  {
    label: "Framework",
    icon: Compass,
    iconSrc: "/3d-ecom-icons-blue/Category_Grid.png",
    items: [
      { title: "Dashboard", icon: Home, url: "/home", isPro: false },
      { title: "My Products", icon: Bookmark, url: "/my-products", isPro: false },
      { title: "My Store", icon: ShoppingBag, url: "/my-store", isPro: true },
      { title: "My Roadmap", icon: Map, url: "/my-roadmap", isPro: false },
      { title: "My Profile", icon: UserCircle, url: "/my-profile", isPro: false },
      { title: "My Credentials", icon: KeyRound, url: "/my-credentials", isPro: false },
    ],
  },
  {
    label: "Mentorship",
    icon: GraduationCap,
    iconSrc: "/3d-ecom-icons-blue/Graduation_Book.png",
    items: [
      { title: "Mentorship", icon: GraduationCap, url: "/mentorship", isPro: false },
    ],
  },
  {
    label: "Products",
    icon: Package,
    iconSrc: "/3d-ecom-icons-blue/Search_Product.png",
    items: [
      { title: "Product Hunt", icon: TrendingUp, url: "/product-hunt", isPro: true },
      { title: "Winning Products", icon: Trophy, url: "/winning-products", isPro: true },
      { title: "Categories", icon: Grid3x3, url: "/categories", isPro: true },
      { title: "Seasonal Collections", icon: Calendar, url: "/seasonal-collections", isPro: true },
      { title: "Competitor Stores", icon: Store, url: "/competitor-stores", isPro: true },
    ],
  },
  {
    label: "Ads",
    icon: BarChart3,
    iconSrc: "/3d-ecom-icons-blue/Megaphone_Ads.png",
    items: [
      { title: "Meta Ads", icon: BarChart3, url: "/meta-ads", isPro: true },
    ],
  },
  {
    label: "Fulfilment",
    icon: Truck,
    iconSrc: "/3d-ecom-icons-blue/Delivery_Truck.png",
    items: [
      { title: "Private Supplier", icon: Package, url: "/suppliers", isPro: true },
      { title: "Selling Channels", icon: ExternalLink, url: "/selling-channels", isPro: true },
      { title: "Shipping Calculator", icon: Truck, url: "/shipping-calculator", isPro: true },
    ],
  },
  {
    label: "Tools",
    icon: Wrench,
    iconSrc: "/3d-ecom-icons-blue/Toolbox_Wrench.png",
    items: [
      { title: "Description Generator", icon: PenTool, url: "/tools/description-generator", isPro: true },
      { title: "Email Templates", icon: Mail, url: "/tools/email-templates", isPro: true },
      { title: "Policy Generator", icon: Shield, url: "/tools/policy-generator", isPro: true },
      { title: "Invoice Generator", icon: Receipt, url: "/tools/invoice-generator", isPro: true },
      { title: "Profit Calculator", icon: Calculator, url: "/tools/profit-calculator", isPro: true },
      { title: "Whitelabelling", icon: Badge, url: "/studio/whitelabelling", isPro: true },
      { title: "Model Studio", icon: User, url: "/studio/model-studio", isPro: true },
    ],
  },
  {
    label: "More",
    icon: MoreHorizontal,
    isDropdown: true,
    items: [
      { title: "Shopify Integration", icon: ShoppingBag, url: "/shopify", isPro: true, iconSrc: "/3d-ecom-icons-blue/My_Store.png", description: "Connect and manage your Shopify stores" },
      { title: "Blogs", icon: Newspaper, url: "/blogs", isPro: true, iconSrc: "/3d-ecom-icons-blue/Open_Board.png", description: "Latest e-commerce insights and guides" },
      { title: "Webinars", icon: Video, url: "/webinars", isPro: true, iconSrc: "/3d-ecom-icons-blue/Webinar_Video.png", description: "Live sessions with industry experts" },
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
