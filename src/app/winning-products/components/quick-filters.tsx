"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export type QuickFilterType = "top-new" | "high-potential" | "sales-grow" | null

interface QuickFilter {
  id: QuickFilterType
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const filters: QuickFilter[] = [
  {
    id: "top-new",
    label: "Top New Products",
    icon: Sparkles,
  },
  {
    id: "high-potential",
    label: "High Potential Affiliate",
    icon: TrendingUp,
  },
  {
    id: "sales-grow",
    label: "Sales Grow Rapidly",
    icon: Zap,
  },
]

interface QuickFiltersProps {
  selectedFilter: QuickFilterType
  onFilterChange: (filter: QuickFilterType) => void
  className?: string
}

export function QuickFilters({ selectedFilter, onFilterChange, className }: QuickFiltersProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => {
        const Icon = filter.icon
        const isActive = selectedFilter === filter.id

        return (
          <Button
            key={filter.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(isActive ? null : filter.id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 h-auto",
              isActive 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-background hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{filter.label}</span>
          </Button>
        )
      })}
    </div>
  )
}

