
import { useState, useRef, useEffect } from "react"
import { usePathname } from "@/hooks/use-router"
import { Link } from "wouter"
import { cn } from "@/lib/utils"
import { findActiveGroup, NavItem } from "@/data/navigation"
import { UnlockBadge } from "@/components/ui/unlock-badge"
import { useUserPlan } from "@/hooks/use-user-plan"
import { Search, PlayCircle, Download, SlidersHorizontal, ChevronDown } from "lucide-react"
import { VideoTutorialModal } from "@/components/ui/video-tutorial-modal"

interface QuickFilter {
  id: string
  emoji: string
  label: string
}

interface ToolbarAction {
  label: string
  icon: typeof PlayCircle
  href?: string
  onClick?: () => void
  isVideoTutorial?: boolean
}

interface ToolbarConfig {
  searchPlaceholder: string
  showSearch: boolean
  actions?: ToolbarAction[]
  quickFilters?: QuickFilter[]
  videoTutorialTitle?: string
  videoTutorialUrl?: string
}

const toolbarConfigs: Record<string, ToolbarConfig> = {
  Products: {
    searchPlaceholder: "Search products by name, category, or keyword...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, isVideoTutorial: true },
      { label: "Export", icon: Download },
    ],
    videoTutorialTitle: "Products Page Video Tutorial",
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
    searchPlaceholder: "",
    showSearch: false,
    actions: [],
  },
  Ads: {
    searchPlaceholder: "Search ad creatives, strategies, and campaigns...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, isVideoTutorial: true },
    ],
    videoTutorialTitle: "Ads Page Video Tutorial",
    quickFilters: [
      { id: "top-performing", emoji: "🚀", label: "Top Performing" },
      { id: "video-ads", emoji: "🎬", label: "Video Ads" },
      { id: "image-ads", emoji: "🖼️", label: "Image Ads" },
      { id: "recent", emoji: "⚡", label: "Recent" },
    ],
  },
  "Private Supplier": {
    searchPlaceholder: "",
    showSearch: false,
    actions: [],
  },
  "LLC": {
    searchPlaceholder: "",
    showSearch: false,
    actions: [],
  },
  Marketplaces: {
    searchPlaceholder: "",
    showSearch: false,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, isVideoTutorial: true },
    ],
    videoTutorialTitle: "Marketplaces Page Video Tutorial",
  },
  Tools: {
    searchPlaceholder: "",
    showSearch: false,
    actions: [],
  },
  Resources: {
    searchPlaceholder: "",
    showSearch: false,
    actions: [],
  },
}

const MAX_VISIBLE_TABS: Record<string, number> = {
  Framework: 7,
}

function SubNavTabItem({ item, index, isActive, isLocked, showNumbering }: {
  item: NavItem
  index: number
  isActive: boolean
  isLocked: boolean
  showNumbering: boolean
}) {
  return (
    <Link
      href={item.url}
      data-testid={`link-subnav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2 text-[14px] font-semibold whitespace-nowrap transition-all rounded-lg",
        isActive
          ? "bg-blue-600 text-white shadow-sm"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80",
        isLocked && "opacity-50"
      )}
    >
      <span>{showNumbering ? `${index + 1}) ${item.title}` : item.title}</span>
      {item.isAiStudio && (
        <span className={cn(
          "text-[9px] font-bold tracking-wide uppercase leading-none px-1 py-0.5 rounded",
          isActive
            ? "bg-white/20 text-white"
            : "bg-gradient-to-r from-violet-500 to-blue-500 text-white"
        )}>
          AI
        </span>
      )}
      {isLocked && <UnlockBadge variant="text-only" />}
    </Link>
  )
}

function MoreDropdown({ items, pathname, isFree, isLoading, showNumbering, startIndex }: {
  items: NavItem[]
  pathname: string | null
  isFree: boolean
  isLoading: boolean
  showNumbering: boolean
  startIndex: number
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const hasActiveChild = items.some(item =>
    pathname === item.url || (item.url !== "/framework" && pathname?.startsWith(item.url + "/"))
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        data-testid="button-subnav-more"
        className={cn(
          "flex items-center gap-1 px-3.5 py-2 text-[14px] font-semibold whitespace-nowrap transition-all rounded-lg cursor-pointer",
          hasActiveChild
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
        )}
      >
        More
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[200px] rounded-xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-1.5 space-y-0.5">
          {items.map((item, idx) => {
            const globalIndex = startIndex + idx
            const isActive = pathname === item.url || (item.url !== "/framework" && pathname?.startsWith(item.url + "/"))
            const isLocked = !isLoading && isFree && item.isPro

            return (
              <Link
                key={item.url}
                href={item.url}
                onClick={() => setOpen(false)}
                data-testid={`link-subnav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50",
                  isLocked && "opacity-50"
                )}
              >
                <span>{showNumbering ? `${globalIndex + 1}) ${item.title}` : item.title}</span>
                {item.isAiStudio && (
                  <span className="text-[9px] font-bold tracking-wide uppercase leading-none px-1 py-0.5 rounded bg-gradient-to-r from-violet-500 to-blue-500 text-white">
                    AI
                  </span>
                )}
                {isLocked && <UnlockBadge variant="text-only" />}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function SubNavTabs() {
  const pathname = usePathname()
  const activeGroup = findActiveGroup(pathname || "")
  const { isFree, isLoading } = useUserPlan()
  const [searchValue, setSearchValue] = useState("")
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(["last-30"]))
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  if (!activeGroup) return null

  const hasTabs = activeGroup.items.length > 1
  const toolbar = toolbarConfigs[activeGroup.label] || {
    searchPlaceholder: "Search...",
    showSearch: true,
  }

  const hasToolbar = toolbar.showSearch || (toolbar.actions && toolbar.actions.length > 0)
  const hasFilters = toolbar.quickFilters && toolbar.quickFilters.length > 0
  if (!hasTabs && !hasToolbar && !hasFilters) return null

  const maxVisible = MAX_VISIBLE_TABS[activeGroup.label] ?? activeGroup.items.length
  const visibleItems = activeGroup.items.slice(0, maxVisible)
  const overflowItems = activeGroup.items.slice(maxVisible)
  const showNumbering = activeGroup.label === "Framework"

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
    <>
      <div className="w-full px-12 md:px-20 lg:px-32 pt-2 pb-1.5">
        <div
          className="rounded-xl border border-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] px-5 lg:px-6 py-2.5 space-y-2.5"
          style={{
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >

        {hasTabs && <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 min-w-0 flex-1 overflow-x-auto scrollbar-hide">
            {visibleItems.map((item, index) => {
              const isActive = pathname === item.url || (item.url !== "/framework" && pathname?.startsWith(item.url + "/"))
              const isLocked = !isLoading && isFree && item.isPro

              return (
                <SubNavTabItem
                  key={item.url}
                  item={item}
                  index={index}
                  isActive={isActive}
                  isLocked={isLocked}
                  showNumbering={showNumbering}
                />
              )
            })}
          </div>
          {overflowItems.length > 0 && (
            <div className="flex-shrink-0 border-l border-gray-200/60 pl-1 ml-1">
              <MoreDropdown
                items={overflowItems}
                pathname={pathname}
                isFree={isFree}
                isLoading={isLoading}
                showNumbering={showNumbering}
                startIndex={maxVisible}
              />
            </div>
          )}
        </div>}

        {(toolbar.showSearch || (toolbar.actions && toolbar.actions.length > 0)) && (
          <div className="flex items-center gap-2">
            {toolbar.showSearch && (
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
            )}

            {!toolbar.showSearch && <div className="flex-1" />}

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

                  if (action.isVideoTutorial) {
                    return (
                      <button
                        key={action.label}
                        onClick={() => setVideoModalOpen(true)}
                        className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer whitespace-nowrap"
                        data-testid="button-toolbar-video-tutorial"
                      >
                        {buttonContent}
                      </button>
                    )
                  }

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
      </div>

      <VideoTutorialModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        title={toolbar.videoTutorialTitle || `${activeGroup.label} Video Tutorial`}
        videoUrl={toolbar.videoTutorialUrl}
      />
    </>
  )
}
