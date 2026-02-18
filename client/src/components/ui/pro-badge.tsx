

import { cn } from "@/lib/utils"

export interface ProBadgeProps {
  className?: string
  size?: "sm" | "md"
}

export function ProBadge({ className, size = "sm" }: ProBadgeProps) {
  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-1 text-xs",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold",
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
      Pro
    </span>
  )
}

export interface LimitedBadgeProps {
  className?: string
  size?: "sm" | "md"
}

export function LimitedBadge({ className, size = "sm" }: LimitedBadgeProps) {
  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-1 text-xs",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold",
        "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600",
        "text-blue-50",
        "border border-blue-300/60",
        sizeStyles[size],
        className
      )}
      style={{
        background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 25%, #2563eb 50%, #3b82f6 75%, #60a5fa 100%)",
      }}
    >
      Limited
    </span>
  )
}

