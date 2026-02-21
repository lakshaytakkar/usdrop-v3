

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
    <div className="w-full px-3 mt-1">
      <div
        className="flex items-center gap-0 px-4 lg:px-5 overflow-x-auto scrollbar-hide rounded-lg border border-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        {activeGroup.items.map((item) => {
          const isActive = pathname === item.url || pathname?.startsWith(item.url + "/")
          const isLocked = !isLoading && isFree && item.isPro

          return (
            <Link
              key={item.url}
              href={item.url}
              data-testid={`link-subnav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2",
                isActive
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-400 border-transparent hover:text-gray-700 hover:border-gray-200",
                isLocked && "opacity-50"
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
