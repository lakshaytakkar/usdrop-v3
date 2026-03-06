import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/supabase"
import { ModuleAccessGuard } from "@/components/auth/module-access-guard"
import { FrameworkBanner } from "@/components/framework-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Clock, ExternalLink, Search, ChevronDown, ChevronRight, Video, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOnboarding } from "@/contexts/onboarding-context"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { LockOverlay } from "@/components/ui/lock-overlay"
import { ButtonSpinner } from "@/components/ui/blue-spinner"

interface Session {
  id: string
  title: string
  description: string
  url: string
  session_date: string | null
  duration: string | null
  category: string
  order_index: number
  is_published: boolean
}

interface AccessCheckResponse {
  plan: string
  accessMap: Record<string, { level: string; teaserLimit?: number }>
  unlockedContent: Array<{ type: string; id: string }>
}

const CATEGORY_ORDER = [
  "Foundation & Onboarding",
  "Strategy & Mentorship",
  "Product Research",
  "Sourcing & Suppliers",
  "Meta Ads",
]

const CATEGORY_COLORS: Record<string, string> = {
  "Foundation & Onboarding": "bg-blue-50 text-blue-700 border-blue-200",
  "Strategy & Mentorship": "bg-purple-50 text-purple-700 border-purple-200",
  "Product Research": "bg-green-50 text-green-700 border-green-200",
  "Sourcing & Suppliers": "bg-orange-50 text-orange-700 border-orange-200",
  "Meta Ads": "bg-pink-50 text-pink-700 border-pink-200",
}

export default function MySessionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(CATEGORY_ORDER))
  const [openingId, setOpeningId] = useState<string | null>(null)
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<Session[]>({
    queryKey: ['/api/sessions'],
    queryFn: () => apiFetch('/api/sessions').then(r => r.json()),
  })

  const { data: accessData } = useQuery<AccessCheckResponse>({
    queryKey: ['/api/access/check'],
    queryFn: () => apiFetch('/api/access/check').then(r => r.json()),
  })

  const unlockedSessionIds = useMemo(() => {
    if (!accessData?.unlockedContent) return new Set<string>()
    return new Set(
      accessData.unlockedContent
        .filter(c => c.type === 'session')
        .map(c => c.id)
    )
  }, [accessData])

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      if (selectedCategory && s.category !== selectedCategory) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      }
      return true
    })
  }, [sessions, searchQuery, selectedCategory])

  const grouped = useMemo(() => {
    const map: Record<string, Session[]> = {}
    for (const s of filtered) {
      if (!map[s.category]) map[s.category] = []
      map[s.category].push(s)
    }
    const knownCategories = CATEGORY_ORDER.filter(c => map[c]).map(c => ({ category: c, sessions: map[c] }))
    const unknownCategories = Object.keys(map)
      .filter(c => !CATEGORY_ORDER.includes(c))
      .map(c => ({ category: c, sessions: map[c] }))
    return [...knownCategories, ...unknownCategories]
  }, [filtered])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const s of sessions) {
      counts[s.category] = (counts[s.category] || 0) + 1
    }
    return counts
  }, [sessions])

  const allCategories = useMemo(() => {
    const cats = new Set(sessions.map(s => s.category))
    const ordered = CATEGORY_ORDER.filter(c => cats.has(c))
    const extra = [...cats].filter(c => !CATEGORY_ORDER.includes(c))
    return [...ordered, ...extra]
  }, [sessions])

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const isSessionUnlocked = (sessionId: string) => {
    return unlockedSessionIds.has(sessionId)
  }

  const handleWatch = (session: Session) => {
    if (isFree) {
      setIsUpsellOpen(true)
      return
    }
    if (!isSessionUnlocked(session.id) && !isFree) {
      setIsUpsellOpen(true)
      return
    }
    setOpeningId(session.id)
    window.open(session.url, "_blank", "noopener,noreferrer")
    setTimeout(() => setOpeningId(null), 600)
  }

  return (
    <ModuleAccessGuard moduleId="mentorship">
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2" data-testid="page-my-sessions">
      <FrameworkBanner
        title="My Sessions"
        description="Recorded live strategy sessions with expert mentorship"
        iconSrc="/3d-ecom-icons-blue/Webinar_Video.png"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0 h-9 px-3 rounded-lg border border-gray-200 bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions..."
            className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            data-testid="input-search-sessions"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border cursor-pointer",
              !selectedCategory
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            )}
            data-testid="filter-all"
          >
            All ({sessions.length})
          </button>
          {allCategories.map(cat => {
            const count = categoryCounts[cat] || 0
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border cursor-pointer",
                  selectedCategory === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                )}
                data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3 pb-6">
        {sessionsLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="ml-6 space-y-1.5">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100">
                      <Skeleton className="h-10 w-12" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!sessionsLoading && grouped.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-muted-foreground">No sessions found</p>
            </CardContent>
          </Card>
        )}

        {!sessionsLoading && grouped.map(({ category, sessions: catSessions }) => {
          const isExpanded = expandedCategories.has(category)
          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="flex items-center gap-2 w-full text-left mb-2 group cursor-pointer"
                data-testid={`toggle-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm font-semibold text-gray-700">{category}</span>
                <Badge variant="secondary" className={cn("text-[10px] px-2 py-0 border", CATEGORY_COLORS[category] || "")}>
                  {catSessions.length} sessions
                </Badge>
              </button>

              {isExpanded && (
                <div className="space-y-1.5 ml-6">
                  {catSessions.map((session, idx) => {
                    const unlocked = isSessionUnlocked(session.id)
                    const locked = !isFree && !unlocked

                    return (
                      <div
                        key={session.id}
                        className="relative group flex items-center gap-4 p-3 rounded-lg border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
                        data-testid={`session-${session.id}`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" data-testid={`sno-${session.id}`}>
                          <span className="text-[13px] font-semibold text-gray-500">{idx + 1}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate" data-testid={`text-title-${session.id}`}>
                            {session.title}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            {session.duration && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {session.duration}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="relative flex-shrink-0">
                          <button
                            onClick={() => handleWatch(session)}
                            disabled={openingId === session.id}
                            className={cn(
                              "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium transition-all cursor-pointer",
                              locked
                                ? "bg-gray-100 text-gray-400 border border-gray-200"
                                : "bg-blue-600 text-white hover:bg-blue-700",
                              "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                            data-testid={`button-watch-${session.id}`}
                          >
                            {openingId === session.id ? (
                              <ButtonSpinner className="text-white" />
                            ) : locked ? (
                              <>
                                <Lock className="h-3 w-3" />
                                Locked
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3" />
                                Watch
                              </>
                            )}
                          </button>
                          {isFree && (
                            <LockOverlay
                              onClick={() => setIsUpsellOpen(true)}
                              variant="button"
                              size="sm"
                              className="rounded-md"
                            />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <UpsellDialog
        isOpen={isUpsellOpen}
        onClose={() => setIsUpsellOpen(false)}
      />
    </div>
    </ModuleAccessGuard>
  )
}
