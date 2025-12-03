"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Filter {
  id: string
  label: string
  value: any
  type: "select" | "date" | "dateRange" | "number" | "numberRange" | "text"
}

interface FilterPanelProps {
  filters: Filter[]
  onFilterChange: (filterId: string, value: any) => void
  onClearAll: () => void
  className?: string
}

export function FilterPanel({ filters, onFilterChange, onClearAll, className }: FilterPanelProps) {
  const activeFilters = filters.filter((f) => {
    if (f.value === null || f.value === undefined || f.value === "") return false
    if (Array.isArray(f.value) && f.value.length === 0) return false
    if (typeof f.value === "object" && Object.keys(f.value).length === 0) return false
    return true
  })

  if (activeFilters.length === 0) return null

  const getFilterDisplayValue = (filter: Filter): string => {
    if (filter.type === "dateRange" && typeof filter.value === "object") {
      return `${filter.value.from || ""} - ${filter.value.to || ""}`
    }
    if (filter.type === "numberRange" && typeof filter.value === "object") {
      return `${filter.value.min || ""} - ${filter.value.max || ""}`
    }
    if (Array.isArray(filter.value)) {
      return filter.value.join(", ")
    }
    return String(filter.value)
  }

  return (
    <Card className={cn("bg-muted/50 border", className)}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Active Filters:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="outline"
              className="text-xs"
            >
              {filter.label}: {getFilterDisplayValue(filter)}
              <button
                onClick={() => onFilterChange(filter.id, filter.type === "select" ? "" : null)}
                className="ml-2 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-xs h-6"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
















