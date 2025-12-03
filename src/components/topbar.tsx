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
import { RainbowButton } from "@/components/ui/rainbow-button"
import { AIChatbotDialog } from "@/components/ai-chatbot-dialog"
import { cn } from "@/lib/utils"
import { 
  Gift, 
  Moon, 
  Sun, 
  GraduationCap, 
  Bell,
  Settings,
  Gem,
  LogOut,
  Sparkles,
  HelpCircle,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

export function Topbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const aiButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
    // Check if dark mode is already set
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b border-border",
      isAIChatOpen 
        ? "bg-background backdrop-blur-none" 
        : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="flex h-16 items-center justify-end px-2">
        {/* Action Buttons and Profile Menu */}
        <div className="flex items-center gap-2">
          {/* Ask USDrop AI Button */}
          <RainbowButton
            ref={aiButtonRef}
            size="lg"
            className="hidden sm:flex items-center gap-2 h-[36.8px] rounded-lg font-sans px-[14.72px]"
            onClick={() => setIsAIChatOpen(!isAIChatOpen)}
          >
            <Sparkles className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-normal whitespace-nowrap">Ask USDrop AI</span>
          </RainbowButton>

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
            onClick={toggleTheme}
            className="cursor-pointer"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            suppressHydrationWarning
          >
            {mounted && theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : mounted ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            title="Help"
            asChild
          >
            <Link href="/help">
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Link>
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

              <DropdownMenuItem variant="destructive" className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          )}
        </div>
      </div>

      {/* AI Chatbot Dialog */}
      <AIChatbotDialog 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)}
        buttonRef={aiButtonRef}
      />
    </header>
  )
}

