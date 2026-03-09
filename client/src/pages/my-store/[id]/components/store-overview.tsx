import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Package, ShoppingCart, Clock, Globe } from "lucide-react"
import { ShopifyStore } from "../../data/stores"

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface StoreOverviewProps {
  store: ShopifyStore
  onSync: () => void
  syncing: boolean
}

export function StoreOverview({ store }: StoreOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {store.status === "connected" ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-lg font-semibold text-emerald-600" data-testid="text-overview-status">Connected</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="text-lg font-semibold text-destructive" data-testid="text-overview-status">Disconnected</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold" data-testid="text-overview-products">{store.products_count || 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-violet-500" />
            <span className="text-2xl font-bold" data-testid="text-overview-orders">{store.orders_count || 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="text-sm capitalize" data-testid="text-overview-plan">
            {store.plan || 'basic'}
          </Badge>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Store Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" /> Domain
              </span>
              <span className="text-sm font-medium" data-testid="text-overview-domain">{store.url}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Currency</span>
              <span className="text-sm font-medium">{store.currency || 'USD'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connected</span>
              <span className="text-sm font-medium">{store.connected_at ? formatDate(store.connected_at) : 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Sync Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> Last Synced
              </span>
              <span className="text-sm font-medium" data-testid="text-overview-last-sync">
                {store.last_synced_at ? formatDate(store.last_synced_at) : 'Never synced'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sync Status</span>
              <Badge
                variant={store.sync_status === 'success' ? 'default' : store.sync_status === 'failed' ? 'destructive' : 'secondary'}
                data-testid="text-overview-sync-status"
              >
                {store.sync_status === 'never' ? 'Not synced' : store.sync_status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
