"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Coins } from "lucide-react"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { cn } from "@/lib/utils"

export function SidebarCreditsFooter() {
  const pathname = usePathname()
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const [credits, setCredits] = useState(0)

  // Hide footer on admin routes
  const isOnAdminRoute = pathname === "/admin" ||
                         (pathname?.startsWith("/admin/") ?? false)

  // Fetch user credits (placeholder - replace with actual API call)
  useEffect(() => {
    // TODO: Replace with actual credits fetching logic
    // For now, defaulting to 0
    setCredits(0)
  }, [])

  if (isOnAdminRoute) {
    return null
  }

  return (
    <>
      <div className="px-2 pb-2">
        <button
          onClick={() => setIsUpsellOpen(true)}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl",
            "bg-gradient-to-br from-primary via-primary/95 to-primary/90",
            "border-2 border-primary/80 shadow-xl",
            "hover:bg-gradient-to-br hover:from-primary hover:via-primary hover:to-primary/95",
            "hover:border-primary hover:shadow-2xl",
            "transition-all duration-200",
            "group cursor-pointer",
            "active:scale-[0.98]"
          )}
        >
          <div className="flex items-center gap-2.5">
            {/* Golden Coin Icon - Very vibrant with strong glow */}
            <div className="relative flex-shrink-0">
              <Coins 
                className="h-5 w-5 text-[#FFD700] flex-shrink-0" 
                style={{
                  filter: 'drop-shadow(0 3px 8px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 12px rgba(255, 215, 0, 0.6))',
                }}
              />
              <div className="absolute inset-0 h-5 w-5 text-[#FFA500] opacity-70 blur-[4px] -z-10">
                <Coins className="h-5 w-5" />
              </div>
            </div>
            
            {/* Credits Text */}
            <span className="text-sm font-bold text-primary-foreground">
              {credits} credits
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Vertical Separator */}
            <div className="h-4 w-px bg-primary-foreground/30" />
            
            {/* Upgrade Text */}
            <span className="text-sm font-bold text-primary-foreground group-hover:text-primary-foreground/90 transition-colors">
              Upgrade
            </span>
          </div>
        </button>
      </div>

      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </>
  )
}

