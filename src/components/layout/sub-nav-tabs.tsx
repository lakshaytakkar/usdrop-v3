"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { findActiveGroup } from "@/data/navigation"
import { UnlockBadge } from "@/components/ui/unlock-badge"
import { useUserPlan } from "@/hooks/use-user-plan"

export function SubNavTabs() {
  const pathname = usePathname()
  const activeGroup = findActiveGroup(pathname || "")
  const { isFree, isLoading } = useUserPlan()

  if (!activeGroup || activeGroup.items.length <= 1) return null

  return (
    <div className="w-full bg-gradient-to-b from-blue-50/80 to-white border-b border-gray-200">
      <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto scrollbar-hide">
        {activeGroup.items.map((item) => {
          const isActive = pathname === item.url || pathname?.startsWith(item.url + "/")
          const isLocked = !isLoading && isFree && item.isPro

          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                isActive
                  ? "bg-white text-blue-600 shadow-sm border border-blue-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/60",
                isLocked && "opacity-60"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-blue-500" : "text-gray-400")} />
              <span>{item.title}</span>
              {isLocked && <UnlockBadge variant="text-only" />}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
