

import { apiFetch } from '@/lib/supabase'
import { usePathname } from "@/hooks/use-router"
import { useState, useEffect } from "react"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { HotProductsModal } from "@/components/feedback/modals/hot-products-modal"
import GradientButton from "@/components/kokonutui/gradient-button"
import { cn } from "@/lib/utils"
import {
  LogOut,
  HelpCircle,
  Flame,
  Crown,
  Menu,
  X,
  ChevronDown,
  Store,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useUserMetadata } from "@/hooks/use-user-metadata"
import { externalNavGroups, findActiveGroup } from "@/data/navigation"

interface UserData {
  name: string
  email: string
  avatar_url?: string
}

export function AppTopNavigation() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isHotProductsOpen, setIsHotProductsOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { signOut, user } = useAuth()
  const { isInternal, internalRole, isPro, isFree, fullName, avatarUrl, loading: isMetadataLoading } = useUserMetadata()

  const activeGroup = findActiveGroup(pathname || "")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiFetch("/api/auth/user")
        if (response.ok) {
          const data = await response.json()
          setUserData({
            name: data.name || fullName || "User",
            email: data.email || "",
            avatar_url: data.avatar_url || avatarUrl,
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    if (mounted && !fullName) {
      fetchUserData()
    } else if (fullName) {
      setUserData({
        name: fullName || "User",
        email: "",
        avatar_url: avatarUrl ?? undefined,
      })
    }
  }, [mounted, fullName, avatarUrl])

  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const getRoleBadgeClassName = (role: string | null | undefined) => {
    switch (role) {
      case "superadmin":
        return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "admin":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "manager":
        return "bg-teal-100 text-teal-700 border-teal-200"
      case "executive":
        return "bg-slate-100 text-slate-700 border-slate-200"
      default:
        return ""
    }
  }

  const getRoleLabel = (role: string | null | undefined) => {
    if (!role) return ""
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const isGroupActive = (groupLabel: string) => {
    return activeGroup?.label === groupLabel
  }

  const primaryGroups = externalNavGroups.filter(g => !g.isDropdown)
  const resolvedAvatar = userData?.avatar_url || avatarUrl || (isPro ? "/images/default-pro-avatar.png" : "https://avatar.iran.liara.run/public")

  return (
    <>
      <header className="sticky top-0 z-50 w-full" style={{ background: '#F5F5F7' }}>
        <div className="px-12 md:px-20 lg:px-32 pt-2 pb-1">
          <div
            className="flex h-[64px] items-center px-5 lg:px-6 rounded-xl bg-white border border-black/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <button
              className="md:hidden p-1.5 rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/home" className="flex items-baseline gap-1 mr-4 shrink-0" data-testid="link-home-logo">
              <span className="text-2xl font-semibold tracking-tight text-foreground">USDrop</span>
              <span className="text-2xl font-bold text-blue-600">AI</span>
            </Link>

            <nav className="hidden md:flex items-center gap-0 flex-1 min-w-0">
              {primaryGroups.map((group) => {
                const isActive = isGroupActive(group.label)
                const firstItem = group.items[0]
                return (
                  <Link
                    key={group.label}
                    href={firstItem.url}
                    data-testid={`link-nav-${group.label.toLowerCase()}`}
                    className={cn(
                      "relative px-3 py-2 text-[15px] font-medium transition-colors whitespace-nowrap inline-flex items-center gap-1.5",
                      isActive
                        ? "text-black"
                        : "text-[#999] hover:text-black"
                    )}
                  >
                    {group.label}
                    {group.comingSoon && (
                      <span className="px-1.5 py-[2px] rounded text-[8px] font-bold uppercase leading-none tracking-wide bg-blue-100 text-blue-600 border border-blue-200">
                        Soon
                      </span>
                    )}
                    {group.isNew && !group.comingSoon && (
                      <span className="px-2 py-[3px] rounded text-[9px] font-bold uppercase leading-none tracking-wide bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        New
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-black rounded-full" />
                    )}
                  </Link>
                )
              })}

            </nav>

            <div className="flex items-center gap-2 ml-auto shrink-0">
              <GradientButton
                variant="golden"
                className="hidden lg:inline-flex h-9 px-4 text-sm font-mono items-center gap-1.5 group"
                onClick={() => setIsHotProductsOpen(true)}
              >
                <Flame className="h-4 w-4 flex-shrink-0 text-white group-hover:text-yellow-300 transition-colors" />
                <span className="uppercase">HOT PRODUCTS</span>
              </GradientButton>

              <Link
                href="/framework/my-store"
                data-testid="button-shopify-pill"
                className="hidden md:inline-flex items-center gap-1.5 h-8 pl-2.5 pr-3 rounded-full bg-[#1a1a2e] hover:bg-[#2a2a3e] text-white text-[13px] font-semibold transition-all shrink-0"
              >
                <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 109.5 124.5" fill="none">
                  <path d="M95.6 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.8-.8-2.3-.5-2.9-.4-.1 0-1.5.5-4 1.2-2.4-6.8-6.5-13.1-13.9-13.1h-.6C53.1 3.7 50.6 2 48.5 2c-16.7 0-24.7 20.9-27.2 31.5-6.5 2-11.1 3.4-11.7 3.6C6.1 38.1 6 38.2 5.8 41.7c-.2 2.6-8.1 62.4-8.1 62.4L73.3 118l36.2-7.8S95.7 28.8 95.6 28.2zM67.3 21.3l-5.4 1.7c0-1.7 0-4.2-.5-6.7 3.7.7 5.2 4 5.9 5zM57.6 24.1L44.2 28.3c1.3-5.1 3.8-10.1 8.6-13.4 1.9 1.4 3.7 4.4 4.8 9.2zm-8-16.2c.6 0 1.1.2 1.6.5-4 1.9-8.3 6.7-10.1 16.3L30.2 28c2.6-9.5 8.2-20.1 19.4-20.1z" fill="#95BF47"/>
                  <path d="M94.5 27.2c-.5 0-10.2-.8-10.2-.8s-6.7-6.7-7.5-7.5c-.3-.3-.7-.4-1-.5l-2.5 51.7 36.2-7.8S95.7 28.8 95.6 28.2c-.1-.6-.6-1-1.1-1z" fill="#5E8E3E"/>
                  <path d="M55.3 42.3l-4.8 14.3s-4.3-2.3-9.5-2.3c-7.7 0-8.1 4.8-8.1 6 0 6.6 17.2 9.1 17.2 24.5 0 12.1-7.7 19.9-18.1 19.9-12.5 0-18.9-7.8-18.9-7.8l3.3-11s6.6 5.6 12.1 5.6c3.6 0 5.1-2.8 5.1-4.9 0-8.6-14.1-9-14.1-23.1 0-11.9 8.5-23.4 25.8-23.4 6.6.1 9.8 1.9 9.8 1.9l.2.3z" fill="#fff"/>
                </svg>
                <span>Shopify</span>
              </Link>

              {mounted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer p-0" data-testid="button-user-menu">
                      <div className={cn("rounded-full", !isInternal && isPro && "ring-2 ring-amber-400")}>
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={resolvedAvatar}
                            alt="User avatar"
                          />
                          <AvatarFallback>{getInitials(userData?.name || "User")}</AvatarFallback>
                        </Avatar>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={resolvedAvatar}
                          alt="User avatar"
                        />
                        <AvatarFallback>{getInitials(userData?.name || "User")}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="ds-card-title">
                          {userData?.name || fullName || "User"}
                        </span>
                        {isInternal && internalRole ? (
                          <Badge
                            variant="outline"
                            className={cn("w-fit text-xs mt-0.5 border", getRoleBadgeClassName(internalRole))}
                          >
                            {getRoleLabel(internalRole)}
                          </Badge>
                        ) : isPro ? (
                          <Badge
                            className="w-fit text-xs mt-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1"
                          >
                            <Crown className="h-3 w-3" />
                            Pro
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="w-fit text-xs mt-0.5">
                            Free
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/claim-store" data-testid="link-claim-store" className="flex items-center">
                        <Store className="mr-2 h-4 w-4" />
                        Claim Your Store
                        <span className="ml-auto px-1.5 py-[1px] rounded text-[8px] font-bold uppercase leading-none tracking-wide bg-blue-100 text-blue-600 border border-blue-200">
                          Soon
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/help" data-testid="link-help">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={handleLogout}
                      data-testid="button-logout"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[68px] z-40 bg-white overflow-y-auto">
          <nav className="p-4 space-y-3">
            {externalNavGroups.map((group) => {
              return (
              <div key={group.label}>
                <span className="ds-overline text-gray-300">
                  {group.label}
                </span>
                <div className="mt-1 space-y-0">
                  {group.items.filter(item => !(isFree && item.hideForFree)).map((item) => {
                    const isItemActive = pathname === item.url || pathname?.startsWith(item.url + "/")
                    return (
                      <Link
                        key={item.url}
                        href={item.url}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-md ds-label transition-colors",
                          isItemActive
                            ? "bg-blue-50 ds-text-primary font-semibold"
                            : "ds-text-body hover:bg-gray-50"
                        )}
                      >
                        {item.title}
                        {group.comingSoon && (
                          <span className="px-1.5 py-[1px] rounded text-[8px] font-bold uppercase leading-none tracking-wide bg-blue-100 text-blue-600 border border-blue-200">
                            Soon
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
              )
            })}
          </nav>
        </div>
      )}

      <HotProductsModal
        open={isHotProductsOpen}
        onOpenChange={setIsHotProductsOpen}
      />
    </>
  )
}
