"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface BulkAction {
  id: string
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: "default" | "outline" | "destructive" | "ghost" | "secondary"
  disabled?: boolean
  tooltip?: string
}

interface BulkActionsBarProps {
  selectedCount: number
  actions: BulkAction[]
  onClearSelection: () => void
  className?: string
}

export function BulkActionsBar({ selectedCount, actions, onClearSelection, className }: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <Card className={cn("bg-primary/5 border-primary/20", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            {actions.map((action) => {
              const Icon = action.icon
              const button = (
                <Button
                  key={action.id}
                  variant={action.variant || "outline"}
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled}
                >
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {action.label}
                </Button>
              )

              return action.tooltip ? (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent>{action.tooltip}</TooltipContent>
                </Tooltip>
              ) : (
                button
              )
            })}
            <Button variant="ghost" size="sm" onClick={onClearSelection}>
              Clear Selection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

