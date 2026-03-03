import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react"
import { useRouter } from "@/hooks/use-router"
import { cn } from "@/lib/utils"

interface HeaderAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "destructive"
  separator?: boolean
  disabled?: boolean
}

interface TabConfig {
  value: string
  label: string
  icon?: React.ReactNode
  count?: number
  content: React.ReactNode
}

interface AdminDetailLayoutProps {
  backHref: string
  backLabel?: string
  title: string
  subtitle?: string
  avatarUrl?: string
  avatarFallback?: string
  badges?: React.ReactNode[]
  actions?: HeaderAction[]
  primaryActions?: React.ReactNode
  tabs: TabConfig[]
  defaultTab?: string
  loading?: boolean
  onPrev?: () => void
  onNext?: () => void
  hasPrev?: boolean
  hasNext?: boolean
  className?: string
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    </div>
  )
}

export function AdminDetailLayout({
  backHref,
  backLabel = "Back",
  title,
  subtitle,
  avatarUrl,
  avatarFallback,
  badges,
  actions,
  primaryActions,
  tabs,
  defaultTab,
  loading = false,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  className,
}: AdminDetailLayoutProps) {
  const router = useRouter()

  if (loading) {
    return <DetailSkeleton />
  }

  const initials = avatarFallback || title
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={cn("flex flex-col gap-6 p-6", className)}>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-muted-foreground hover:text-foreground gap-1.5"
          onClick={() => router.push(backHref)}
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Button>
        {(onPrev || onNext) && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onPrev}
              disabled={!hasPrev}
              data-testid="prev-button"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onNext}
              disabled={!hasNext}
              data-testid="next-button"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {(avatarUrl || avatarFallback || title) && (
            <Avatar className="h-14 w-14 border">
              <AvatarImage src={avatarUrl} alt={title} />
              <AvatarFallback className="text-lg font-semibold bg-primary/5 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold tracking-tight" data-testid="detail-title">
                {title}
              </h1>
              {badges?.map((badge, i) => (
                <span key={i}>{badge}</span>
              ))}
            </div>
            {subtitle && (
              <p className="text-sm text-muted-foreground" data-testid="detail-subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {primaryActions}
          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0" data-testid="actions-dropdown">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {actions.map((action, i) => (
                  <span key={i}>
                    {action.separator && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      onClick={action.onClick}
                      disabled={action.disabled}
                      className={cn(
                        "cursor-pointer",
                        action.variant === "destructive" && "text-destructive focus:text-destructive"
                      )}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </DropdownMenuItem>
                  </span>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <Tabs defaultValue={defaultTab || tabs[0]?.value} className="w-full">
        <TabsList className="h-10 w-full justify-start bg-transparent border-b rounded-none p-0 gap-0">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent"
              data-testid={`tab-${tab.value}`}
            >
              {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px] font-medium">
                  {tab.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
