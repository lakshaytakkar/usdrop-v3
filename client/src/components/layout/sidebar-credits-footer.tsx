

import { useState, useEffect } from "react"
import { usePathname } from "@/hooks/use-router"
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
            "group relative w-full h-10 rounded-md text-sm font-medium text-white transition-all duration-300 cursor-pointer",
            "flex items-center gap-2 px-3"
          )}
        >
          <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
          <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
          <span className="relative flex items-center gap-2 z-10 w-full">
            <div className="flex items-center gap-2.5">
              {/* Coin Icon */}
              <Coins 
                className="h-5 w-5 text-[#FFD700] flex-shrink-0" 
              />
              
              {/* Credits Text */}
              <span className="text-sm font-medium text-white">
                {credits} credits
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 ml-auto">
              {/* Vertical Separator */}
              <div className="h-4 w-px bg-white/30" />
              
              {/* Upgrade Text */}
              <span className="text-sm font-medium text-white group-hover:text-white/90 transition-colors">
                Upgrade
              </span>
            </div>
          </span>
        </button>
      </div>

      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </>
  )
}

