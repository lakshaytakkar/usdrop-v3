

import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function MentorBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-700",
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-md",
        "text-xs font-semibold uppercase tracking-wide",
        className
      )}
    >
      <Users className="h-3.5 w-3.5" />
      <span>HEAD MENTOR & STRATEGIST</span>
    </Badge>
  )
}










