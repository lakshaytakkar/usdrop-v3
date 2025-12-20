"use client"

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
import { HotProductsModal } from "@/components/hot-products-modal"
import GradientButton from "@/components/kokonutui/gradient-button"
import { cn } from "@/lib/utils"
import { 
  GraduationCap, 
  LogOut,
  HelpCircle,
  Flame,
  Crown,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useUserPlan } from "@/hooks/use-user-plan"

interface UserData {
  name: string
  email: string
  avatar_url?: string
}

export function Topbar() {
  const [mounted, setMounted] = useState(false)
  const [isHotProductsOpen, setIsHotProductsOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const { signOut, user } = useAuth()
  const { plan, isPro, isFree, isLoading: isPlanLoading } = useUserPlan()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/user")
        if (response.ok) {
          const data = await response.json()
          setUserData({
            name: data.name || "User",
            email: data.email || "",
            avatar_url: data.avatar_url,
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    if (mounted) {
      fetchUserData()
    }
  }, [mounted])

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-end px-2">
        {/* Action Buttons and Profile Menu */}
        <div className="flex items-center gap-2">
          {/* Hot Products This Week Button */}
          <GradientButton
            variant="golden"
            className="hidden sm:inline-flex h-9 px-3 text-sm font-mono items-center gap-2 group"
            onClick={() => setIsHotProductsOpen(true)}
          >
            <Flame className="h-4 w-4 flex-shrink-0 text-white group-hover:text-yellow-300 transition-colors" />
            <span className="hidden lg:inline uppercase">HOT PRODUCTS THIS WEEK</span>
            <span className="sm:inline lg:hidden uppercase">HOT PRODUCTS</span>
          </GradientButton>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 cursor-pointer"
            asChild
          >
            <Link href="/help">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden lg:inline">Help</span>
              <span className="sr-only">Help</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 cursor-pointer"
            asChild
          >
            <Link href="/academy">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden lg:inline">Academy</span>
              <span className="sr-only">Academy</span>
            </Link>
          </Button>

          {/* User Profile Dropdown */}
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer" suppressHydrationWarning>
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={userData?.avatar_url || "https://avatar.iran.liara.run/public"} 
                      alt="User avatar" 
                    />
                    <AvatarFallback>{getInitials(userData?.name || "User")}</AvatarFallback>
                  </Avatar>
                  {/* Pro badge indicator on avatar */}
                  {isPro && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                      <Crown className="h-2.5 w-2.5 text-white" />
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* User Info Header */}
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
                    {userData?.name || "User"}
                  </span>
                  {isPro ? (
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

              {/* Menu Items */}

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

      {/* Hot Products Modal */}
      <HotProductsModal 
        open={isHotProductsOpen} 
        onOpenChange={setIsHotProductsOpen}
      />
    </header>
  )
}

