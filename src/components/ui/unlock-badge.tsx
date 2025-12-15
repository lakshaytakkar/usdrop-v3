"use client"

import { cn } from "@/lib/utils"
import { Unlock } from "lucide-react"

export interface UnlockBadgeProps {
  className?: string
  size?: "sm" | "md"
}

export function UnlockBadge({ className, size = "sm" }: UnlockBadgeProps) {
  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-1 text-xs",
  }

  const iconSizes = {
    sm: "h-2.5 w-2.5",
    md: "h-3 w-3",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-full font-semibold",
        "bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500",
        "text-yellow-50",
        "border border-yellow-300/60",
        sizeStyles[size],
        className
      )}
      style={{
        background: "linear-gradient(135deg, #facc15 0%, #fbbf24 25%, #f59e0b 50%, #fbbf24 75%, #facc15 100%)",
      }}
    >
      <Unlock className={iconSizes[size]} />
      <span>Unlock</span>
    </span>
  )
}

