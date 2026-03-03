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
  ClipboardCheck,
  FileText,
  MonitorPlay,
  MoreHorizontal,
  FlaskConical,
  Building2,
  FolderOpen,
  Flame,
} from "lucide-react"

export interface NavItem {
  title: string
  icon: LucideIcon
  url: string
  isPro?: boolean
  isAiStudio?: boolean
  iconSrc?: string
  description?: string
  moduleId?: string
}

export interface NavGroup {
  label: string
  icon: LucideIcon
  iconSrc?: string
  items: NavItem[]
  isDropdown?: boolean
  isNew?: boolean
}

export const externalNavGroups: NavGroup[] = [
  {
    label: "Free Learning",
    icon: GraduationCap,
    iconSrc: "/3d-ecom-icons-blue/Graduation_Book.png",
    items: [
      { title: "Free Learning", icon: GraduationCap, url: "/free-learning", isPro: false, moduleId: "courses" },
    ],
  },
  {
    label: "My Mentorship",
    icon: Compass,
    iconSrc: "/3d-ecom-icons-blue/Category_Grid.png",
    items: [
      { title: "Framework", icon: Home, url: "/framework", isPro: false, moduleId: "mentorship" },
      { title: "My Products", icon: Bookmark, url: "/framework/my-products", isPro: false, moduleId: "my-products" },
      { title: "My Store", icon: ShoppingBag, url: "/framework/my-store", isPro: true, moduleId: "my-store" },
      { title: "My Roadmap", icon: Map, url: "/framework/my-roadmap", isPro: false, moduleId: "my-roadmap" },
      { title: "My Learning", icon: GraduationCap, url: "/framework/my-learning", isPro: false, moduleId: "courses" },
      { title: "My Sessions", icon: MonitorPlay, url: "/framework/my-sessions", isPro: false, moduleId: "mentorship" },
      { title: "My R&D", icon: FlaskConical, url: "/framework/my-rnd", isPro: false },
      { title: "My Profile", icon: UserCircle, url: "/framework/my-profile", isPro: false },
      { title: "My Credentials", icon: KeyRound, url: "/framework/my-credentials", isPro: false, moduleId: "my-credentials" },
      { title: "My Plan", icon: Shield, url: "/framework/my-plan", isPro: false },
    ],
  },
  {
    label: "Products",
    icon: Package,
    iconSrc: "/3d-ecom-icons-blue/Search_Product.png",
    items: [
      { title: "Product Hunt", icon: TrendingUp, url: "/products/product-hunt", isPro: true, moduleId: "product-hunt" },
      { title: "Winning Products", icon: Trophy, url: "/products/winning-products", isPro: true, moduleId: "winning-products" },
      { title: "Categories", icon: Grid3x3, url: "/products/categories", isPro: true, moduleId: "categories" },
      { title: "Seasonal Collections", icon: Calendar, url: "/products/seasonal-collections", isPro: true, moduleId: "seasonal-collections" },
      { title: "Trending", icon: Flame, url: "/products/trending", isPro: true, moduleId: "winning-products" },
      { title: "Competitor Stores", icon: Store, url: "/products/competitor-stores", isPro: true, moduleId: "competitor-stores" },
    ],
  },
  {
    label: "Videos & Ads",
    icon: BarChart3,
    iconSrc: "/3d-ecom-icons-blue/Megaphone_Ads.png",
    items: [
      { title: "Videos", icon: Video, url: "/ads/videos", isPro: true, moduleId: "meta-ads" },
      { title: "Meta Ads", icon: BarChart3, url: "/ads/meta-ads", isPro: true, iconSrc: "/images/meta-logo.svg", moduleId: "meta-ads" },
    ],
  },
  {
    label: "Marketplaces",
    icon: Store,
    iconSrc: "/3d-ecom-icons-blue/Delivery_Truck.png",
    items: [
      { title: "Selling Channels", icon: Store, url: "/selling-channels", isPro: true, moduleId: "selling-channels" },
    ],
  },
  {
    label: "LLC",
    icon: Building2,
    iconSrc: "/3d-ecom-icons-blue/Category_Grid.png",
    items: [
      { title: "LLC Formation", icon: Building2, url: "/llc", isPro: false, moduleId: "fulfillment" },
    ],
  },
  {
    label: "AI Studio",
    icon: Palette,
    iconSrc: "/3d-ecom-icons-blue/Toolbox_Wrench.png",
    isNew: true,
    items: [
      { title: "Model Studio", icon: User, url: "/ai-studio/model-studio", isPro: true, isAiStudio: true, moduleId: "studio" },
      { title: "Whitelabelling", icon: Badge, url: "/ai-studio/whitelabelling", isPro: true, isAiStudio: true, moduleId: "studio" },
    ],
  },
  {
    label: "Tools",
    icon: Wrench,
    iconSrc: "/3d-ecom-icons-blue/Toolbox_Wrench.png",
    isNew: true,
    items: [
      { title: "Description Generator", icon: PenTool, url: "/tools/description-generator", isPro: true, moduleId: "tools" },
      { title: "Email Templates", icon: Mail, url: "/tools/email-templates", isPro: true, moduleId: "tools" },
      { title: "Policy Generator", icon: Shield, url: "/tools/policy-generator", isPro: true, moduleId: "tools" },
      { title: "Invoice Generator", icon: Receipt, url: "/tools/invoice-generator", isPro: true, moduleId: "tools" },
      { title: "Profit Calculator", icon: Calculator, url: "/tools/profit-calculator", isPro: true, moduleId: "tools" },
      { title: "Shipping Calculator", icon: Truck, url: "/tools/shipping-calculator", isPro: true, moduleId: "tools" },
      { title: "CRO Checklist", icon: ClipboardCheck, url: "/tools/cro-checklist", isPro: false, moduleId: "tools" },
    ],
  },
  {
    label: "Resources",
    icon: FolderOpen,
    iconSrc: "/3d-ecom-icons-blue/Open_Board.png",
    items: [
      { title: "Resources", icon: FolderOpen, url: "/resources", isPro: false },
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
