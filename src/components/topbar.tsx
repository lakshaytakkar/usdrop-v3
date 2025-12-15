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
  Gift, 
  GraduationCap, 
  Settings,
  Gem,
  LogOut,
  HelpCircle,
  Flame,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export function Topbar() {
  const [mounted, setMounted] = useState(false)
  const [isHotProductsOpen, setIsHotProductsOpen] = useState(false)
  const { signOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

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
            className="hidden sm:flex items-center gap-2 cursor-pointer"
          >
            <Gift className="h-4 w-4" />
            <span className="hidden lg:inline">Refer and get reward</span>
          </Button>

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
            title="Academy"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="hidden lg:inline">Academy</span>
            <span className="sr-only">Academy</span>
          </Button>

          {/* User Profile Dropdown */}
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer" suppressHydrationWarning>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://avatar.iran.liara.run/public" alt="User avatar" />
                    <AvatarFallback>LT</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* User Info Header */}
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://avatar.iran.liara.run/public" alt="User avatar" />
                  <AvatarFallback>LT</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    Lakshay Takkar
                  </span>
                  <Badge variant="secondary" className="w-fit text-xs mt-0.5">
                    Free Plan
                  </Badge>
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* Menu Items */}
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Gem className="mr-2 h-4 w-4" />
                Subscriptions
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Gift className="mr-2 h-4 w-4" />
                Refer and get reward
              </DropdownMenuItem>

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

      {/* Hot Products Modal */}
      <HotProductsModal 
        open={isHotProductsOpen} 
        onOpenChange={setIsHotProductsOpen}
      />
    </header>
  )
}

