


import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Edit, MoreVertical, RefreshCw, Link2, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react"
import { ShopifyStore } from "@/pages/shopify-stores/data/stores"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

interface AdminShopifyStoreCardProps {
  store: ShopifyStore
  onEdit?: (store: ShopifyStore) => void
  onViewDetails?: (store: ShopifyStore) => void
  onSync?: (store: ShopifyStore) => void
  onDelete?: (store: ShopifyStore) => void
  canEdit?: boolean
  canDelete?: boolean
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const getStatusBadge = (status: string) => {
  switch (status) {
    case "connected":
      return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Connected</Badge>
    case "disconnected":
      return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Disconnected</Badge>
    case "syncing":
      return <Badge className="bg-blue-600"><Clock className="h-3 w-3 mr-1" />Syncing</Badge>
    case "error":
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function AdminShopifyStoreCard({
  store,
  onEdit,
  onViewDetails,
  onSync,
  onDelete,
  canEdit = true,
  canDelete = true,
}: AdminShopifyStoreCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="relative w-full aspect-square overflow-hidden rounded-t-xl">
        {store.logo ? (
          <img
            src={store.logo}
            alt={store.name}
           
            className="object-cover"
           
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(store)}>
                  View Details
                </DropdownMenuItem>
              )}
              {onSync && (
                <DropdownMenuItem onClick={() => onSync(store)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </DropdownMenuItem>
              )}
              {canEdit && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(store)}>
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(store)} className="text-destructive">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute top-2 left-2">
          {getStatusBadge(store.status)}
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold mb-1 line-clamp-2">{store.name}</h3>
          {store.url && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Link2 className="h-3 w-3" />
              <span>{store.url}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t">
          {store.monthly_revenue && (
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Revenue</span>
              <span className="font-semibold">{currencyFormatter.format(store.monthly_revenue)}</span>
            </div>
          )}
          {store.monthly_traffic && (
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Traffic</span>
              <span className="font-semibold">{numberFormatter.format(store.monthly_traffic)}</span>
            </div>
          )}
          {store.last_synced_at && (
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Last Sync</span>
              <span className="font-semibold">{format(new Date(store.last_synced_at), "MMM d")}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        {onSync && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onSync(store)}
            disabled={store.status === "syncing"}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
        )}
        {onViewDetails && (
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onViewDetails(store)}
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

