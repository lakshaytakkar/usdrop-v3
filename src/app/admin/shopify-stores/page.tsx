"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Users, RefreshCw, Link2, Trash2, Download, Copy, Check, ShoppingBag, Filter, X } from "lucide-react"
import { AdminShopifyStoreCard } from "./components/admin-shopify-store-card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Loader } from "@/components/ui/loader"
import { ShopifyStore, StoreProduct } from "@/app/shopify-stores/data/stores"
import { getAllStoreProducts } from "./data/products"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { StoreDetailDrawer } from "./components/store-detail-drawer"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function AdminShopifyStoresPage() {
  const { showSuccess, showError, showInfo } = useToast()
  const [stores, setStores] = useState<ShopifyStore[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  // Fetch stores from API
  const fetchStores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (statusTab !== "all") {
        params.append("status", statusTab)
      }
      if (search) {
        params.append("search", search)
      }
      params.append("page", page.toString())
      params.append("pageSize", pageSize.toString())
      
      const response = await fetch(`/api/admin/shopify-stores?${params.toString()}`)
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
      const errorMessage = err instanceof Error ? err.message : "Failed to load stores. Please check your connection and try again."
      setError(errorMessage)
      if (!initialLoading) {
        showError(errorMessage)
      }
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [statusTab, search, page, pageSize, initialLoading, showError])

  // Initial fetch
  useEffect(() => {
    fetchStores()
  }, [fetchStores])

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

  // Remove this useEffect as pageCount is now set from API response

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
    try {
      setLoading(true)
      showInfo(`Syncing ${store.name}...`)
      
      const response = await fetch(`/api/shopify-stores/${store.id}/sync`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to sync store')
      }
      
      const data = await response.json()
      showSuccess(`${store.name} has been synced successfully`)
      
      // Refresh stores list
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
    // TODO: Open add products modal
  }

  const handleViewProducts = (store: ShopifyStore) => {
    handleViewDetails(store)
    // TODO: Switch to products tab in drawer
  }

  const handleDisconnect = async (store: ShopifyStore) => {
    try {
      setLoading(true)
      showInfo(`Disconnecting ${store.name}...`)
      
      const response = await fetch(`/api/admin/shopify-stores/${store.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'disconnected' }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to disconnect store')
      }
      
      showSuccess(`${store.name} has been disconnected`)
      
      // Refresh stores list
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
      
      // Delete all selected stores
      const storesToDelete = selectedStores.length > 0 ? selectedStores : [storeToDelete]
      
      for (const store of storesToDelete) {
        const response = await fetch(`/api/admin/shopify-stores/${store.id}`, {
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
      
      // Refresh stores list
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

  // Bulk actions
  const handleBulkSync = async () => {
    if (selectedStores.length === 0) return
    
    try {
      setLoading(true)
      showInfo(`Syncing ${selectedStores.length} stores...`)
      
      const syncPromises = selectedStores.map(store =>
        fetch(`/api/shopify-stores/${store.id}/sync`, { method: 'POST' })
      )
      
      await Promise.all(syncPromises)
      
      setSelectedStores([])
      showSuccess(`${selectedStores.length} stores synced successfully`)
      
      // Refresh stores list
      await fetchStores()
    } catch (err) {
      console.error("Error syncing stores:", err)
      showError("Failed to sync some stores")
    } finally {
      setLoading(false)
    }
  }

  const handleBulkDisconnect = async () => {
    if (selectedStores.length === 0) return
    
    try {
      setLoading(true)
      showInfo(`Disconnecting ${selectedStores.length} stores...`)
      
      const disconnectPromises = selectedStores.map(store =>
        fetch(`/api/admin/shopify-stores/${store.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'disconnected' }),
        })
      )
      
      await Promise.all(disconnectPromises)
      
      setSelectedStores([])
      showSuccess(`${selectedStores.length} stores disconnected`)
      
      // Refresh stores list
      await fetchStores()
    } catch (err) {
      console.error("Error disconnecting stores:", err)
      showError("Failed to disconnect some stores")
    } finally {
      setLoading(false)
    }
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
    { id: "connected", label: "Connected", count: 0 },
    { id: "high-revenue", label: "High Revenue", count: 0 },
    { id: "high-traffic", label: "High Traffic", count: 0 },
    { id: "recently-synced", label: "Recently Synced", count: 0 },
    { id: "needs-sync", label: "Needs Sync", count: 0 },
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
      <div className="bg-primary/85 text-primary-foreground rounded-md px-4 py-3 mb-3 flex-shrink-0 w-full">
        <div className="flex items-center justify-between flex-wrap gap-2">
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
              <h1 className="text-lg font-semibold tracking-tight text-white">Shopify Stores</h1>
              <p className="text-xs text-white/90 mt-0.5">
                Manage connected Shopify stores
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAssigneeModalOpen(true)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Users className="h-4 w-4 mr-2" />
            Add Assignee
          </Button>
        </div>
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

      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <Input
            placeholder="Search stores, URLs, users, niches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full sm:w-[140px] flex-shrink-0 text-sm"
          />
          {quickFilters.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={quickFilter ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-2"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {quickFilters.map((filter) => (
                  <DropdownMenuItem
                    key={filter.id}
                    onClick={() => setQuickFilter(quickFilter === filter.id ? null : filter.id)}
                    className={cn(
                      "cursor-pointer",
                      quickFilter === filter.id && "bg-accent"
                    )}
                  >
                    <span>{filter.label}</span>
                    {quickFilter === filter.id && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </DropdownMenuItem>
                ))}
                {quickFilter && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setQuickFilter(null)}
                      className="cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filter
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {secondaryButtons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant || "outline"}
              size="sm"
              onClick={button.onClick}
              disabled={button.disabled}
              className="h-8"
            >
              {button.icon}
              {button.label}
            </Button>
          ))}
          <Button
            onClick={() => {
              showInfo("Opening add store dialog...")
              // TODO: Open add store modal
            }}
            size="sm"
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Store
          </Button>
        </div>
      </div>

      {/* Grid View */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {initialLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader size="sm" />
              <span>Loading stores...</span>
            </div>
          </div>
        ) : paginatedStores.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">No stores found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedStores.map((store) => (
              <AdminShopifyStoreCard
                key={store.id}
                store={store}
                onEdit={handleEdit}
                onViewDetails={handleViewDetails}
                onSync={handleSync}
                onDelete={handleDelete}
                canEdit={true}
                canDelete={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!initialLoading && paginatedStores.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredStores.length)} of {filteredStores.length} stores
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {page} of {pageCount}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
            >
              Next
            </Button>
          </div>
        </div>
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
