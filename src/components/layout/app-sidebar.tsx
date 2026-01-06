"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
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
import { Logo } from "@/components/layout/logo"
import { SidebarOnboardingBadge } from "@/components/layout/sidebar-onboarding-badge"
import { SidebarCreditsFooter } from "@/components/layout/sidebar-credits-footer"
import { SidebarPicklistBadge } from "@/components/layout/sidebar-picklist-badge"
import { UnlockBadge } from "@/components/ui/unlock-badge"
import { useUserPlan } from "@/hooks/use-user-plan"
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
  Truck,
  LucideIcon,
  Map,
  Video,
  ExternalLink,
  Mail,
  FileText,
  Zap,
  Droplets,
  FileSearch,
  LayoutDashboard,
  Share2,
  Receipt,
  PenTool,
  Calendar,
  Code2,
  Settings2,
  CheckSquare,
} from "lucide-react"
import Link from "next/link"

// Type for sidebar items
interface SidebarItem {
  title: string
  icon: LucideIcon
  url: string
  isPro?: boolean
  isLimited?: boolean
}

// USDrop AI Research items - All Pro features except dashboard
const aiResearchItems: SidebarItem[] = [
  {
    title: "Product Hunt",
    icon: TrendingUp,
    url: "/product-hunt",
    isPro: true,
  },
  {
    title: "Winning Products",
    icon: Trophy,
    url: "/winning-products",
    isPro: true,
  },
  {
    title: "Competitor Stores",
    icon: Store,
    url: "/competitor-stores",
    isPro: true,
  },
  {
    title: "Categories",
    icon: Grid3x3,
    url: "/categories",
    isPro: true,
  },
  {
    title: "Seasonal Collections",
    icon: Calendar,
    url: "/seasonal-collections",
    isPro: true,
  },
  {
    title: "Meta Ads",
    icon: BarChart3,
    url: "/meta-ads",
    isPro: true,
  },
]

// USDrop AI Learn items - All Pro features
const aiLearnItems: SidebarItem[] = [
  {
    title: "Intelligence",
    icon: Newspaper,
    url: "/intelligence",
    isPro: true,
  },
  {
    title: "Webinars",
    icon: Video,
    url: "/webinars",
    isPro: true,
  },
]

// USDrop AI Fulfilment items - All Pro features
const aiFulfilmentItems: SidebarItem[] = [
  {
    title: "Private Supplier",
    icon: Package,
    url: "/suppliers",
    isPro: true,
  },
  {
    title: "Selling Channels",
    icon: ExternalLink,
    url: "/selling-channels",
    isPro: true,
  },
  {
    title: "Shipping Calculator",
    icon: Truck,
    url: "/ai-toolkit/shipping-calculator",
    isPro: true,
  },
]

// USDrop AI Studio items - All Pro features
const aiStudioItems: SidebarItem[] = [
  {
    title: "Whitelabelling",
    icon: Badge,
    url: "/ai-toolkit/logo-studio",
    isPro: true,
  },
  {
    title: "Model Studio",
    icon: User,
    url: "/ai-toolkit/model-studio",
    isPro: true,
  },
]

// USDrop AI Toolkit items - All Pro features
const aiToolkitItems: SidebarItem[] = [
  {
    title: "Description Generator",
    icon: PenTool,
    url: "/ai-toolkit/description-generator",
    isPro: true,
  },
  {
    title: "Email Templates",
    icon: Mail,
    url: "/ai-toolkit/email-templates",
    isPro: true,
  },
  {
    title: "Policy Generator",
    icon: Shield,
    url: "/ai-toolkit/policy-generator",
    isPro: true,
  },
  {
    title: "Invoice Generator",
    icon: Receipt,
    url: "/ai-toolkit/invoice-generator",
    isPro: true,
  },
  {
    title: "Profit Calculator",
    icon: Calculator,
    url: "/ai-toolkit/profit-calculator",
    isPro: true,
  },
]

// USDrop AI Workspace items - All Pro features except home and onboarding
const aiWorkspaceItems: SidebarItem[] = [
  {
    title: "Onboarding",
    icon: LayoutDashboard,
    url: "/onboarding",
    isPro: false, // Free access
  },
  {
    title: "Home",
    icon: Home,
    url: "/home",
    isPro: false, // Free access
  },
  {
    title: "My Mentor",
    icon: GraduationCap,
    url: "/academy",
    isPro: true,
  },
  {
    title: "My Roadmap",
    icon: Map,
    url: "/my-journey",
    isPro: true,
  },
  {
    title: "My Products",
    icon: Bookmark,
    url: "/my-products",
    isPro: true,
  },
  {
    title: "My Shopify Store",
    icon: ShoppingBag,
    url: "/my-shopify-stores",
    isPro: true,
  },
]

// Admin User Management items
const adminUserManagementItems = [
  {
    title: "Internal Users (Team)",
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

// Admin Email Automation items
const adminEmailAutomationItems = [
  {
    title: "Templates",
    icon: FileText,
    url: "/admin/email-automation/templates",
  },
  {
    title: "Automations",
    icon: Zap,
    url: "/admin/email-automation/automations",
  },
  {
    title: "Drip Campaigns",
    icon: Droplets,
    url: "/admin/email-automation/drips",
  },
  {
    title: "Email Logs",
    icon: FileSearch,
    url: "/admin/email-automation/logs",
  },
]

// Dev Portal items
const devPortalItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dev",
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    url: "/dev/tasks",
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin") ?? false
  const isDevRoute = pathname?.startsWith("/dev") ?? false
  const sidebarContentRef = useRef<HTMLDivElement>(null)
  const { isFree, isLoading: isPlanLoading } = useUserPlan()

  // Helper to check if item is locked for current user
  const isItemLocked = (item: SidebarItem) => {
    // Items with isPro: false are always accessible, regardless of plan
    if (!item.isPro) return false
    return isFree && item.isPro
  }

  // Handle click on locked item
  const handleLockedItemClick = (_e: React.MouseEvent, _item: SidebarItem) => {
    // Allow navigation; locked pages will show their own overlay
  }

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
        {/* Main customer workspace navigation (non-admin, non-dev) */}
        {!isAdminRoute && !isDevRoute && (
          <>
            {/* MY DS FRAMEWORK Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">MY DS FRAMEWORK</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiWorkspaceItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={isItemLocked(item) ? `${item.title} (Pro)` : item.title} 
                        isActive={isActive(item.url)}
                        className={isItemLocked(item) ? "opacity-60" : ""}
                      >
                        <Link 
                          href={item.url} 
                          className="flex items-center gap-2"
                          onClick={(e) => handleLockedItemClick(e, item)}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {item.title === "My Products" && !isItemLocked(item) && <SidebarPicklistBadge />}
                          {isItemLocked(item) && <UnlockBadge variant="text-only" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* RESEARCH Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">RESEARCH</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiResearchItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={isItemLocked(item) ? `${item.title} (Pro)` : item.title} 
                        isActive={isActive(item.url)}
                        className={isItemLocked(item) ? "opacity-60" : ""}
                      >
                        <Link 
                          href={item.url} 
                          className="flex items-center gap-2"
                          onClick={(e) => handleLockedItemClick(e, item)}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {!isItemLocked(item) && <SidebarOnboardingBadge />}
                          {isItemLocked(item) && <UnlockBadge variant="text-only" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* LEARN Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">LEARN</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiLearnItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={isItemLocked(item) ? `${item.title} (Pro)` : item.title} 
                        isActive={isActive(item.url)}
                        className={isItemLocked(item) ? "opacity-60" : ""}
                      >
                        <Link 
                          href={item.url}
                          className="flex items-center gap-2"
                          onClick={(e) => handleLockedItemClick(e, item)}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {isItemLocked(item) && <UnlockBadge variant="text-only" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* FULFILMENT Section */}
            {aiFulfilmentItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel className="uppercase tracking-wider font-mono">FULFILMENT</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {aiFulfilmentItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          tooltip={isItemLocked(item) ? `${item.title} (Pro)` : item.title} 
                          isActive={isActive(item.url)}
                          className={isItemLocked(item) ? "opacity-60" : ""}
                        >
                        <Link 
                          href={item.url} 
                            className="flex items-center gap-2"
                            onClick={(e) => handleLockedItemClick(e, item)}
                          >
                            <item.icon className="h-4 w-4" />
                            <span className="flex-1">{item.title}</span>
                            {!isItemLocked(item) && <SidebarOnboardingBadge />}
                          {isItemLocked(item) && <UnlockBadge variant="text-only" />}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* STUDIO Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">STUDIO</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiStudioItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={isItemLocked(item) ? `${item.title} (Pro)` : item.title} 
                        isActive={isActive(item.url)}
                        className={isItemLocked(item) ? "opacity-60" : ""}
                      >
                        <Link 
                          href={item.url} 
                          className="flex items-center gap-2"
                          onClick={(e) => handleLockedItemClick(e, item)}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {!isItemLocked(item) && <SidebarOnboardingBadge />}
                          {isItemLocked(item) && <UnlockBadge variant="text-only" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* TOOLKIT Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">TOOLKIT</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiToolkitItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={isItemLocked(item) ? `${item.title} (Pro)` : item.title} 
                        isActive={isActive(item.url)}
                        className={isItemLocked(item) ? "opacity-60" : ""}
                      >
                        <Link 
                          href={item.url} 
                          className="flex items-center gap-2"
                          onClick={(e) => handleLockedItemClick(e, item)}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.title}</span>
                          {!isItemLocked(item) && <SidebarOnboardingBadge />}
                          {isItemLocked(item) && <UnlockBadge variant="text-only" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Dev & Superadmin-style navigation - only on /dev */}
        {isDevRoute && (
          <>
            {/* Developer Portal Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">DEVELOPER PORTAL</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {devPortalItems.map((item) => (
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

            {/* Platform Admin Sections – mirror superadmin nav for dev context */}
            {/* User Management Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">USER MANAGEMENT</SidebarGroupLabel>
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
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">ORDERS & TRANSACTIONS</SidebarGroupLabel>
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
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">CONTENT MANAGEMENT</SidebarGroupLabel>
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
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">RESEARCH & STORES</SidebarGroupLabel>
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

            {/* Email Automation Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">EMAIL AUTOMATION</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminEmailAutomationItems.map((item) => (
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

        {/* Admin Sections - Only show when on admin routes */}
        {isAdminRoute && (
          <>
            {/* User Management Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">USER MANAGEMENT</SidebarGroupLabel>
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
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">ORDERS & TRANSACTIONS</SidebarGroupLabel>
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
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">CONTENT MANAGEMENT</SidebarGroupLabel>
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
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">RESEARCH & STORES</SidebarGroupLabel>
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

            {/* Email Automation Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="uppercase tracking-wider font-mono">EMAIL AUTOMATION</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminEmailAutomationItems.map((item) => (
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

