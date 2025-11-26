"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
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
import { 
  Gift, 
  UserPlus, 
  Moon, 
  Sun, 
  GraduationCap, 
  Bell,
  Settings,
  Gem,
  Palette,
  ArrowLeftRight,
  LogOut,
} from "lucide-react"
import { useState } from "react"

export function Topbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side - Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
        </div>

        {/* Right side - Action Buttons and Profile Menu */}
        <div className="flex items-center gap-2">
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
            size="icon"
            className="hidden sm:flex cursor-pointer"
            title="Invite"
          >
            <UserPlus className="h-4 w-4" />
            <span className="sr-only">Invite</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="cursor-pointer"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            title="Tutorial"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="sr-only">Tutorial</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
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
                <Palette className="mr-2 h-4 w-4" />
                Brand kits
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite members
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Gift className="mr-2 h-4 w-4" />
                Refer and get reward
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Switch team / brand
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive" className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

