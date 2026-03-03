import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Link } from "wouter"
import { cn } from "@/lib/utils"

interface Breadcrumb {
  label: string
  href?: string
}

interface ActionButton {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive"
  disabled?: boolean
}

interface AdminPageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Breadcrumb[]
  actions?: ActionButton[]
  children?: React.ReactNode
  className?: string
}

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground" data-testid="breadcrumb-nav">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold leading-[1.35] tracking-tight" data-testid="page-title">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5" data-testid="page-description">
              {description}
            </p>
          )}
        </div>
        {(actions || children) && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {children}
            {actions?.map((action, i) => (
              <Button
                key={i}
                variant={action.variant || "default"}
                size="sm"
                className="h-9"
                onClick={action.onClick}
                disabled={action.disabled}
                data-testid={`action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {action.icon && <span className="mr-1.5">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
