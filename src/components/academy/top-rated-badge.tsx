"use client"

import { Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function TopRatedBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-white border-slate-200 text-slate-700 hover:bg-white hover:text-slate-700",
        "inline-flex flex-col items-center gap-1 px-3 py-2 rounded-lg",
        "shadow-sm",
        className
      )}
    >
      <Award className="h-4 w-4 text-yellow-500 fill-yellow-500" />
      <span className="text-xs font-semibold">Top Rated</span>
    </Badge>
  )
}










