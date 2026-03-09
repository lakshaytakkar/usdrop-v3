import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useParams } from "wouter"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, RefreshCw, Package, ShoppingCart, Store } from "lucide-react"
import { BlueSpinner, ButtonSpinner } from "@/components/ui/blue-spinner"
import { useToast } from "@/hooks/use-toast"
import { ShopifyStore } from "../data/stores"
import { StoreProducts } from "./components/store-products"
import { StoreOrders } from "./components/store-orders"
import { StoreOverview } from "./components/store-overview"

export default function StoreDetailPage() {
  const params = useParams<{ id: string }>()
  const storeId = params.id
  const { showSuccess, showError } = useToast()
  const [store, setStore] = useState<ShopifyStore | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchStore = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch(`/api/shopify-stores/${storeId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch store')
      }
      const data = await response.json()
      setStore(data)
    } catch {
      setStore(null)
      showError('Failed to load store details')
    } finally {
      setLoading(false)
    }
  }, [storeId, showError])

  useEffect(() => {
    fetchStore()
  }, [fetchStore])

  const handleSync = async () => {
    try {
      setSyncing(true)
      const response = await apiFetch(`/api/shopify-stores/${storeId}/sync`, {
        method: 'POST',
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to sync store')
      }
      const result = await response.json()
      showSuccess(`Synced ${result.products_synced} products and ${result.orders_synced} orders`)
      setRefreshKey(k => k + 1)
      fetchStore()
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2">
        <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
          <BlueSpinner size="lg" label="Loading store..." />
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-6">
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">Store not found</h2>
          <Link href="/framework/my-store">
            <Button variant="outline" data-testid="button-back-stores">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Store
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2">
      <div className="flex items-center gap-3 mb-1">
        <Link href="/framework/my-store">
          <Button variant="ghost" size="sm" data-testid="button-back-stores">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 flex h-14 w-14 flex-none items-center justify-center rounded-xl">
            <Store className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-store-name">{store.name}</h1>
            <p className="text-sm text-muted-foreground" data-testid="text-store-domain">{store.url}</p>
          </div>
        </div>
        {store.status === "connected" && (
          <Button
            onClick={handleSync}
            disabled={syncing}
            data-testid="button-sync-store"
          >
            {syncing ? (
              <>
                <ButtonSpinner />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>
        )}
      </div>

      <Tabs defaultValue="overview" className="mt-2">
        <TabsList data-testid="tabs-store-detail">
          <TabsTrigger value="overview" data-testid="tab-overview">
            <Store className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="products" data-testid="tab-products">
            <Package className="h-4 w-4 mr-2" />
            Products ({store.products_count || 0})
          </TabsTrigger>
          <TabsTrigger value="orders" data-testid="tab-orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders ({store.orders_count || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <StoreOverview store={store} onSync={handleSync} syncing={syncing} />
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <StoreProducts storeId={storeId!} key={`products-${refreshKey}`} />
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <StoreOrders storeId={storeId!} key={`orders-${refreshKey}`} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
