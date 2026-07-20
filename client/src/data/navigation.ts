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
          AppWindow,
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
          hideForFree?: boolean
          moduleId?: string
        }

        export interface NavGroup {
          label: string
          icon: LucideIcon
          iconSrc?: string
          items: NavItem[]
          isDropdown?: boolean
          isNew?: boolean
          comingSoon?: boolean
          accent?: "green"
          hideFromTopNav?: boolean
        }

        export const externalNavGroups: NavGroup[] = [
          {
            label: "Free Learning",
            icon: GraduationCap,
            iconSrc: "/3d-ecom-icons-blue/Graduation_Book.png",
            items: [
              { title: "Free Learning", icon: GraduationCap, url: "/free-learning", isPro: false },
            ],
          },
          {
            label: "My Mentorship",
            icon: Compass,
            iconSrc: "/3d-ecom-icons-blue/Category_Grid.png",
            items: [
              { title: "Framework", icon: Home, url: "/framework", isPro: false },
              { title: "My Products", icon: Bookmark, url: "/framework/my-products", isPro: false },
              { title: "My Roadmap", icon: Map, url: "/framework/my-roadmap", isPro: false },
              { title: "My Learning", icon: GraduationCap, url: "/framework/my-learning", isPro: false },
              { title: "My Sessions", icon: MonitorPlay, url: "/framework/my-sessions", isPro: false },
              { title: "My R&D", icon: FlaskConical, url: "/framework/my-rnd", isPro: false },
              { title: "My Ads", icon: Flame, url: "/framework/my-ads", isPro: false },
              { title: "My Profile", icon: UserCircle, url: "/framework/my-profile", isPro: false },
              { title: "My Plan", icon: Shield, url: "/framework/my-plan", isPro: false, hideForFree: true },
              { title: "My Apps", icon: AppWindow, url: "/framework/my-apps", isPro: false },
            ],
          },
          {
            label: "Products",
            icon: Package,
            iconSrc: "/3d-ecom-icons-blue/Search_Product.png",
            items: [
              { title: "Product Hunt", icon: TrendingUp, url: "/products/product-hunt", isPro: true },
              { title: "Trending", icon: Flame, url: "/products/trending", isPro: true },
              { title: "Winning Products", icon: Trophy, url: "/products/winning-products", isPro: true },
              { title: "Categories", icon: Grid3x3, url: "/products/categories", isPro: true },
              { title: "Seasonal Collections", icon: Calendar, url: "/products/seasonal-collections", isPro: true },
              { title: "Competitor Stores", icon: Store, url: "/products/competitor-stores", isPro: true },
            ],
          },
          {
            label: "Store",
            icon: ShoppingBag,
            iconSrc: "/3d-ecom-icons-blue/Search_Product.png",
            hideFromTopNav: true,
            items: [
              { title: "Dashboard", icon: BarChart3, url: "/store", isPro: true },
              { title: "Products", icon: Package, url: "/store/products", isPro: true },
              { title: "Inventory", icon: Grid3x3, url: "/store/inventory", isPro: true },
              { title: "Orders", icon: ShoppingBag, url: "/store/orders", isPro: true },
              { title: "Customers", icon: User, url: "/store/customers", isPro: true },
            ],
          },
          {
            label: "Marketplaces",
            icon: Store,
            iconSrc: "/3d-ecom-icons-blue/Delivery_Truck.png",
            items: [
              { title: "Selling Channels", icon: Store, url: "/selling-channels", isPro: true },
            ],
          },
          {
            label: "Fulfillment",
            icon: Truck,
            iconSrc: "/3d-ecom-icons-blue/Delivery_Truck.png",
            items: [
              { title: "Overview", icon: Truck, url: "/fulfillment", isPro: false },
              { title: "My Orders", icon: Package, url: "/fulfillment/orders", isPro: true },
              { title: "My Requests", icon: ClipboardCheck, url: "/fulfillment/requests", isPro: true },
            ],
          },
          {
            label: "LLC",
            icon: Building2,
            iconSrc: "/3d-ecom-icons-blue/Category_Grid.png",
            accent: "green",
            items: [
              { title: "Overview", icon: Building2, url: "/llc", isPro: false },
              { title: "Documents", icon: FileText, url: "/llc/documents", isPro: false },
              { title: "Banking", icon: Building2, url: "/llc/banking", isPro: false },
              { title: "Payments", icon: Receipt, url: "/llc/payments", isPro: false },
              { title: "Benefits", icon: Shield, url: "/llc/benefits", isPro: false },
            ],
          },
          {
            label: "AI Studio",
            icon: Palette,
            iconSrc: "/3d-ecom-icons-blue/Toolbox_Wrench.png",
            isNew: true,
            items: [
              { title: "Banner Generator", icon: Palette, url: "/ai-studio/banner-generator", isPro: true, isAiStudio: true },
              { title: "Brand Kit + Logo", icon: Palette, url: "/ai-studio/brand-kit", isPro: true, isAiStudio: true },
              { title: "Model Studio", icon: User, url: "/ai-studio/model-studio", isPro: true, isAiStudio: true },
              { title: "Whitelabelling", icon: Badge, url: "/ai-studio/whitelabelling", isPro: true, isAiStudio: true },
              { title: "Description Generator", icon: PenTool, url: "/tools/description-generator", isPro: true },
              { title: "Email Templates", icon: Mail, url: "/tools/email-templates", isPro: true },
              { title: "Policy Generator", icon: Shield, url: "/tools/policy-generator", isPro: true },
              { title: "Invoice Generator", icon: Receipt, url: "/tools/invoice-generator", isPro: true },
              { title: "Profit Calculator", icon: Calculator, url: "/tools/profit-calculator", isPro: true },
              { title: "Shipping Calculator", icon: Truck, url: "/tools/shipping-calculator", isPro: true },
              { title: "CRO Checklist", icon: ClipboardCheck, url: "/tools/cro-checklist", isPro: false },
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

        /* Moved out of the top bar into the user menu (was overflowing at 100%). */
        export const userMenuExtraItems: NavItem[] = [
          { title: "Videos", icon: Video, url: "/ads/videos", isPro: true },
          { title: "Meta Ads", icon: BarChart3, url: "/ads/meta-ads", isPro: true, iconSrc: "/images/meta-logo.svg" },
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