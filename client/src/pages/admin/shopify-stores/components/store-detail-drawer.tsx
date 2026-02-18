

import { useState } from "react"
import { DetailDrawer } from "@/components/ui/detail-drawer"
import { ShopifyStore, StoreProduct } from "@/pages/shopify-stores/data/stores"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Link2, 
  Eye, 
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Plus,
  Package
} from "lucide-react"

import { StoreOverviewTab } from "./store-overview-tab"
import { StoreProductsTab } from "./store-products-tab"
import { StoreActivityTab } from "./store-activity-tab"
import { StoreSettingsTab } from "./store-settings-tab"

interface StoreDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: ShopifyStore | null
  products?: StoreProduct[]
  onSync?: (store: ShopifyStore) => void
  onDisconnect?: (store: ShopifyStore) => void
  onVisitStore?: (store: ShopifyStore) => void
  onAddProducts?: (store: ShopifyStore) => void
  onEdit?: (store: ShopifyStore) => void
}

export function StoreDetailDrawer({
  open,
  onOpenChange,
  store,
  products = [],
  onSync,
  onDisconnect,
  onVisitStore,
  onAddProducts,
  onEdit,
}: StoreDetailDrawerProps) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [showAccessToken, setShowAccessToken] = useState(false)

  if (!store) return null

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

  const headerActions = (
    <div className="flex items-center gap-2">
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
  )

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      content: (
        <StoreOverviewTab
          store={store}
          products={products}
          showApiKey={showApiKey}
          showAccessToken={showAccessToken}
          onToggleApiKey={() => setShowApiKey(!showApiKey)}
          onToggleAccessToken={() => setShowAccessToken(!showAccessToken)}
          onSync={onSync}
          onDisconnect={onDisconnect}
          onVisitStore={onVisitStore}
        />
      ),
    },
    {
      value: "products",
      label: "Products",
      content: (
        <StoreProductsTab
          store={store}
          products={products}
          onAddProducts={onAddProducts}
        />
      ),
    },
    {
      value: "activity",
      label: "Activity",
      content: <StoreActivityTab store={store} />,
    },
    {
      value: "settings",
      label: "Settings",
      content: (
        <StoreSettingsTab
          store={store}
          onEdit={onEdit}
        />
      ),
    },
  ]

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={store.name}
      tabs={tabs}
      defaultTab="overview"
      headerActions={headerActions}
    />
  )
}

