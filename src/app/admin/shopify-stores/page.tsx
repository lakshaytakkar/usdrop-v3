"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Users, RefreshCw, Link2, Trash2, Download, Copy, Check } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createShopifyStoresColumns } from "./components/shopify-stores-columns"
import { ShopifyStore, StoreProduct } from "@/app/shopify-stores/data/stores"
import { adminSampleStores } from "./data/stores"
import { getAllStoreProducts } from "./data/products"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { StoreDetailDrawer } from "./components/store-detail-drawer"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function AdminShopifyStoresPage() {
  const { showSuccess, showError, showInfo } = useToast()
  const [stores] = useState<ShopifyStore[]>(adminSampleStores)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [selectedStores, setSelectedStores] = useState<ShopifyStore[]>([])
  const [statusTab, setStatusTab] = useState<"all" | "connected" | "disconnected" | "syncing" | "error">("all")
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState<ShopifyStore | null>(null)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<ShopifyStore | null>(null)
  const [storeProducts, setStoreProducts] = useState<Record<string, StoreProduct[]>>({})
  const [assigneeModalOpen, setAssigneeModalOpen] = useState(false)

  // Load products for all stores
  useEffect(() => {
    const products = getAllStoreProducts(stores.map(s => s.id))
    setStoreProducts(products)
  }, [stores])

  // Calculate status counts
  const statusCounts = useMemo(() => {
    return {
      all: stores.length,
      connected: stores.filter(s => s.status === "connected").length,
      disconnected: stores.filter(s => s.status === "disconnected").length,
      syncing: stores.filter(s => s.status === "syncing").length,
      error: stores.filter(s => s.status === "error").length,
    }
  }, [stores])

  // Filter stores based on search, filters, status tab, and quick filter
  const filteredStores = useMemo(() => {
    let result = stores

    // Apply status tab filter
    if (statusTab !== "all") {
      result = result.filter(store => store.status === statusTab)
    }

    // Apply quick filters
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

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(searchLower) ||
          store.url.toLowerCase().includes(searchLower) ||
          store.user?.email.toLowerCase().includes(searchLower) ||
          store.niche?.toLowerCase().includes(searchLower)
      )
    }

    // Apply column filters
    filters.forEach((filter) => {
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
  }, [stores, search, filters, statusTab, quickFilter])

  // Paginate filtered stores
  const paginatedStores = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredStores.slice(start, end)
  }, [filteredStores, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredStores.length / pageSize))
    setInitialLoading(false)
  }, [filteredStores.length, pageSize])

  // Handlers
  const handleViewDetails = (store: ShopifyStore) => {
    setSelectedStore(store)
    setDetailDrawerOpen(true)
  }

  const handleRowClick = (store: ShopifyStore) => {
    handleViewDetails(store)
  }

  const handleEdit = (store: ShopifyStore) => {
    showInfo(`Editing ${store.name}`)
    // TODO: Open edit modal
  }

  const handleSync = async (store: ShopifyStore) => {
    setLoading(true)
    showInfo(`Syncing ${store.name}...`)
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    showSuccess(`${store.name} has been synced successfully`)
  }

  const handleAddProducts = (store: ShopifyStore) => {
    showInfo(`Adding products to ${store.name}`)
    // TODO: Open add products modal
  }

  const handleViewProducts = (store: ShopifyStore) => {
    handleViewDetails(store)
    // TODO: Switch to products tab in drawer
  }

  const handleDisconnect = async (store: ShopifyStore) => {
    showInfo(`Disconnecting ${store.name}...`)
    // TODO: Implement disconnect
  }

  const handleDelete = (store: ShopifyStore) => {
    setStoreToDelete(store)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!storeToDelete) return
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    setDeleteConfirmOpen(false)
    showSuccess(`${storeToDelete.name} has been deleted`)
    setStoreToDelete(null)
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

  // Bulk actions
  const handleBulkSync = async () => {
    if (selectedStores.length === 0) return
    setLoading(true)
    showInfo(`Syncing ${selectedStores.length} stores...`)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    setSelectedStores([])
    showSuccess(`${selectedStores.length} stores synced successfully`)
  }

  const handleBulkDisconnect = async () => {
    if (selectedStores.length === 0) return
    setLoading(true)
    showInfo(`Disconnecting ${selectedStores.length} stores...`)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setSelectedStores([])
    showSuccess(`${selectedStores.length} stores disconnected`)
  }

  const handleBulkDelete = () => {
    if (selectedStores.length === 0) return
    setStoreToDelete(selectedStores[0]) // For confirmation, but will delete all
    setDeleteConfirmOpen(true)
  }

  const handleBulkExport = () => {
    if (selectedStores.length === 0) return
    showInfo(`Exporting ${selectedStores.length} stores to CSV...`)
    // TODO: Implement CSV export
  }

  const columns = useMemo(
    () =>
      createShopifyStoresColumns({
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
      }),
    []
  )

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

  const quickFilters = [
    { id: "connected", label: "Connected" },
    { id: "high-revenue", label: "High Revenue" },
    { id: "high-traffic", label: "High Traffic" },
    { id: "recently-synced", label: "Recently Synced" },
    { id: "needs-sync", label: "Needs Sync", isWarning: true },
  ]

  const secondaryButtons: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link'
    disabled?: boolean
    tooltip?: string
  }> = []

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src="/shopify_glyph.svg"
              alt="Shopify"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Shopify Stores</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage connected Shopify stores
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAssigneeModalOpen(true)}
        >
          <Users className="h-4 w-4 mr-2" />
          Add Assignee
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="mb-4 flex-shrink-0">
        <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as typeof statusTab)}>
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {statusCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="connected">
              Connected
              <Badge variant="secondary" className="ml-2">
                {statusCounts.connected}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="disconnected">
              Disconnected
              <Badge variant="secondary" className="ml-2">
                {statusCounts.disconnected}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="syncing">
              Syncing
              <Badge variant="secondary" className="ml-2">
                {statusCounts.syncing}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="error">
              Error
              <Badge variant="secondary" className="ml-2">
                {statusCounts.error}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bulk Actions Bar */}
      {selectedStores.length > 0 && (
        <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between flex-shrink-0">
          <span className="text-sm font-medium">
            {selectedStores.length} store{selectedStores.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkSync}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDisconnect}
              disabled={loading}
            >
              <Link2 className="h-4 w-4 mr-2" />
              Disconnect Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedStores([])}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading stores...</div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedStores}
          pageCount={pageCount}
          onPaginationChange={(p, s) => {
            setPage(p)
            setPageSize(s)
          }}
          onSortingChange={setSorting}
          onFilterChange={setFilters}
          onSearchChange={setSearch}
          loading={loading}
          initialLoading={initialLoading}
          filterConfig={filterConfig}
          searchPlaceholder="Search stores, URLs, users, niches..."
          page={page}
          pageSize={pageSize}
          onAdd={() => {
            showInfo("Opening add store dialog...")
            // TODO: Open add store modal
          }}
          addButtonText="Add Store"
          addButtonIcon={<Plus className="h-4 w-4" />}
          secondaryButtons={secondaryButtons}
          enableRowSelection={true}
          onRowSelectionChange={setSelectedStores}
          onRowClick={handleRowClick}
          quickFilters={quickFilters}
          selectedQuickFilter={quickFilter}
          onQuickFilterChange={setQuickFilter}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Store{selectedStores.length > 1 ? "s" : ""}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStores.length > 1 ? `these ${selectedStores.length} stores` : "this Shopify store"}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {storeToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Store:</span> {storeToDelete.name}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Drawer */}
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

      {/* Assignee Modal - TODO: Implement full assignee management */}
      <Dialog open={assigneeModalOpen} onOpenChange={setAssigneeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Assignee</DialogTitle>
            <DialogDescription>
              Assign owner and members to selected stores
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Assignee management functionality will be implemented here.
              {selectedStores.length > 0 && (
                <span className="block mt-2">
                  {selectedStores.length} store{selectedStores.length !== 1 ? "s" : ""} selected
                </span>
              )}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigneeModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              showSuccess("Assignee management coming soon")
              setAssigneeModalOpen(false)
            }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
