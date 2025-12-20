"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Package, Store, GraduationCap, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface DashboardStats {
  products: {
    total: number
    inPicklist: number
    winning: number
  }
  stores: {
    total: number
    connected: number
    active: number
  }
  learning: {
    progress: number
    completedVideos: number
    totalVideos: number
    enrolledCourses: number
  }
  activity: {
    lastActivityDate: string | null
    streakDays: number
  }
}

interface SummaryStatsCardsProps {
  stats: DashboardStats | null
  isLoading?: boolean
}

export function SummaryStatsCards({ stats, isLoading }: SummaryStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const cards = [
    {
      title: "Products in Picklist",
      value: stats.products.inPicklist || 0,
      subtitle: `${stats.products.total} total products available`,
      icon: Package,
      trend: null,
      color: "text-blue-600"
    },
    {
      title: "Connected Stores",
      value: stats.stores.connected,
      subtitle: `${stats.stores.active} active stores`,
      icon: Store,
      trend: null,
      color: "text-indigo-600"
    },
    {
      title: "Onboarding Progress",
      value: `${Math.round(stats.learning.progress)}%`,
      subtitle: `${stats.learning.completedVideos} of ${stats.learning.totalVideos} videos completed`,
      icon: GraduationCap,
      trend: stats.learning.progress > 0 ? "up" : null,
      color: "text-purple-600"
    },
    {
      title: "Courses Enrolled",
      value: stats.learning.enrolledCourses,
      subtitle: "Active learning courses",
      icon: Clock,
      trend: null,
      color: "text-pink-600"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card 
            key={index} 
            className="border-border/50"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
              <Icon className={cn("h-4 w-4", card.color)} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-semibold text-foreground">{card.value}</div>
                {card.trend && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    card.trend === "up" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                  )}>
                    {card.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{card.subtitle}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

