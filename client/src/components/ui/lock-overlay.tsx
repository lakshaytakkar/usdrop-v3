

import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface LockOverlayProps {
  onClick?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "full" | "button"
}

export function LockOverlay({ 
  onClick, 
  className,
  size = "md",
  variant = "full"
}: LockOverlayProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20"
  }

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-9 w-9"
  }

  return (
    <div 
      className={cn(
        "absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60 z-20 flex items-center justify-center cursor-pointer transition-all duration-300 hover:from-black/30 hover:via-black/50 hover:to-black/70 group/lock",
        variant === "button" && "rounded-md",
        className
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      <div className={cn(
        "text-center transform transition-all duration-300 group-hover/lock:scale-105",
        variant === "full" ? "space-y-3" : "space-y-0"
      )}>
        {/* Enhanced Lock Icon */}
        <div className={cn(
          "mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl border-4 border-white/20 backdrop-blur-sm relative overflow-hidden",
          sizeClasses[size]
        )}>
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover/lock:translate-x-full transition-transform duration-700" />
          <Lock className={cn("text-white relative z-10 drop-shadow-lg", iconSizes[size])} strokeWidth={2.5} />
        </div>
        
        {/* Text - Only show for full variant */}
        {variant === "full" && (
          <div className="space-y-1">
            <p className="text-white text-sm font-bold drop-shadow-lg">Premium Content</p>
            <p className="text-white/90 text-xs font-medium drop-shadow">Click to Upgrade</p>
          </div>
        )}
      </div>
    </div>
  )
}

