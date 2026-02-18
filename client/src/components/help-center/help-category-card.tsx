

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface HelpCategoryCardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick?: () => void
  className?: string
}

export function HelpCategoryCard({
  title,
  description,
  icon: Icon,
  onClick,
  className,
}: HelpCategoryCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent/50 border-border bg-card shadow-sm",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="h-12 w-12 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-foreground" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-foreground leading-tight">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

