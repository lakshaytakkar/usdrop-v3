import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TabItem {
  value: string
  label: string
  count?: number
}

interface AdminFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  tabs?: TabItem[]
  activeTab?: string
  onTabChange?: (value: string) => void
  children?: React.ReactNode
  className?: string
}

export function AdminFilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  tabs,
  activeTab,
  onTabChange,
  children,
  className,
}: AdminFilterBarProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {tabs && tabs.length > 0 && onTabChange && (
        <Tabs value={activeTab || tabs[0].value} onValueChange={onTabChange}>
          <TabsList className="h-9 bg-muted/50 p-0.5">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="h-8 px-3 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                data-testid={`filter-tab-${tab.value}`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px] font-medium">
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pl-9 pr-8"
            data-testid="search-input"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => onSearchChange("")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
