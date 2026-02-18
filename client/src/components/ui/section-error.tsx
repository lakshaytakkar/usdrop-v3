

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SectionErrorProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

/**
 * Localized, calm error state for a specific section or widget.
 * Intended to keep the page frame intact while a subsection fails.
 */
export function SectionError({
  title = "Something went wrong",
  description = "We’re having trouble loading this section. You can try again or continue using the rest of the page.",
  onRetry,
  className,
}: SectionErrorProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <div className="flex-1 space-y-1">
        <p className="font-medium leading-none">{title}</p>
        {description && (
          <p className="text-xs text-destructive/90">{description}</p>
        )}
        {onRetry && (
          <div className="pt-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={onRetry}
            >
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


