

import { usePathname } from "@/hooks/use-router"
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
  LayoutDashboard,
  Receipt,
  PenTool,
  Calendar,
  CheckSquare,
} from "lucide-react"
import { Link } from "wouter"

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
    url: "/blogs",
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
    url: "/shipping-calculator",
    isPro: true,
  },
]

// USDrop AI Studio items - All Pro features
const aiStudioItems: SidebarItem[] = [
  {
    title: "Whitelabelling",
    icon: Badge,
    url: "/studio/whitelabelling",
    isPro: true,
  },
  {
    title: "Model Studio",
    icon: User,
    url: "/studio/model-studio",
    isPro: true,
  },
]

// USDrop AI Toolkit items - All Pro features
const aiToolkitItems: SidebarItem[] = [
  {
    title: "Description Generator",
    icon: PenTool,
    url: "/tools/description-generator",
    isPro: true,
  },
  {
    title: "Email Templates",
    icon: Mail,
    url: "/tools/email-templates",
    isPro: true,
  },
  {
    title: "Policy Generator",
    icon: Shield,
    url: "/tools/policy-generator",
    isPro: true,
  },
  {
    title: "Invoice Generator",
    icon: Receipt,
    url: "/tools/invoice-generator",
    isPro: true,
  },
  {
    title: "Profit Calculator",
    icon: Calculator,
    url: "/tools/profit-calculator",
    isPro: true,
  },
]

// USDrop AI Workspace items - All Pro features except home and onboarding
const aiWorkspaceItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/home",
    isPro: false,
  },
  {
    title: "My Mentor",
    icon: GraduationCap,
    url: "/mentorship",
    isPro: false,
  },
  {
    title: "My Roadmap",
    icon: Map,
    url: "/my-roadmap",
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
    url: "/my-store",
    isPro: true,
  },
]

// Admin items
const adminOverviewItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin",
  },
]

const adminSalesItems = [
  {
    title: "Leads",
    icon: Receipt,
    url: "/admin/leads",
  },
  {
    title: "Clients",
    icon: UserCog,
    url: "/admin/external-users",
  },
  {
    title: "Plans",
    icon: CreditCard,
    url: "/admin/plans",
  },
]

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
    title: "Courses",
    icon: Book,
    url: "/admin/courses",
  },
  {
    title: "Competitors",
    icon: Store,
    url: "/admin/competitor-stores",
  },
  {
    title: "Suppliers",
    icon: Building,
    url: "/admin/suppliers",
  },
  {
    title: "Shopify Stores",
    icon: ShoppingBag,
    url: "/admin/shopify-stores",
  },
]

const adminTeamItems = [
  {
    title: "Team",
    icon: Users,
    url: "/admin/internal-users",
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

  const isItemLocked = (item: SidebarItem) => {
    if (!item.isPro) return false
    if (isPlanLoading) return false
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

            {/* Platform Admin Sections – mirror admin nav for dev context */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.08em]">SALES & CLIENTS</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminSalesItems.map((item) => {
                    const active = isActive(item.url)
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={active}
                          className={active ? "bg-primary text-white data-[active=true]:bg-primary data-[active=true]:text-white" : "hover-elevate"}
                        >
                          <Link href={item.url}>
                            <item.icon className="h-[18px] w-[18px]" />
                            <span className="text-[14px] font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.08em]">CONTENT LIBRARY</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminContentItems.map((item) => {
                    const active = isActive(item.url)
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={active}
                          className={active ? "bg-primary text-white data-[active=true]:bg-primary data-[active=true]:text-white" : "hover-elevate"}
                        >
                          <Link href={item.url}>
                            <item.icon className="h-[18px] w-[18px]" />
                            <span className="text-[14px] font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.08em]">TEAM</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminTeamItems.map((item) => {
                    const active = isActive(item.url)
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={active}
                          className={active ? "bg-primary text-white data-[active=true]:bg-primary data-[active=true]:text-white" : "hover-elevate"}
                        >
                          <Link href={item.url}>
                            <item.icon className="h-[18px] w-[18px]" />
                            <span className="text-[14px] font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Admin Sections - Only show when on admin routes */}
        {isAdminRoute && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.08em]">OVERVIEW</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminOverviewItems.map((item) => {
                    const active = pathname === item.url
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={active}
                          className={active ? "bg-primary text-white data-[active=true]:bg-primary data-[active=true]:text-white" : "hover-elevate"}
                        >
                          <Link href={item.url}>
                            <item.icon className="h-[18px] w-[18px]" />
                            <span className="text-[14px] font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.08em]">SALES & CLIENTS</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminSalesItems.map((item) => {
                    const active = isActive(item.url)
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={active}
                          className={active ? "bg-primary text-white data-[active=true]:bg-primary data-[active=true]:text-white" : "hover-elevate"}
                        >
                          <Link href={item.url}>
                            <item.icon className="h-[18px] w-[18px]" />
                            <span className="text-[14px] font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.08em]">CONTENT LIBRARY</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminContentItems.map((item) => {
                    const active = isActive(item.url)
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={active}
                          className={active ? "bg-primary text-white data-[active=true]:bg-primary data-[active=true]:text-white" : "hover-elevate"}
                        >
                          <Link href={item.url}>
                            <item.icon className="h-[18px] w-[18px]" />
                            <span className="text-[14px] font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.08em]">TEAM</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminTeamItems.map((item) => {
                    const active = isActive(item.url)
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={active}
                          className={active ? "bg-primary text-white data-[active=true]:bg-primary data-[active=true]:text-white" : "hover-elevate"}
                        >
                          <Link href={item.url}>
                            <item.icon className="h-[18px] w-[18px]" />
                            <span className="text-[14px] font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
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

