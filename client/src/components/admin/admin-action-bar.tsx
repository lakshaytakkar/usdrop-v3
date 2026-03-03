import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BulkAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "outline" | "ghost" | "destructive"
  disabled?: boolean
  loading?: boolean
}

interface AdminActionBarProps {
  selectedCount: number
  onClearSelection: () => void
  actions: BulkAction[]
  className?: string
}

export function AdminActionBar({ selectedCount, onClearSelection, actions, className }: AdminActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-lg",
        className
      )}
      data-testid="bulk-action-bar"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-primary">
          {selectedCount} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
          onClick={onClearSelection}
          data-testid="clear-selection"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {actions.map((action, i) => (
          <Button
            key={i}
            variant={action.variant || "outline"}
            size="sm"
            className="h-8"
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            data-testid={`bulk-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {action.icon && <span className="mr-1.5">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
