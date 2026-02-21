
import { useState } from "react"
import { usePathname } from "@/hooks/use-router"
import { Link } from "wouter"
import { cn } from "@/lib/utils"
import { findActiveGroup } from "@/data/navigation"
import { UnlockBadge } from "@/components/ui/unlock-badge"
import { useUserPlan } from "@/hooks/use-user-plan"
import { Search, PlayCircle, Download, SlidersHorizontal } from "lucide-react"

interface ToolbarConfig {
  searchPlaceholder: string
  showSearch: boolean
  actions?: { label: string; icon: typeof PlayCircle; href?: string; onClick?: () => void }[]
  filterLabel?: string
}

const toolbarConfigs: Record<string, ToolbarConfig> = {
  Products: {
    searchPlaceholder: "Search products by name, category, or keyword...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, href: "/mentorship" },
      { label: "Export", icon: Download },
    ],
    filterLabel: "Dates: Last 30 Days",
  },
  Framework: {
    searchPlaceholder: "Search your saved products, stores, and tools...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, href: "/mentorship" },
    ],
  },
  Ads: {
    searchPlaceholder: "Search ad creatives, strategies, and campaigns...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, href: "/mentorship" },
    ],
  },
  Fulfilment: {
    searchPlaceholder: "Search suppliers, shipping options...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, href: "/mentorship" },
    ],
  },
  Tools: {
    searchPlaceholder: "Search tools and generators...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, href: "/mentorship" },
    ],
  },
  Mentorship: {
    searchPlaceholder: "Search courses and lessons...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, href: "/mentorship" },
    ],
  },
}

export function SubNavTabs() {
  const pathname = usePathname()
  const activeGroup = findActiveGroup(pathname || "")
  const { isFree, isLoading } = useUserPlan()
  const [searchValue, setSearchValue] = useState("")

  if (!activeGroup) return null

  const hasTabs = activeGroup.items.length > 1
  const toolbar = toolbarConfigs[activeGroup.label] || {
    searchPlaceholder: "Search...",
    showSearch: true,
  }

  return (
    <div className="w-full px-3 pt-3 pb-1 space-y-2.5">
      {hasTabs && <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {activeGroup.items.map((item) => {
          const isActive = pathname === item.url || pathname?.startsWith(item.url + "/")
          const isLocked = !isLoading && isFree && item.isPro

          return (
            <Link
              key={item.url}
              href={item.url}
              data-testid={`link-subnav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium whitespace-nowrap transition-all rounded-lg",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/80",
                isLocked && "opacity-50"
              )}
            >
              <span>{item.title}</span>
              {isLocked && <UnlockBadge variant="text-only" />}
            </Link>
          )
        })}
      </div>}

      {toolbar.showSearch && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0 h-10 px-3.5 rounded-lg border border-gray-200 bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
            <SlidersHorizontal className="h-4 w-4 text-gray-400 shrink-0" />
            <div className="h-5 w-px bg-gray-200 shrink-0" />
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={toolbar.searchPlaceholder}
              className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
              data-testid="input-subnav-search"
            />
          </div>

          {toolbar.actions && toolbar.actions.length > 0 && (
            <div className="flex items-center gap-1.5 shrink-0">
              {toolbar.actions.map((action) => {
                const ActionIcon = action.icon
                const buttonContent = (
                  <>
                    <ActionIcon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </>
                )

                if (action.href) {
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all whitespace-nowrap"
                      data-testid={`button-toolbar-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {buttonContent}
                    </Link>
                  )
                }
                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer whitespace-nowrap"
                    data-testid={`button-toolbar-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {buttonContent}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {toolbar.filterLabel && (
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-700">Filtering Conditions</span>
          <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-500 text-xs font-medium">{toolbar.filterLabel}</span>
        </div>
      )}
    </div>
  )
}
