import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Inbox } from "lucide-react"

interface AdminEmptyStateProps {
  icon?: React.ElementType
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function AdminEmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: AdminEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)} data-testid="empty-state">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} data-testid="empty-state-action">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
