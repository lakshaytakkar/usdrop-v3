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
  FileText,
  MonitorPlay,
  MoreHorizontal,
  FlaskConical,
  Building2,
  FolderOpen,
} from "lucide-react"

export interface NavItem {
  title: string
  icon: LucideIcon
  url: string
  isPro?: boolean
  isAiStudio?: boolean
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
      { title: "My Framework", icon: Home, url: "/framework", isPro: false },
      { title: "My Products", icon: Bookmark, url: "/framework/my-products", isPro: false },
      { title: "My Store", icon: ShoppingBag, url: "/framework/my-store", isPro: true },
      { title: "My Roadmap", icon: Map, url: "/framework/my-roadmap", isPro: false },
      { title: "My Learning", icon: GraduationCap, url: "/framework/my-learning", isPro: false },
      { title: "My Sessions", icon: MonitorPlay, url: "/framework/my-sessions", isPro: false },
      { title: "My R&D", icon: FlaskConical, url: "/framework/my-rnd", isPro: false },
      { title: "My Profile", icon: UserCircle, url: "/framework/my-profile", isPro: false },
      { title: "My Credentials", icon: KeyRound, url: "/framework/my-credentials", isPro: false },
      { title: "My Plan", icon: Shield, url: "/framework/my-plan", isPro: false },
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
    label: "Private Supplier",
    icon: Package,
    iconSrc: "/3d-ecom-icons-blue/Delivery_Truck.png",
    items: [
      { title: "Private Supplier", icon: Package, url: "/suppliers", isPro: false },
    ],
  },
  {
    label: "LLC",
    icon: Building2,
    iconSrc: "/3d-ecom-icons-blue/Category_Grid.png",
    items: [
      { title: "LLC Formation", icon: Building2, url: "/llc", isPro: false },
    ],
  },
  {
    label: "AI Studio",
    icon: Palette,
    iconSrc: "/3d-ecom-icons-blue/Toolbox_Wrench.png",
    items: [
      { title: "Model Studio", icon: User, url: "/ai-studio/model-studio", isPro: true, isAiStudio: true },
      { title: "Whitelabelling", icon: Badge, url: "/ai-studio/whitelabelling", isPro: true, isAiStudio: true },
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
      { title: "Shipping Calculator", icon: Truck, url: "/tools/shipping-calculator", isPro: true },
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
