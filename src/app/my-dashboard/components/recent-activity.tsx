"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { 
  Video, 
  Package, 
  Store, 
  GraduationCap,
  Clock
} from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  type: "video" | "product" | "store" | "course"
  title: string
  description?: string
  timestamp: Date
  href: string
}

interface RecentActivityProps {
  activities?: ActivityItem[]
  isLoading?: boolean
}

// Generate sample activities if none provided
function generateSampleActivities(): ActivityItem[] {
  const now = new Date()
  return [
    {
      id: "1",
      type: "video",
      title: "Completed: Getting Started with Dropshipping",
      description: "Onboarding Module 1",
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      href: "/my-dashboard"
    },
    {
      id: "2",
      type: "product",
      title: "Added product to picklist",
      description: "Wireless Earbuds Pro",
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
      href: "/my-products"
    },
    {
      id: "3",
      type: "store",
      title: "Connected Shopify store",
      description: "My Store",
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      href: "/my-shopify-stores"
    },
    {
      id: "4",
      type: "course",
      title: "Enrolled in course",
      description: "Advanced Marketing Strategies",
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      href: "/academy"
    }
  ]
}

function getActivityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "video":
      return Video
    case "product":
      return Package
    case "store":
      return Store
    case "course":
      return GraduationCap
    default:
      return Clock
  }
}

function getActivityColor(type: ActivityItem["type"]) {
  switch (type) {
    case "video":
      return "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
    case "product":
      return "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
    case "store":
      return "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
    case "course":
      return "text-pink-600 bg-pink-50 dark:bg-pink-900/20"
    default:
      return "text-muted-foreground bg-muted"
  }
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  const displayActivities = activities && activities.length > 0 
    ? activities.slice(0, 4)
    : generateSampleActivities().slice(0, 4)

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg text-foreground">Recent Activity</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {displayActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            const colorClass = getActivityColor(activity.type)
            
            return (
              <Link
                key={activity.id}
                href={activity.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className={cn("p-2.5 rounded-full shrink-0", colorClass)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                      {activity.title}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                  {activity.description && (
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {activity.description}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

