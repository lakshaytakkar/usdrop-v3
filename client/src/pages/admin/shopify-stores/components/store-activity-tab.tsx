

import { ShopifyStore } from "@/pages/shopify-stores/data/stores"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, RefreshCw, Package, AlertCircle } from "lucide-react"

interface StoreActivityTabProps {
  store: ShopifyStore
}

interface ActivityItem {
  id: string
  type: "sync" | "product_added" | "product_updated" | "error"
  message: string
  timestamp: string
  status: "success" | "failed" | "pending"
}

export function StoreActivityTab({ store }: StoreActivityTabProps) {
  // Generate sample activity data
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "sync",
      message: "Store sync completed successfully",
      timestamp: store.last_synced_at || store.connected_at,
      status: "success",
    },
    {
      id: "2",
      type: "product_added",
      message: "Added 15 new products",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "success",
    },
    {
      id: "3",
      type: "sync",
      message: "Store sync failed: API rate limit exceeded",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "failed",
    },
    {
      id: "4",
      type: "product_updated",
      message: "Updated 8 product prices",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "success",
    },
  ]

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getActivityIcon = (type: ActivityItem["type"], status: ActivityItem["status"]) => {
    if (status === "failed") return XCircle
    if (type === "sync") return RefreshCw
    if (type === "product_added" || type === "product_updated") return Package
    if (type === "error") return AlertCircle
    return CheckCircle2
  }

  const getActivityColor = (status: ActivityItem["status"]) => {
    if (status === "success") return "text-emerald-600"
    if (status === "failed") return "text-destructive"
    return "text-muted-foreground"
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-1">Recent Activity</h3>
        <p className="text-xs text-muted-foreground">
          Track sync activities, product changes, and errors
        </p>
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-1">No activity found</p>
            <p className="text-xs text-muted-foreground">
              Activity will appear here as the store is used
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type, activity.status)
            return (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${getActivityColor(activity.status)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <Badge
                          variant={activity.status === "success" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

