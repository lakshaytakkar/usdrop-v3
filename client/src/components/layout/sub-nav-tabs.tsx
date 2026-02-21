

import { usePathname } from "@/hooks/use-router"
import { Link } from "wouter"
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
    <div className="w-full bg-white border-b border-gray-200">
      <div className="flex items-center gap-2 px-6 py-1 overflow-x-auto scrollbar-hide">
        {activeGroup.items.map((item) => {
          const isActive = pathname === item.url || pathname?.startsWith(item.url + "/")
          const isLocked = !isLoading && isFree && item.isPro

          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-[14px] font-medium whitespace-nowrap transition-all border-b-2",
                isActive
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300",
                isLocked && "opacity-60"
              )}
            >
              <span>{item.title}</span>
              {isLocked && <UnlockBadge variant="text-only" />}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
