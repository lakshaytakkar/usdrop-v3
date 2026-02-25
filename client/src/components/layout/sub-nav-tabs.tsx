
import { useState } from "react"
import { usePathname } from "@/hooks/use-router"
import { Link } from "wouter"
import { cn } from "@/lib/utils"
import { findActiveGroup, NavItem } from "@/data/navigation"
import { UnlockBadge } from "@/components/ui/unlock-badge"
import { useUserPlan } from "@/hooks/use-user-plan"
import { Search, PlayCircle, Download, SlidersHorizontal } from "lucide-react"
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
  "AI Studio": {
    searchPlaceholder: "",
    showSearch: false,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, isVideoTutorial: true },
    ],
    videoTutorialTitle: "AI Studio Video Tutorial",
  },
  Tools: {
    searchPlaceholder: "",
    showSearch: false,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, isVideoTutorial: true },
    ],
    videoTutorialTitle: "Tools Video Tutorial",
  },
  Resources: {
    searchPlaceholder: "",
    showSearch: false,
    actions: [],
  },
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
        "flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium whitespace-nowrap transition-all rounded-lg border",
        isActive
          ? "bg-white text-black border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          : "bg-transparent text-[#666] border-transparent hover:bg-white/60 hover:text-black hover:border-black/[0.04]",
        isLocked && "opacity-50"
      )}
    >
      <span>{showNumbering ? `${index + 1}) ${item.title}` : item.title}</span>
      {item.isAiStudio && (
        <span className={cn(
          "text-[9px] font-bold tracking-wide uppercase leading-none px-1 py-0.5 rounded",
          isActive
            ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white"
            : "bg-gradient-to-r from-violet-500 to-blue-500 text-white"
        )}>
          AI
        </span>
      )}
      {isLocked && <UnlockBadge variant="text-only" />}
    </Link>
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
  const isOnCategories = pathname?.includes('/categories') || pathname?.includes('/seasonal-collections')
  const toolbar = toolbarConfigs[activeGroup.label] || {
    searchPlaceholder: "Search...",
    showSearch: true,
  }

  const hasToolbar = !isOnCategories && (toolbar.showSearch || (toolbar.actions && toolbar.actions.length > 0))
  const hasFilters = toolbar.quickFilters && toolbar.quickFilters.length > 0
  if (!hasTabs && !hasToolbar && !hasFilters) return null

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
      <div className="w-full px-12 md:px-20 lg:px-32 pt-2.5 pb-1.5">
        <div className="space-y-2.5">

        {hasTabs && <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-x-auto scrollbar-hide">
            {activeGroup.items.map((item, index) => {
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
          {!toolbar.showSearch && toolbar.actions && toolbar.actions.length > 0 && (
            <div className="flex-shrink-0 flex items-center gap-1.5 border-l border-black/[0.06] pl-3 ml-1">
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
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-black/[0.06] bg-white text-[13px] font-medium text-[#666] hover:text-black hover:border-black/[0.1] transition-all cursor-pointer whitespace-nowrap"
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
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-black/[0.06] bg-white text-[13px] font-medium text-[#666] hover:text-black hover:border-black/[0.1] transition-all whitespace-nowrap"
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
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-black/[0.06] bg-white text-[13px] font-medium text-[#666] hover:text-black hover:border-black/[0.1] transition-all cursor-pointer whitespace-nowrap"
                    data-testid={`button-toolbar-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {buttonContent}
                  </button>
                )
              })}
            </div>
          )}
        </div>}

        {toolbar.showSearch && !isOnCategories && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0 h-10 px-3.5 rounded-lg border border-black/[0.06] bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
              <SlidersHorizontal className="h-4 w-4 text-[#999] shrink-0" />
              <div className="h-5 w-px bg-black/[0.06] shrink-0" />
              <Search className="h-4 w-4 text-[#999] shrink-0" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={toolbar.searchPlaceholder}
                className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 placeholder:text-[#999] outline-none"
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

                  if (action.isVideoTutorial) {
                    return (
                      <button
                        key={action.label}
                        onClick={() => setVideoModalOpen(true)}
                        className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-black/[0.06] bg-white text-sm font-medium text-[#666] hover:text-black hover:border-black/[0.1] transition-all cursor-pointer whitespace-nowrap"
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
                        className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-black/[0.06] bg-white text-sm font-medium text-[#666] hover:text-black hover:border-black/[0.1] transition-all whitespace-nowrap"
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
                      className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-black/[0.06] bg-white text-sm font-medium text-[#666] hover:text-black hover:border-black/[0.1] transition-all cursor-pointer whitespace-nowrap"
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
