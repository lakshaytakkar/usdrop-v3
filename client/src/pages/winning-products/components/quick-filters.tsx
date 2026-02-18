

import { Card } from "@/components/ui/card"
import { Sparkles, TrendingUp, Zap, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type QuickFilterType = "top-new" | "high-potential" | "sales-grow" | null

interface QuickFilter {
  id: QuickFilterType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  iconBg: string
  badge?: string
}

const filters: QuickFilter[] = [
  {
    id: "top-new",
    label: "Top New Products",
    description: "Fresh finds from last 14 days",
    icon: Sparkles,
    gradient: "from-purple-500/10 via-pink-500/10 to-purple-500/10",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    badge: "NEW",
  },
  {
    id: "high-potential",
    label: "High Potential",
    description: "45%+ margin or $100k+ revenue",
    icon: TrendingUp,
    gradient: "from-emerald-500/10 via-teal-500/10 to-emerald-500/10",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    badge: "HOT",
  },
  {
    id: "sales-grow",
    label: "Rapid Growth",
    description: "100%+ revenue growth rate",
    icon: Zap,
    gradient: "from-amber-500/10 via-orange-500/10 to-amber-500/10",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    badge: "TRENDING",
  },
]

interface QuickFiltersProps {
  selectedFilter: QuickFilterType
  onFilterChange: (filter: QuickFilterType) => void
  className?: string
}

export function QuickFilters({ selectedFilter, onFilterChange, className }: QuickFiltersProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {filters.map((filter) => {
        const Icon = filter.icon
        const isActive = selectedFilter === filter.id

        return (
          <Card
            key={filter.id}
            onClick={() => onFilterChange(isActive ? null : filter.id)}
            className={cn(
              "relative overflow-hidden cursor-pointer group",
              "",
              isActive 
                ? "ring-2 ring-primary shadow-lg scale-[1.02]" 
                : "hover:ring-1 hover:ring-border"
            )}
          >
            {/* Animated gradient background */}
            <div 
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300",
                isActive && "opacity-100",
                `bg-gradient-to-br ${filter.gradient}`
              )}
            />
            
            {/* Shimmer effect on active */}
            {isActive && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"
                style={{
                  backgroundSize: '200% 100%',
                }}
              />
            )}

            {/* Content */}
            <div className="relative p-5">
              <div className="flex items-start justify-between gap-4">
                {/* Icon with gradient background */}
                <div className={cn(
                  "relative flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center",
                  filter.iconBg,
                  isActive ? "scale-110 shadow-lg" : ""
                )}>
                  <Icon className="h-7 w-7 text-white" />
                  
                  {/* Active checkmark */}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-background animate-in zoom-in-50 duration-200">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Badge */}
                {filter.badge && (
                  <div className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                    isActive 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}>
                    {filter.badge}
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className="mt-4 space-y-1">
                <h3 className={cn(
                  "font-semibold text-base transition-colors duration-300",
                  isActive ? "text-foreground" : "text-foreground group-hover:text-primary"
                )}>
                  {filter.label}
                </h3>
                <p className={cn(
                  "text-xs transition-colors duration-300",
                  isActive ? "text-muted-foreground" : "text-muted-foreground/70 group-hover:text-muted-foreground"
                )}>
                  {filter.description}
                </p>
              </div>

              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary animate-in slide-in-from-left duration-300" />
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

