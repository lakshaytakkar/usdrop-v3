"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateAction {
  label: string
  onClick: () => void
}

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  className?: string
}

/**
 * Generic empty/zero-data state component.
 * Follows the design rules from docs/design/EMPTY_STATES.md
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 text-4xl text-muted-foreground">{icon}</div>
      )}

      <h3 className="mb-1 text-lg font-semibold">{title}</h3>

      {description && (
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}

      {secondaryAction && (
        <Button
          variant="link"
          onClick={secondaryAction.onClick}
          className="mt-2"
        >
          {secondaryAction.label}
        </Button>
      )}
    </div>
  )
}


