
import { useState, useRef, useEffect, useCallback } from "react"
import { usePathname } from "@/hooks/use-router"
import { Link } from "wouter"
import { cn } from "@/lib/utils"
import { findActiveGroup, NavItem } from "@/data/navigation"
import { UnlockBadge } from "@/components/ui/unlock-badge"
import { useUserPlan } from "@/hooks/use-user-plan"
import { Search, PlayCircle, Download, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { VideoTutorialModal } from "@/components/ui/video-tutorial-modal"

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
  },
  Framework: {
    searchPlaceholder: "",
    showSearch: false,
    actions: [],
  },
  "Videos & Ads": {
    searchPlaceholder: "Search ad creatives, strategies, and campaigns...",
    showSearch: true,
    actions: [
      { label: "Video Tutorial", icon: PlayCircle, isVideoTutorial: true },
    ],
    videoTutorialTitle: "Videos & Ads Video Tutorial",
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
      {item.iconSrc && (
        <img src={item.iconSrc} alt="" className="h-4 w-4 shrink-0" />
      )}
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
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", checkScroll, { passive: true })
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      ro.disconnect()
    }
  }, [checkScroll, activeGroup?.label])

  if (!activeGroup) return null

  const hasTabs = activeGroup.items.length > 1
  const isDetailPage = /\/products\/product-hunt\/[^/]+$/.test(pathname || "")
  if (isDetailPage) return null
  const isMetaAdsPage = pathname === "/ads/meta-ads"
  const hideToolbar = pathname?.includes('/categories') || pathname?.includes('/seasonal-collections')
  const toolbar = toolbarConfigs[activeGroup.label] || {
    searchPlaceholder: "Search...",
    showSearch: true,
  }

  const hasToolbar = !hideToolbar && (toolbar.showSearch || (toolbar.actions && toolbar.actions.length > 0))
  const hasCustomToolbar = isMetaAdsPage
  if (!hasTabs && !hasToolbar && !hasCustomToolbar) return null

  const showNumbering = activeGroup.label === "Framework"

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const children = Array.from(el.children) as HTMLElement[]
    if (direction === "right") {
      const next = children.find(
        (child) => child.offsetLeft + child.offsetWidth > el.scrollLeft + el.clientWidth + 2
      )
      if (next) {
        el.scrollTo({ left: next.offsetLeft - 4, behavior: "smooth" })
      }
    } else {
      const prev = [...children].reverse().find(
        (child) => child.offsetLeft < el.scrollLeft - 2
      )
      if (prev) {
        el.scrollTo({ left: prev.offsetLeft - 4, behavior: "smooth" })
      }
    }
  }

  return (
    <>
      <div className="w-full px-12 md:px-20 lg:px-32 pt-2.5 pb-1.5">
        <div className="space-y-2.5">

        {hasTabs && <div className="flex items-center gap-1.5">
          {canScrollLeft && (
            <button
              onClick={() => scrollBy("left")}
              className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-black/[0.08] bg-white hover:bg-gray-50 text-gray-500 hover:text-black transition-all shadow-sm"
              data-testid="button-scroll-tabs-left"
              aria-label="Scroll tabs left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div
            ref={scrollRef}
            className="flex items-center gap-1.5 min-w-0 flex-1 overflow-x-hidden"
          >
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
          {canScrollRight && (
            <button
              onClick={() => scrollBy("right")}
              className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-black/[0.08] bg-white hover:bg-gray-50 text-gray-500 hover:text-black transition-all shadow-sm"
              data-testid="button-scroll-tabs-right"
              aria-label="Scroll tabs right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
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

        {hasCustomToolbar ? (
          <div id="subnav-custom-toolbar" className="space-y-2" />
        ) : toolbar.showSearch && !hideToolbar ? (
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
        ) : null}


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
