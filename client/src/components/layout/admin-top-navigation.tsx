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
import { cn } from "@/lib/utils"
import {
  LogOut,
  HelpCircle,
  Menu,
  X,
  LayoutDashboard,
  UserCog,
  Book,
  Users,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useUserMetadata } from "@/hooks/use-user-metadata"

interface AdminNavItem {
  title: string
  icon: React.ElementType
  url: string
}

interface AdminNavGroup {
  label: string
  items: AdminNavItem[]
}

const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, url: "/admin" },
    ],
  },
  {
    label: "Users",
    items: [
      { title: "Clients", icon: UserCog, url: "/admin/external-users" },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Courses", icon: Book, url: "/admin/courses" },
    ],
  },
  {
    label: "Team",
    items: [
      { title: "Team", icon: Users, url: "/admin/internal-users" },
    ],
  },
]

const allAdminItems = adminNavGroups.flatMap(g => g.items)

interface UserData {
  name: string
  email: string
  avatar_url?: string
}

export function AdminTopNavigation() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { signOut } = useAuth()
  const { internalRole, fullName, avatarUrl, loading: isMetadataLoading } = useUserMetadata()

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
            name: data.user?.full_name || data.name || fullName || "Admin",
            email: data.user?.email || data.email || "",
            avatar_url: data.user?.avatar_url || data.avatar_url || avatarUrl,
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
        name: fullName || "Admin",
        email: "",
        avatar_url: avatarUrl ?? undefined,
      })
    }
  }, [mounted, fullName, avatarUrl])

  const getInitials = (name: string) => {
    if (!name) return "A"
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

  const isActive = (url: string) => {
    if (url === "/admin") {
      return pathname === "/admin"
    }
    return pathname?.startsWith(url) ?? false
  }

  const resolvedAvatar = userData?.avatar_url || avatarUrl || "https://avatar.iran.liara.run/public"

  return (
    <>
      <header className="sticky top-0 z-50 w-full" style={{ background: '#F5F5F7' }}>
        <div className="px-4 md:px-6 lg:px-8 pt-2 pb-1">
          <div className="flex h-[56px] items-center px-4 lg:px-5 rounded-xl bg-white border border-black/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <button
              className="lg:hidden p-1.5 rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-admin-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/admin" className="flex items-baseline gap-1 mr-5 shrink-0" data-testid="link-admin-logo">
              <span className="text-xl font-semibold tracking-tight text-foreground">USDrop</span>
              <span className="text-xl font-bold text-blue-600">AI</span>
              <span className="text-xs font-medium text-muted-foreground ml-1">Admin</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-0 flex-1 min-w-0 overflow-x-auto" data-testid="admin-nav">
              {allAdminItems.map((item, index) => {
                const active = isActive(item.url)
                const prevItem = index > 0 ? allAdminItems[index - 1] : null
                const currentGroup = adminNavGroups.find(g => g.items.includes(item))
                const prevGroup = prevItem ? adminNavGroups.find(g => g.items.includes(prevItem)) : null
                const showSeparator = prevGroup && currentGroup && prevGroup !== currentGroup

                return (
                  <div key={item.url} className="flex items-center">
                    {showSeparator && (
                      <div className="h-4 w-px bg-gray-200 mx-1" />
                    )}
                    <Link
                      href={item.url}
                      data-testid={`link-admin-nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className={cn(
                        "relative px-2.5 py-2 text-[13px] font-medium transition-colors whitespace-nowrap",
                        active
                          ? "text-black"
                          : "text-[#999] hover:text-black"
                      )}
                    >
                      {item.title}
                      {active && (
                        <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-black rounded-full" />
                      )}
                    </Link>
                  </div>
                )
              })}
            </nav>

            <div className="flex items-center gap-2 ml-auto shrink-0">
              {mounted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer p-0" data-testid="button-admin-user-menu">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={resolvedAvatar} alt="Admin avatar" />
                        <AvatarFallback className="text-xs">{getInitials(userData?.name || "Admin")}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={resolvedAvatar} alt="Admin avatar" />
                        <AvatarFallback className="text-xs">{getInitials(userData?.name || "Admin")}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{userData?.name || fullName || "Admin"}</span>
                        {internalRole && (
                          <Badge
                            variant="outline"
                            className={cn("w-fit text-xs mt-0.5 border", getRoleBadgeClassName(internalRole))}
                          >
                            {getRoleLabel(internalRole)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/help" data-testid="link-admin-help">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={handleLogout}
                      data-testid="button-admin-logout"
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
        <div className="lg:hidden fixed inset-0 top-[72px] z-40 bg-white overflow-y-auto">
          <nav className="p-4 space-y-4">
            {adminNavGroups.map((group) => (
              <div key={group.label}>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3">
                  {group.label}
                </span>
                <div className="mt-1 space-y-0">
                  {group.items.map((item) => {
                    const active = isActive(item.url)
                    return (
                      <Link
                        key={item.url}
                        href={item.url}
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid={`link-admin-mobile-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          active
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-black"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
