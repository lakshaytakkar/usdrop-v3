"use client"

import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import {
  TrendingUp,
  Trophy,
  Store,
  Grid3x3,
  Package,
  BarChart3,
  Search,
  Home,
  Bookmark,
  ShoppingBag,
  GraduationCap,
  Sparkles,
  Newspaper,
  Shield,
  Users,
  UserCog,
  CreditCard,
  ShoppingCart,
  Luggage,
  Folder,
  Building,
  Book,
} from "lucide-react"
import Link from "next/link"

// Products & Discovery items
const productsDiscoveryItems = [
  {
    title: "Product Hunt",
    icon: TrendingUp,
    url: "/product-hunt",
  },
  {
    title: "Winning Products",
    icon: Trophy,
    url: "/winning-products",
  },
  {
    title: "Competitor Stores",
    icon: Store,
    url: "/competitor-stores",
  },
  {
    title: "Categories",
    icon: Grid3x3,
    url: "/categories",
  },
  {
    title: "Suppliers",
    icon: Package,
    url: "/suppliers",
  },
]

// Research & Analytics items
const researchAnalyticsItems = [
  {
    title: "Meta Ads",
    icon: BarChart3,
    url: "/meta-ads",
  },
  {
    title: "Store Research",
    icon: Search,
    url: "/store-research",
  },
]

// My Workspace items
const myWorkspaceItems = [
  {
    title: "Home",
    icon: Home,
    url: "/",
  },
  {
    title: "Picklist",
    icon: Bookmark,
    url: "/picklist",
  },
  {
    title: "Shopify Stores",
    icon: ShoppingBag,
    url: "/shopify-stores",
  },
]

// Learning & AI items
const learningAIItems = [
  {
    title: "Academy",
    icon: GraduationCap,
    url: "/academy",
  },
  {
    title: "AI Studio",
    icon: Sparkles,
    url: "/ai-studio",
  },
  {
    title: "Intelligence",
    icon: Newspaper,
    url: "/intelligence",
  },
]

// Admin User Management items
const adminUserManagementItems = [
  {
    title: "Internal Users",
    icon: Users,
    url: "/admin/internal-users",
  },
  {
    title: "External Users",
    icon: UserCog,
    url: "/admin/external-users",
  },
  {
    title: "Permissions",
    icon: Shield,
    url: "/admin/permissions",
  },
  {
    title: "Plans",
    icon: CreditCard,
    url: "/admin/plans",
  },
]

// Admin Orders & Transactions items
const adminOrdersItems = [
  {
    title: "Orders",
    icon: ShoppingCart,
    url: "/admin/orders",
  },
]

// Admin Content Management items
const adminContentItems = [
  {
    title: "Products",
    icon: Luggage,
    url: "/admin/products",
  },
  {
    title: "Categories",
    icon: Folder,
    url: "/admin/categories",
  },
  {
    title: "Suppliers",
    icon: Building,
    url: "/admin/suppliers",
  },
]

// Admin Research & Stores items
const adminResearchItems = [
  {
    title: "Competitor Stores",
    icon: Store,
    url: "/admin/competitor-stores",
  },
  {
    title: "Store Research",
    icon: Search,
    url: "/admin/store-research",
  },
  {
    title: "Shopify Stores",
    icon: ShoppingBag,
    url: "/admin/shopify-stores",
  },
]

// Admin Learning items
const adminLearningItems = [
  {
    title: "Courses",
    icon: Book,
    url: "/admin/courses",
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin") ?? false

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center p-2">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {!isAdminRoute && (
          <>
            {/* My Workspace Section */}
            <SidebarGroup>
              <SidebarGroupLabel>My Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {myWorkspaceItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Products & Discovery Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Products & Discovery</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {productsDiscoveryItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Research & Analytics Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Research & Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {researchAnalyticsItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Learning & AI Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Learning & AI</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {learningAIItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Admin Sections - Only show when on admin routes */}
        {isAdminRoute && (
          <>
            {/* User Management Section */}
            <SidebarGroup>
              <SidebarGroupLabel>User Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminUserManagementItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Orders & Transactions Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Orders & Transactions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminOrdersItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Content Management Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Content Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminContentItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Research & Stores Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Research & Stores</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminResearchItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Learning Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Learning</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminLearningItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Admin Link - Show when NOT on admin routes */}
        {!isAdminRoute && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Admin Panel">
                    <Link href="/admin">
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-between gap-2 rounded-md bg-primary/10 px-3 py-2">
            <span className="text-sm font-medium text-primary">0 credits</span>
            <Button size="sm" variant="default" className="h-7 text-xs">
              Upgrade
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

