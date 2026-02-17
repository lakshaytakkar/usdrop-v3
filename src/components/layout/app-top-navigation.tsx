"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
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
  ChevronDown,
  Menu,
  X,
} from "lucide-react"
import { WhatsAppContactButton } from "@/components/shared/whatsapp-contact-button"
import { useAuth } from "@/contexts/auth-context"
import { useUserMetadata } from "@/hooks/use-user-metadata"
import { externalNavGroups, findActiveGroup } from "@/data/navigation"
import { useUserPlan } from "@/hooks/use-user-plan"

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
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
        const response = await fetch("/api/auth/user")
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="flex h-14 items-center px-4 gap-1">
          <button
            className="md:hidden p-1.5 rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer mr-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/home" className="flex items-baseline gap-1 mr-6 shrink-0">
            <span className="text-xl font-bold tracking-tight text-foreground">USDrop</span>
            <span className="text-xl font-bold text-blue-600">AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 flex-1 min-w-0">
            {externalNavGroups.map((group) => {
              const isActive = isGroupActive(group.label)
              if (group.items.length === 1) {
                const item = group.items[0]
                return (
                  <Link
                    key={group.label}
                    href={item.url}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    {group.label}
                  </Link>
                )
              }

              return (
                <DropdownMenu
                  key={group.label}
                  open={openDropdown === group.label}
                  onOpenChange={(open) => setOpenDropdown(open ? group.label : null)}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer",
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      {group.label}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    {group.items.map((item) => {
                      const isItemActive = pathname === item.url || pathname?.startsWith(item.url + "/")
                      return (
                        <DropdownMenuItem key={item.url} asChild className="cursor-pointer">
                          <Link
                            href={item.url}
                            className={cn(
                              "flex items-center gap-2 w-full",
                              isItemActive && "text-blue-600 font-medium"
                            )}
                            onClick={() => setOpenDropdown(null)}
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            <GradientButton
              variant="golden"
              className="hidden lg:inline-flex h-8 px-3 text-xs font-mono items-center gap-1.5 group"
              onClick={() => setIsHotProductsOpen(true)}
            >
              <Flame className="h-3.5 w-3.5 flex-shrink-0 text-white group-hover:text-yellow-300 transition-colors" />
              <span className="uppercase">HOT PRODUCTS</span>
            </GradientButton>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 flex items-center gap-1.5 cursor-pointer"
              asChild
            >
              <Link href="/help">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden lg:inline text-sm">Help</span>
              </Link>
            </Button>

            {mounted && !isInternal && (
              <WhatsAppContactButton
                pocName="Parth"
                phoneNumber="+91 9350502364"
              />
            )}

            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={userData?.avatar_url || "https://avatar.iran.liara.run/public"}
                        alt="User avatar"
                      />
                      <AvatarFallback>{getInitials(userData?.name || "User")}</AvatarFallback>
                    </Avatar>
                    {!isInternal && isPro && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                        <Crown className="h-2.5 w-2.5 text-white" />
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={userData?.avatar_url || "https://avatar.iran.liara.run/public"}
                        alt="User avatar"
                      />
                      <AvatarFallback>{getInitials(userData?.name || "User")}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
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
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-white overflow-y-auto">
          <nav className="p-4 space-y-4">
            {externalNavGroups.map((group) => (
              <div key={group.label}>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{group.label}</span>
                <div className="mt-1.5 space-y-0.5">
                  {group.items.map((item) => {
                    const isItemActive = pathname === item.url || pathname?.startsWith(item.url + "/")
                    return (
                      <Link
                        key={item.url}
                        href={item.url}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                          isItemActive
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
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
