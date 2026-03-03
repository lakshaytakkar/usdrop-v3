import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface StatCardData {
  label: string
  value: string | number
  icon: React.ElementType
  badge?: string
  badgeVariant?: "success" | "warning" | "danger" | "info"
  description?: string
  onClick?: () => void
}

interface AdminStatCardsProps {
  stats: StatCardData[]
  loading?: boolean
  columns?: 2 | 3 | 4 | 5
}

const badgeColors = {
  success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  warning: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  danger: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  info: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
}

const gridCols = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
}

function StatCardSkeleton() {
  return (
    <div className="bg-card border rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between w-full">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="w-9 h-9 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

export function AdminStatCards({ stats, loading = false, columns = 4 }: AdminStatCardsProps) {
  if (loading) {
    return (
      <div className={cn("grid gap-4", gridCols[columns])}>
        {Array.from({ length: columns }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("grid gap-4", gridCols[columns])}>
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <div
            key={i}
            className={cn(
              "bg-card border rounded-lg p-4 flex flex-col gap-2",
              stat.onClick && "cursor-pointer hover:border-primary/30 transition-colors"
            )}
            onClick={stat.onClick}
            data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="flex items-center justify-between w-full">
              <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
              <div className="w-9 h-9 bg-primary/5 border rounded-lg flex items-center justify-center">
                <Icon className="h-[18px] w-[18px] text-primary" />
              </div>
            </div>
            <p className="text-foreground text-2xl font-semibold tracking-tight">
              {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
            </p>
            {(stat.badge || stat.description) && (
              <div className="flex items-center gap-2">
                {stat.badge && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-xs font-medium",
                    badgeColors[stat.badgeVariant || "success"]
                  )}>
                    {stat.badge}
                  </span>
                )}
                {stat.description && (
                  <p className="text-muted-foreground text-sm">{stat.description}</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
