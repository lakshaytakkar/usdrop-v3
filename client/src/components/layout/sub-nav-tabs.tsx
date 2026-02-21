
import { useState } from "react"
import { usePathname } from "@/hooks/use-router"
import { Link } from "wouter"
import { cn } from "@/lib/utils"
import { findActiveGroup } from "@/data/navigation"
import { UnlockBadge } from "@/components/ui/unlock-badge"
import { useUserPlan } from "@/hooks/use-user-plan"
import { Search, PlayCircle, Download, SlidersHorizontal } from "lucide-react"

interface QuickFilter {
  id: string
  emoji: string
  label: string
}

interface ToolbarConfig {
  searchPlaceholder: string
  showSearch: boolean
  actions?: { label: string; icon: typeof PlayCircle; href?: string; onClick?: () => void }[]
  quickFilters?: QuickFilter[]
}

const toolbarConfigs: Record<string, ToolbarConfig> = {
  Products: {
    searchPlaceholder: "Search products by name, category, or keyword...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, href: "/mentorship" },
      { label: "Export", icon: Download },
    ],
    quickFilters: [
      { id: "last-30", emoji: "📅", label: "Last 30 Days" },
      { id: "trending", emoji: "🔥", label: "Trending" },
      { id: "high-profit", emoji: "💰", label: "High Profit" },
      { id: "new-arrivals", emoji: "✨", label: "New Arrivals" },
      { id: "top-rated", emoji: "⭐", label: "Top Rated" },
      { id: "best-sellers", emoji: "🏆", label: "Best Sellers" },
    ],
  },
  Framework: {
    searchPlaceholder: "Search your saved products, stores, and tools...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, href: "/mentorship" },
    ],
    quickFilters: [
      { id: "recent", emoji: "🕐", label: "Recently Saved" },
      { id: "favorites", emoji: "❤️", label: "Favorites" },
      { id: "products", emoji: "📦", label: "Products" },
      { id: "stores", emoji: "🏪", label: "Stores" },
    ],
  },
  Ads: {
    searchPlaceholder: "Search ad creatives, strategies, and campaigns...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, href: "/mentorship" },
    ],
    quickFilters: [
      { id: "top-performing", emoji: "🚀", label: "Top Performing" },
      { id: "video-ads", emoji: "🎬", label: "Video Ads" },
      { id: "image-ads", emoji: "🖼️", label: "Image Ads" },
      { id: "recent", emoji: "⚡", label: "Recent" },
    ],
  },
  Fulfilment: {
    searchPlaceholder: "Search suppliers, shipping options...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, href: "/mentorship" },
    ],
    quickFilters: [
      { id: "verified", emoji: "✅", label: "Verified" },
      { id: "fast-shipping", emoji: "🚚", label: "Fast Shipping" },
      { id: "low-moq", emoji: "📋", label: "Low MOQ" },
      { id: "top-rated", emoji: "🌟", label: "Top Rated" },
    ],
  },
  Tools: {
    searchPlaceholder: "Search tools and generators...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, href: "/mentorship" },
    ],
    quickFilters: [
      { id: "popular", emoji: "🎯", label: "Popular" },
      { id: "calculators", emoji: "🧮", label: "Calculators" },
      { id: "generators", emoji: "⚙️", label: "Generators" },
      { id: "templates", emoji: "📝", label: "Templates" },
    ],
  },
  Mentorship: {
    searchPlaceholder: "Search courses and lessons...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, href: "/mentorship" },
    ],
    quickFilters: [
      { id: "beginner", emoji: "🌱", label: "Beginner" },
      { id: "advanced", emoji: "🎓", label: "Advanced" },
      { id: "popular", emoji: "🔥", label: "Popular" },
      { id: "new", emoji: "🆕", label: "New Courses" },
    ],
  },
}

export function SubNavTabs() {
  const pathname = usePathname()
  const activeGroup = findActiveGroup(pathname || "")
  const { isFree, isLoading } = useUserPlan()
  const [searchValue, setSearchValue] = useState("")
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(["last-30"]))

  if (!activeGroup) return null

  const hasTabs = activeGroup.items.length > 1
  const toolbar = toolbarConfigs[activeGroup.label] || {
    searchPlaceholder: "Search...",
    showSearch: true,
  }

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(filterId)) {
        next.delete(filterId)
      } else {
        next.add(filterId)
      }
      return next
    })
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

      {toolbar.quickFilters && toolbar.quickFilters.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0 mr-1">Quick Filters</span>
          {toolbar.quickFilters.map((filter) => {
            const isActive = activeFilters.has(filter.id)
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                data-testid={`button-quickfilter-${filter.id}`}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer border",
                  isActive
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                    : "bg-white/80 border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300"
                )}
              >
                <span className="text-sm leading-none">{filter.emoji}</span>
                <span>{filter.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
