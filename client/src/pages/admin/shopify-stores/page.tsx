import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  RefreshCw,
  Link2,
  Trash2,
  Download,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createShopifyStoresColumns } from "./components/shopify-stores-columns"
import { AdminPageHeader, AdminStatCards, AdminFilterBar, AdminActionBar, AdminEmptyState } from "@/components/admin"
import { ShopifyStore, StoreProduct } from "@/pages/shopify-stores/data/stores"
import { getAllStoreProducts } from "./data/products"
import { StoreDetailDrawer } from "./components/store-detail-drawer"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"

export default function AdminShopifyStoresPage() {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()

  const { hasPermission: canView } = useHasPermission("shopify-stores.view")
  const { hasPermission: canEdit } = useHasPermission("shopify-stores.edit")
  const { hasPermission: canCreate } = useHasPermission("shopify-stores.create")
  const { hasPermission: canDelete } = useHasPermission("shopify-stores.delete")

  const [stores, setStores] = useState<ShopifyStore[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStores, setSelectedStores] = useState<ShopifyStore[]>([])
  const [statusTab, setStatusTab] = useState("all")
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState<ShopifyStore | null>(null)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<ShopifyStore | null>(null)
  const [storeProducts, setStoreProducts] = useState<Record<string, StoreProduct[]>>({})
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (statusTab !== "all") {
        params.append("status", statusTab)
      }
      if (searchQuery) {
        params.append("search", searchQuery)
      }
      params.append("page", page.toString())
      params.append("pageSize", pageSize.toString())

      const response = await apiFetch(`/api/admin/shopify-stores?${params.toString()}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch stores")
      }

      const data = await response.json()
      const storesData: ShopifyStore[] = data.stores || []

      setStores(storesData)
      setPageCount(data.totalPages || 0)
    } catch (err) {
      console.error("Error fetching stores:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load stores."
      setError(errorMessage)
      if (!initialLoading) {
        showError(errorMessage)
      }
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [statusTab, searchQuery, page, pageSize, initialLoading, showError])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  useEffect(() => {
    const products = getAllStoreProducts(stores.map(s => s.id))
    setStoreProducts(products)
  }, [stores])

  const statusCounts = useMemo(() => {
    return {
      all: stores.length,
      connected: stores.filter(s => s.status === "connected").length,
      disconnected: stores.filter(s => s.status === "disconnected").length,
      syncing: stores.filter(s => s.status === "syncing").length,
      error: stores.filter(s => s.status === "error").length,
    }
  }, [stores])

  const filteredStores = useMemo(() => {
    let result = stores

    if (statusTab !== "all") {
      result = result.filter(store => store.status === statusTab)
    }

    if (quickFilter) {
      switch (quickFilter) {
        case "connected":
          result = result.filter(s => s.status === "connected")
          break
        case "high-revenue":
          result = result.filter(s => (s.monthly_revenue || 0) > 50000)
          break
        case "high-traffic":
          result = result.filter(s => (s.monthly_traffic || 0) > 10000)
          break
        case "recently-synced":
          result = result.filter(s => {
            if (!s.last_synced_at) return false
            const lastSync = new Date(s.last_synced_at)
            const now = new Date()
            const daysDiff = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60 * 24)
            return daysDiff <= 7
          })
          break
        case "needs-sync":
          result = result.filter(s => {
            if (!s.last_synced_at) return true
            const lastSync = new Date(s.last_synced_at)
            const now = new Date()
            const daysDiff = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60 * 24)
            return daysDiff > 7
          })
          break
      }
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(searchLower) ||
          store.url.toLowerCase().includes(searchLower) ||
          store.user?.email.toLowerCase().includes(searchLower) ||
          store.niche?.toLowerCase().includes(searchLower)
      )
    }

    columnFilters.forEach((filter) => {
      if (filter.id === "status" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        result = result.filter((store) => filterValues.includes(store.status))
      }
      if (filter.id === "sync_status" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        result = result.filter((store) => filterValues.includes(store.sync_status))
      }
    })

    return result
  }, [stores, searchQuery, columnFilters, statusTab, quickFilter])

  const statCards = useMemo(() => [
    {
      label: "Total Stores",
      value: stores.length,
      icon: ShoppingBag,
      description: "All Shopify stores",
    },
    {
      label: "Connected",
      value: statusCounts.connected,
      icon: CheckCircle2,
      badge: stores.length > 0 ? `${Math.round((statusCounts.connected / stores.length) * 100)}%` : "0%",
      badgeVariant: "success" as const,
      description: "Currently active",
    },
    {
      label: "Syncing / Errors",
      value: statusCounts.syncing + statusCounts.error,
      icon: statusCounts.error > 0 ? AlertTriangle : Loader2,
      badge: statusCounts.error > 0 ? `${statusCounts.error} errors` : undefined,
      badgeVariant: statusCounts.error > 0 ? "danger" as const : "info" as const,
      description: "Require attention",
    },
    {
      label: "Disconnected",
      value: statusCounts.disconnected,
      icon: Link2,
      description: "Not currently linked",
    },
  ], [stores.length, statusCounts])

  const statusTabs = useMemo(() => [
    { value: "all", label: "All", count: statusCounts.all },
    { value: "connected", label: "Connected", count: statusCounts.connected },
    { value: "disconnected", label: "Disconnected", count: statusCounts.disconnected },
    { value: "syncing", label: "Syncing", count: statusCounts.syncing },
    { value: "error", label: "Error", count: statusCounts.error },
  ], [statusCounts])

  const quickFilters = useMemo(() => [
    { id: "connected", label: "Connected", count: statusCounts.connected },
    { id: "high-revenue", label: "High Revenue", count: stores.filter(s => (s.monthly_revenue || 0) > 50000).length },
    { id: "high-traffic", label: "High Traffic", count: stores.filter(s => (s.monthly_traffic || 0) > 10000).length },
    { id: "recently-synced", label: "Recently Synced", count: 0 },
    { id: "needs-sync", label: "Needs Sync", count: 0 },
  ], [statusCounts, stores])

  const filterConfig = [
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Connected", value: "connected" },
        { label: "Disconnected", value: "disconnected" },
        { label: "Syncing", value: "syncing" },
        { label: "Error", value: "error" },
      ],
    },
    {
      columnId: "sync_status",
      title: "Sync Status",
      options: [
        { label: "Success", value: "success" },
        { label: "Failed", value: "failed" },
        { label: "Pending", value: "pending" },
        { label: "Never", value: "never" },
      ],
    },
  ]

  const handleViewDetails = (store: ShopifyStore) => {
    setSelectedStore(store)
    setDetailDrawerOpen(true)
  }

  const handleEdit = (store: ShopifyStore) => {
    showInfo(`Editing ${store.name}`)
  }

  const handleSync = async (store: ShopifyStore) => {
    try {
      setLoading(true)
      showInfo(`Syncing ${store.name}...`)

      const response = await apiFetch(`/api/shopify-stores/${store.id}/sync`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to sync store')
      }

      showSuccess(`${store.name} has been synced successfully`)
      await fetchStores()
    } catch (err) {
      console.error("Error syncing store:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to sync store"
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProducts = (store: ShopifyStore) => {
    showInfo(`Adding products to ${store.name}`)
  }

  const handleViewProducts = (store: ShopifyStore) => {
    handleViewDetails(store)
  }

  const handleDisconnect = async (store: ShopifyStore) => {
    try {
      setLoading(true)
      showInfo(`Disconnecting ${store.name}...`)

      const response = await apiFetch(`/api/admin/shopify-stores/${store.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'disconnected' }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to disconnect store')
      }

      showSuccess(`${store.name} has been disconnected`)
      await fetchStores()
    } catch (err) {
      console.error("Error disconnecting store:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to disconnect store"
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (store: ShopifyStore) => {
    setStoreToDelete(store)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!storeToDelete) return

    try {
      setLoading(true)

      const storesToDelete = selectedStores.length > 0 ? selectedStores : [storeToDelete]

      for (const store of storesToDelete) {
        const response = await apiFetch(`/api/admin/shopify-stores/${store.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to delete ${store.name}`)
        }
      }

      setDeleteConfirmOpen(false)
      setStoreToDelete(null)
      setSelectedStores([])
      showSuccess(`${storesToDelete.length} store${storesToDelete.length !== 1 ? 's' : ''} deleted successfully`)
      await fetchStores()
    } catch (err) {
      console.error("Error deleting store:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to delete store"
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyStoreId = (store: ShopifyStore) => {
    navigator.clipboard.writeText(store.id)
    showSuccess("Store ID copied to clipboard")
  }

  const handleCopyUrl = (store: ShopifyStore) => {
    navigator.clipboard.writeText(store.url)
    showSuccess("Store URL copied to clipboard")
  }

  const handleVisitStore = (store: ShopifyStore) => {
    const url = store.url.startsWith("http") ? store.url : `https://${store.url}`
    window.open(url, "_blank")
  }

  const handleBulkSync = async () => {
    if (selectedStores.length === 0) return

    try {
      setBulkActionLoading("sync")
      showInfo(`Syncing ${selectedStores.length} stores...`)

      const syncPromises = selectedStores.map(store =>
        apiFetch(`/api/shopify-stores/${store.id}/sync`, { method: 'POST' })
      )
      await Promise.all(syncPromises)

      setSelectedStores([])
      showSuccess(`${selectedStores.length} stores synced successfully`)
      await fetchStores()
    } catch (err) {
      console.error("Error syncing stores:", err)
      showError("Failed to sync some stores")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkDisconnect = async () => {
    if (selectedStores.length === 0) return

    try {
      setBulkActionLoading("disconnect")
      showInfo(`Disconnecting ${selectedStores.length} stores...`)

      const disconnectPromises = selectedStores.map(store =>
        apiFetch(`/api/admin/shopify-stores/${store.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'disconnected' }),
        })
      )
      await Promise.all(disconnectPromises)

      setSelectedStores([])
      showSuccess(`${selectedStores.length} stores disconnected`)
      await fetchStores()
    } catch (err) {
      console.error("Error disconnecting stores:", err)
      showError("Failed to disconnect some stores")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkDelete = () => {
    if (selectedStores.length === 0) return
    setStoreToDelete(selectedStores[0])
    setDeleteConfirmOpen(true)
  }

  const handleBulkExport = () => {
    if (selectedStores.length === 0) return
    showInfo(`Exporting ${selectedStores.length} stores to CSV...`)
  }

  const columns = useMemo(() => createShopifyStoresColumns({
    onViewDetails: handleViewDetails,
    onEdit: handleEdit,
    onSync: handleSync,
    onAddProducts: handleAddProducts,
    onViewProducts: handleViewProducts,
    onDisconnect: handleDisconnect,
    onDelete: handleDelete,
    onCopyStoreId: handleCopyStoreId,
    onCopyUrl: handleCopyUrl,
    onVisitStore: handleVisitStore,
  }), [])

  const bulkActions = [
    {
      label: "Sync Selected",
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: handleBulkSync,
      variant: "outline" as const,
      loading: bulkActionLoading === "sync",
      disabled: bulkActionLoading !== null,
    },
    {
      label: "Disconnect",
      icon: <Link2 className="h-4 w-4" />,
      onClick: handleBulkDisconnect,
      variant: "outline" as const,
      loading: bulkActionLoading === "disconnect",
      disabled: bulkActionLoading !== null,
    },
    {
      label: "Export CSV",
      icon: <Download className="h-4 w-4" />,
      onClick: handleBulkExport,
      variant: "outline" as const,
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleBulkDelete,
      variant: "destructive" as const,
    },
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden gap-4" data-testid="admin-shopify-stores-page">
      <AdminPageHeader
        title="Shopify Stores"
        description="Monitor and manage client Shopify store connections"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Shopify Stores" },
        ]}
        actions={[
          {
            label: "Refresh",
            icon: <RefreshCw className="h-4 w-4" />,
            onClick: fetchStores,
            variant: "outline",
            disabled: loading,
          },
          ...(canCreate ? [{
            label: "Connect Store",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => showInfo("Connect store flow coming soon"),
          }] : []),
        ]}
      />

      <AdminStatCards
        stats={statCards}
        loading={initialLoading}
        columns={4}
      />

      <AdminActionBar
        selectedCount={selectedStores.length}
        onClearSelection={() => setSelectedStores([])}
        actions={bulkActions}
      />

      <AdminFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search stores, URLs, owners..."
        tabs={statusTabs}
        activeTab={statusTab}
        onTabChange={setStatusTab}
      />

      <div className="flex-1 min-h-0 flex flex-col">
        <DataTable
          columns={columns}
          data={filteredStores}
          pageCount={pageCount || Math.ceil(filteredStores.length / pageSize)}
          onPaginationChange={(newPage, newPageSize) => {
            setPage(newPage)
            setPageSize(newPageSize)
          }}
          onSortingChange={setSorting}
          onFilterChange={setColumnFilters}
          onSearchChange={setSearchQuery}
          loading={loading && !initialLoading}
          initialLoading={initialLoading}
          page={page}
          pageSize={pageSize}
          searchPlaceholder="Search stores..."
          enableRowSelection={true}
          onRowSelectionChange={(rows) => setSelectedStores(rows as ShopifyStore[])}
          onRowClick={handleViewDetails}
          filterConfig={filterConfig}
          quickFilters={quickFilters}
          selectedQuickFilter={quickFilter}
          onQuickFilterChange={setQuickFilter}
        />
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle data-testid="delete-dialog-title">
              Delete Store{selectedStores.length > 1 ? "s" : ""}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStores.length > 1 ? `these ${selectedStores.length} stores` : "this Shopify store"}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {storeToDelete && (
            <div className="space-y-2">
              <p className="text-sm" data-testid="delete-store-name">
                <span className="font-medium">Store:</span> {storeToDelete.name}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              data-testid="button-cancel-delete"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={loading}
              data-testid="button-confirm-delete"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedStore && (
        <StoreDetailDrawer
          open={detailDrawerOpen}
          onOpenChange={setDetailDrawerOpen}
          store={selectedStore}
          products={storeProducts[selectedStore.id] || []}
          onSync={handleSync}
          onDisconnect={handleDisconnect}
          onVisitStore={handleVisitStore}
          onAddProducts={handleAddProducts}
          onEdit={handleEdit}
        />
      )}
    </div>
  )
}
