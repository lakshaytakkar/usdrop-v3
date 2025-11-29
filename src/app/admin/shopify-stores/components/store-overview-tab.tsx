"use client"

import { ShopifyStore, StoreProduct } from "@/app/shopify-stores/data/stores"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  RefreshCw,
  Link2,
  Package,
  DollarSign,
  Users,
  Globe
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface StoreOverviewTabProps {
  store: ShopifyStore
  products: StoreProduct[]
  showApiKey: boolean
  showAccessToken: boolean
  onToggleApiKey: () => void
  onToggleAccessToken: () => void
  onSync?: (store: ShopifyStore) => void
  onDisconnect?: (store: ShopifyStore) => void
  onVisitStore?: (store: ShopifyStore) => void
}

export function StoreOverviewTab({
  store,
  products,
  showApiKey,
  showAccessToken,
  onToggleApiKey,
  onToggleAccessToken,
  onSync,
  onDisconnect,
  onVisitStore,
}: StoreOverviewTabProps) {
  const maskString = (str: string, visibleChars: number = 4) => {
    if (str.length <= visibleChars) return "•".repeat(str.length)
    return str.substring(0, visibleChars) + "•".repeat(str.length - visibleChars)
  }

  const formatCurrency = (amount: number | null, currency: string) => {
    if (amount === null) return "—"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number | null) => {
    if (num === null) return "—"
    return new Intl.NumberFormat("en-US").format(num)
  }

  const formatDate = (date: string | null) => {
    if (!date) return "Never"
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const statusConfig = {
    connected: { icon: CheckCircle2, label: "Connected", variant: "default" as const },
    disconnected: { icon: XCircle, label: "Disconnected", variant: "secondary" as const },
    syncing: { icon: Loader2, label: "Syncing", variant: "outline" as const },
    error: { icon: AlertCircle, label: "Error", variant: "destructive" as const },
  }

  const syncStatusConfig = {
    success: { icon: CheckCircle2, label: "Success", variant: "default" as const },
    failed: { icon: XCircle, label: "Failed", variant: "destructive" as const },
    pending: { icon: Loader2, label: "Pending", variant: "outline" as const },
    never: { icon: XCircle, label: "Never", variant: "secondary" as const },
  }

  const StatusIcon = statusConfig[store.status].icon
  const SyncStatusIcon = syncStatusConfig[store.sync_status].icon

  const fullUrl = store.url.startsWith("http") ? store.url : `https://${store.url}`

  return (
    <div className="space-y-4">
      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Store Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/shopify_glyph.svg"
                alt="Shopify"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{store.name}</h3>
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {store.url}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge
                variant={statusConfig[store.status].variant}
                className="gap-1"
              >
                <StatusIcon className={`h-3 w-3 ${store.status === "syncing" ? "animate-spin" : ""}`} />
                {statusConfig[store.status].label}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sync Status</p>
              <Badge
                variant={syncStatusConfig[store.sync_status].variant}
                className="gap-1"
              >
                <SyncStatusIcon className={`h-3 w-3 ${store.sync_status === "pending" ? "animate-spin" : ""}`} />
                {syncStatusConfig[store.sync_status].label}
              </Badge>
            </div>
          </div>

          {store.user && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Owner</p>
              <Link
                href={`/admin/external-users?userId=${store.user.id}`}
                className="text-sm text-primary hover:underline flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                {store.user.full_name || store.user.email}
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Niche</p>
              <p className="text-sm font-medium">{store.niche || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Country</p>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">{store.country || "—"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Plan</p>
              <Badge variant="outline" className="capitalize">
                {store.plan}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Currency</p>
              <p className="text-sm font-medium">{store.currency}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Products</p>
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4 text-muted-foreground" />
                <p className="text-lg font-semibold">{formatNumber(store.products_count)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Monthly Revenue</p>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <p className="text-lg font-semibold">
                  {formatCurrency(store.monthly_revenue, store.currency)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Monthly Traffic</p>
              <p className="text-lg font-semibold">{formatNumber(store.monthly_traffic)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Connection Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Connected At</p>
            <p className="text-sm font-medium">{formatDate(store.connected_at)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Last Synced</p>
            <p className="text-sm font-medium">{formatDate(store.last_synced_at)}</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">API Key</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={onToggleApiKey}
              >
                {showApiKey ? (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Show
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 font-mono">
                {showApiKey ? store.api_key : maskString(store.api_key)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => navigator.clipboard.writeText(store.api_key)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Access Token</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={onToggleAccessToken}
              >
                {showAccessToken ? (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Show
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 font-mono">
                {showAccessToken ? store.access_token : maskString(store.access_token)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => navigator.clipboard.writeText(store.access_token)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {onSync && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSync(store)}
                disabled={store.status === "syncing"}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${store.status === "syncing" ? "animate-spin" : ""}`} />
                Sync Now
              </Button>
            )}
            {onVisitStore && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVisitStore(store)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Store
              </Button>
            )}
            {onDisconnect && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDisconnect(store)}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

