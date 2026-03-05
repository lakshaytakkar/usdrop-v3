import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, ShoppingBag, CheckCircle2, AlertTriangle, Link2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  StatusBadge,
  EmptyState,
  type Column,
  type RowAction,
} from "@/components/admin-shared"

interface ShopifyStoreRow {
  id: string
  name: string
  url: string
  status: string
  products_count?: number
  connected_at?: string
  last_synced_at?: string
  user?: { email: string }
}

export default function AdminShopifyStoresPage() {
  const { showSuccess, showError, showInfo } = useToast()
  const [stores, setStores] = useState<ShopifyStoreRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/shopify-stores")
      if (!response.ok) throw new Error("Failed to fetch stores")
      const data = await response.json()
      setStores(data.stores || [])
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load stores")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { fetchStores() }, [fetchStores])

  const handleDisconnect = useCallback(async (store: ShopifyStoreRow) => {
    try {
      const response = await apiFetch(`/api/admin/shopify-stores/${store.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "disconnected" }),
      })
      if (!response.ok) throw new Error("Failed to disconnect store")
      showSuccess(`${store.name} disconnected`)
      fetchStores()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to disconnect store")
    }
  }, [fetchStores, showSuccess, showError])

  const connectedCount = stores.filter(s => s.status === "connected").length
  const disconnectedCount = stores.filter(s => s.status === "disconnected").length
  const errorCount = stores.filter(s => s.status === "error").length

  const columns: Column<ShopifyStoreRow>[] = [
    {
      key: "name",
      header: "Store Name",
      sortable: true,
      render: (s) => (
        <div>
          <span className="text-sm font-medium" data-testid={`text-name-${s.id}`}>{s.name}</span>
          {s.user?.email && <p className="text-xs text-muted-foreground">{s.user.email}</p>}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (s) => <StatusBadge status={s.status.charAt(0).toUpperCase() + s.status.slice(1)} />,
    },
    {
      key: "products_count",
      header: "Products",
      sortable: true,
      render: (s) => <span className="text-sm" data-testid={`text-products-${s.id}`}>{s.products_count ?? 0}</span>,
    },
    {
      key: "connected_at",
      header: "Connected Date",
      sortable: true,
      render: (s) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-connected-${s.id}`}>
          {s.connected_at ? format(new Date(s.connected_at), "MMM d, yyyy") : "\u2014"}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<ShopifyStoreRow>[] = [
    { label: "View Details", onClick: (s) => showInfo(`Viewing ${s.name}`) },
    { label: "Disconnect", onClick: handleDisconnect, variant: "destructive", separator: true },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Shopify Stores"
        subtitle="Monitor and manage client Shopify store connections"
        actions={
          <Button variant="outline" size="sm" onClick={fetchStores} disabled={loading} data-testid="button-refresh">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Stores" value={stores.length} icon={ShoppingBag} />
        <StatCard label="Connected" value={connectedCount} icon={CheckCircle2} trend={`${stores.length > 0 ? Math.round((connectedCount / stores.length) * 100) : 0}%`} />
        <StatCard label="Errors" value={errorCount} icon={AlertTriangle} />
        <StatCard label="Disconnected" value={disconnectedCount} icon={Link2} />
      </StatGrid>

      {!loading && stores.length === 0 ? (
        <EmptyState
          title="No Shopify stores"
          description="Shopify stores will appear here when clients connect them."
        />
      ) : (
        <DataTable
          data={stores}
          columns={columns}
          rowActions={rowActions}
          searchPlaceholder="Search stores..."
          isLoading={loading}
          emptyTitle="No stores found"
          emptyDescription="Try adjusting your search."
        />
      )}
    </PageShell>
  )
}
