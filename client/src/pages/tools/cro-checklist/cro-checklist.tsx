import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { usePageTeaser } from "@/hooks/use-page-teaser"
import { FreeLearningCutoff } from "@/components/ui/free-learning-cutoff"

interface ChecklistItem {
  id: string
  label: string
  description: string
  priority: "critical" | "high" | "medium"
}

interface ChecklistCategory {
  id: string
  title: string
  icon: string
  color: { bg: string; text: string; border: string; progress: string }
  items: ChecklistItem[]
}

const priorityConfig = {
  critical: { label: "Critical", className: "bg-red-50 text-red-600 border-red-100" },
  high: { label: "High", className: "bg-amber-50 text-amber-600 border-amber-100" },
  medium: { label: "Medium", className: "bg-blue-50 text-blue-600 border-blue-100" },
}

export function CROChecklist() {
  const { user } = useAuth()
  const { isLocked, config } = usePageTeaser("/tools/cro-checklist")
  const [categories, setCategories] = useState<ChecklistCategory[]>([])
  const visibleCategories = config?.visibleItems ?? categories.length
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [filterPriority, setFilterPriority] = useState<"all" | "critical" | "high" | "medium">("all")
  const [showCompleted, setShowCompleted] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestCheckedRef = useRef<Record<string, boolean>>({})

  const saveToServer = useCallback(async (data: Record<string, boolean>) => {
    try {
      await apiFetch('/api/cro-checklist/state', {
        method: 'PUT',
        body: JSON.stringify({ checked_items: data }),
      })
    } catch (err) {
      console.error('Failed to save checklist state:', err)
    }
  }, [])

  const debouncedSave = useCallback((data: Record<string, boolean>) => {
    latestCheckedRef.current = data
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      saveToServer(data)
    }, 500)
  }, [saveToServer])

  useEffect(() => {
    if (!user) { setIsLoading(false); return }

    const loadAll = async () => {
      try {
        const [stateRes, contentRes] = await Promise.all([
          apiFetch('/api/cro-checklist/state'),
          apiFetch('/api/cro-content'),
        ])

        if (stateRes.ok) {
          const data = await stateRes.json()
          if (data.checked_items && typeof data.checked_items === 'object') {
            setChecked(data.checked_items)
            latestCheckedRef.current = data.checked_items
          }
        }

        if (contentRes.ok) {
          const cats = await contentRes.json()
          if (Array.isArray(cats) && cats.length > 0) {
            setCategories(cats)
            setExpandedCategories(Object.fromEntries(cats.map((c: ChecklistCategory) => [c.id, true])))
          }
        }
      } catch {
      } finally {
        setIsLoading(false)
      }
    }

    loadAll()
  }, [user])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  const toggleCheck = (id: string) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    debouncedSave(next)
  }

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length
  const overallPercent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  const getScore = () => {
    if (overallPercent >= 90) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50" }
    if (overallPercent >= 70) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50" }
    if (overallPercent >= 50) return { label: "Needs Work", color: "text-amber-600", bg: "bg-amber-50" }
    return { label: "Getting Started", color: "text-red-500", bg: "bg-red-50" }
  }
  const score = getScore()

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full space-y-5">
      <Card className="bg-white border-gray-100">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("px-3 py-1 rounded-full text-sm font-bold", score.bg, score.color)} data-testid="text-cro-score">
              {score.label} — {overallPercent}%
            </div>
            <span className="text-sm text-gray-400">{checkedCount} of {totalItems} completed</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", overallPercent >= 70 ? "bg-emerald-500" : overallPercent >= 40 ? "bg-amber-500" : "bg-red-400")}
              style={{ width: `${overallPercent}%` }}
              data-testid="progress-cro-overall"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "critical", "high", "medium"] as const).map(p => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-all cursor-pointer",
              filterPriority === p
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}
            data-testid={`button-filter-${p}`}
          >
            {p === "all" ? "All Items" : priorityConfig[p].label}
          </button>
        ))}

        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-all cursor-pointer ml-auto",
            !showCompleted
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          )}
          data-testid="button-toggle-completed"
        >
          {showCompleted ? "Hide Completed" : "Show Completed"}
        </button>
      </div>

      <div className="relative">
        <div className="space-y-3">
          {categories.map((category, categoryIndex) => {
            const isCategoryLocked = isLocked && categoryIndex >= visibleCategories

            const filteredItems = category.items.filter(item => {
              if (filterPriority !== "all" && item.priority !== filterPriority) return false
              if (!showCompleted && checked[item.id]) return false
              return true
            })

            if (filteredItems.length === 0) return null

            const catChecked = category.items.filter(i => checked[i.id]).length
            const catPercent = Math.round((catChecked / category.items.length) * 100)
            const isExpanded = expandedCategories[category.id]

            if (isCategoryLocked) {
              return (
                <div key={category.id} className="relative select-none" data-testid={`teaser-category-locked-${category.id}`}>
                  <div className="blur-[3px] opacity-50 pointer-events-none saturate-50">
                    <Card className="bg-white border-gray-100 overflow-hidden">
                      <div className="w-full flex items-center gap-3 px-5 py-4">
                        <div className="shrink-0 w-9 h-9 flex items-center justify-center">
                          <img src={category.icon} alt={category.title} className="w-9 h-9 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[15px] font-bold text-gray-900">{category.title}</h3>
                          </div>
                          <div className="w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                            <div className={cn("h-full rounded-full", category.color.progress)} style={{ width: "0%" }} />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm border border-gray-200">
                      <svg className="size-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                      Locked
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <Card key={category.id} className="bg-white border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  data-testid={`button-category-${category.id}`}
                >
                  <div className="shrink-0 w-9 h-9 flex items-center justify-center">
                    <img src={category.icon} alt={category.title} className="w-9 h-9 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-bold text-gray-900">{category.title}</h3>
                      <span className="text-[11px] text-gray-400 font-medium">{catChecked}/{category.items.length}</span>
                    </div>
                    <div className="w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", category.color.progress)}
                        style={{ width: `${catPercent}%` }}
                      />
                    </div>
                  </div>
                  <span className={cn("text-sm font-bold", catPercent === 100 ? "text-emerald-500" : "text-gray-400")}>{catPercent}%</span>
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-50">
                    {filteredItems.map((item, idx) => {
                      const isChecked = !!checked[item.id]
                      const pConfig = priorityConfig[item.priority]
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          className={cn(
                            "flex items-start gap-3 px-5 py-3.5 transition-all cursor-pointer group",
                            idx < filteredItems.length - 1 && "border-b border-gray-50",
                            isChecked ? "bg-emerald-50/30" : "hover:bg-gray-50/50"
                          )}
                          data-testid={`checklist-item-${item.id}`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {isChecked ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn("text-[14px] font-medium transition-all", isChecked ? "text-gray-400 line-through" : "text-gray-900")}>
                                {item.label}
                              </span>
                              <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full border", pConfig.className)}>
                                {pConfig.label}
                              </span>
                            </div>
                            <p className={cn("text-[12px] mt-0.5 leading-relaxed", isChecked ? "text-gray-300" : "text-gray-500")}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
        {isLocked && (
          <FreeLearningCutoff itemCount={visibleCategories} contentType="checklist categories" />
        )}
      </div>
    </div>
  )
}
