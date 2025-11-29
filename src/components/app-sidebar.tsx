"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
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
import { Logo } from "@/components/logo"
import { ProBadge, LimitedBadge } from "@/components/ui/pro-badge"
import { SidebarCreditsFooter } from "@/components/sidebar-credits-footer"
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
  Image,
  Badge,
  Calculator,
  Presentation,
  User,
  Target,
  LucideIcon,
} from "lucide-react"
import Link from "next/link"

// USDrop AI Research items
const aiResearchItems = [
  {
    title: "Product Hunt",
    icon: TrendingUp,
    url: "/product-hunt",
    isLimited: true,
  },
  {
    title: "Winning Products",
    icon: Trophy,
    url: "/winning-products",
    isLimited: true,
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
    title: "Meta Ads",
    icon: BarChart3,
    url: "/meta-ads",
  },
]

// USDrop AI Learn items
const aiLearnItems = [
  {
    title: "Academy",
    icon: GraduationCap,
    url: "/academy",
  },
  {
    title: "Intelligence",
    icon: Newspaper,
    url: "/intelligence",
  },
]

// USDrop AI Fulfilment items
const aiFulfilmentItems: Array<{ title: string; icon: LucideIcon; url: string; isPro?: boolean; isLimited?: boolean }> = [
  {
    title: "Private Supplier",
    icon: Package,
    url: "/suppliers",
  },
]

// USDrop AI Studio items
const aiStudioItems = [
  {
    title: "AI Studio",
    icon: Sparkles,
    url: "/ai-studio",
  },
  {
    title: "Image Studio",
    icon: Image,
    url: "/ai-toolkit/image-studio",
    isPro: true,
  },
  {
    title: "Logo Studio",
    icon: Badge,
    url: "/ai-toolkit/logo-studio",
    isPro: true,
  },
  {
    title: "Campaign Studio",
    icon: Presentation,
    url: "/ai-toolkit/campaign-studio",
    isPro: true,
  },
  {
    title: "Ad Studio",
    icon: Sparkles,
    url: "/ai-toolkit/ad-studio",
    isPro: true,
  },
  {
    title: "Model Studio",
    icon: User,
    url: "/ai-toolkit/model-studio",
    isPro: true,
  },
  {
    title: "Brand Studio",
    icon: Badge,
    url: "/ai-toolkit/brand-studio",
    isPro: true,
  },
  {
    title: "Audience Studio",
    icon: Target,
    url: "/ai-toolkit/audience-studio",
    isPro: true,
  },
  {
    title: "Profit Calculator",
    icon: Calculator,
    url: "/ai-toolkit/profit-calculator",
    isPro: true,
  },
]

// USDrop AI Workspace items
const aiWorkspaceItems = [
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
  {
    title: "Competitor Stores",
    icon: Store,
    url: "/admin/competitor-stores",
  },
  {
    title: "Courses",
    icon: Book,
    url: "/admin/courses",
  },
  {
    title: "Intelligence",
    icon: Newspaper,
    url: "/admin/intelligence",
  },
]

// Admin Research & Stores items
const adminResearchItems = [
  {
    title: "Shopify Stores",
    icon: ShoppingBag,
    url: "/admin/shopify-stores",
  },
]


export function AppSidebar() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin") ?? false
  const sidebarContentRef = useRef<HTMLDivElement>(null)

  // Preserve sidebar scroll position
  useEffect(() => {
    const sidebarContent = sidebarContentRef.current
    if (!sidebarContent) return

    // Save scroll position continuously
    const handleScroll = () => {
      sessionStorage.setItem('sidebarScrollPosition', sidebarContent.scrollTop.toString())
    }

    // Restore scroll position after navigation
    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem('sidebarScrollPosition')
      if (savedPosition !== null) {
        // Use multiple attempts to ensure scroll position is restored
        const attemptRestore = () => {
          if (sidebarContent.scrollTop === 0 && parseInt(savedPosition, 10) > 0) {
            sidebarContent.scrollTop = parseInt(savedPosition, 10)
            // Try again if still at top
            if (sidebarContent.scrollTop === 0) {
              setTimeout(() => {
                sidebarContent.scrollTop = parseInt(savedPosition, 10)
              }, 50)
            }
          } else {
            sidebarContent.scrollTop = parseInt(savedPosition, 10)
          }
        }

        // Try immediately
        attemptRestore()
        
        // Also try after a short delay to handle async rendering
        setTimeout(attemptRestore, 0)
        requestAnimationFrame(attemptRestore)
      }
    }

    // Restore on mount and pathname change
    restoreScrollPosition()

    // Save on scroll
    sidebarContent.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      sidebarContent.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  // Helper function to check if a URL is active
  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/"
    }
    return pathname?.startsWith(url) ?? false
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center p-2">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent ref={sidebarContentRef}>
        {!isAdminRoute && (
          <>
            {/* USDrop AI Workspace Section */}
            <SidebarGroup>
              <SidebarGroupLabel>USDrop AI Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiWorkspaceItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
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

            {/* USDrop AI Research Section */}
            <SidebarGroup>
              <SidebarGroupLabel>USDrop AI Research</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiResearchItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
                        <Link href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {item.isLimited && <LimitedBadge size="sm" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* USDrop AI Learn Section */}
            <SidebarGroup>
              <SidebarGroupLabel>USDrop AI Learn</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiLearnItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
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

            {/* USDrop AI Fulfilment Section */}
            {aiFulfilmentItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>USDrop AI Fulfilment</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {aiFulfilmentItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
                          <Link href={item.url} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span className="flex-1">{item.title}</span>
                            {item.isPro && <ProBadge size="sm" />}
                            {item.isLimited && <LimitedBadge size="sm" />}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* USDrop AI Studio Section */}
            <SidebarGroup>
              <SidebarGroupLabel>USDrop AI Studio</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiStudioItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
                        <Link href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {item.isPro && <ProBadge size="sm" />}
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
                      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
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
                      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
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
                      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
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
                      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
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

      </SidebarContent>
      <SidebarFooter>
        <SidebarCreditsFooter />
      </SidebarFooter>
    </Sidebar>
  )
}

