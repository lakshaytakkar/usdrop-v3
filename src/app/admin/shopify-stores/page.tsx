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
import { Plus, Trash2 } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createShopifyStoresColumns } from "./components/shopify-stores-columns"
import { ShopifyStore } from "@/app/shopify-stores/data/stores"
import { adminSampleStores } from "./data/stores"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { QuickViewModal } from "@/components/ui/quick-view-modal"

export default function AdminShopifyStoresPage() {
  const [stores] = useState<ShopifyStore[]>(adminSampleStores)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState<ShopifyStore | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedStoreForQuickView, setSelectedStoreForQuickView] = useState<ShopifyStore | null>(null)

  // Filter stores based on search and filters
  const filteredStores = useMemo(() => {
    let result = stores

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(searchLower) ||
          store.url.toLowerCase().includes(searchLower)
        )
    }

    // Apply column filters
    filters.forEach((filter) => {
      if (filter.id === "status" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        result = result.filter((store) => filterValues.includes(store.status))
      }
    })

    return result
  }, [stores, search, filters])

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

  const handleViewDetails = (store: ShopifyStore) => {
    setSelectedStoreForQuickView(store)
    setQuickViewOpen(true)
  }

  const handleRowClick = (store: ShopifyStore) => {
    setSelectedStoreForQuickView(store)
    setQuickViewOpen(true)
  }

  const handleDelete = (store: ShopifyStore) => {
    setStoreToDelete(store)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!storeToDelete) return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDeleteConfirmOpen(false)
    setStoreToDelete(null)
  }

  const columns = useMemo(
    () =>
      createShopifyStoresColumns({
        onViewDetails: handleViewDetails,
        onDelete: handleDelete,
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
      ],
    },
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
      <div>
          <h1 className="text-lg font-semibold tracking-tight">Shopify Stores</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage connected Shopify stores
          </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Store
          </Button>
      </div>

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
          searchPlaceholder="Search stores..."
          page={page}
          pageSize={pageSize}
          onAdd={() => {
            // TODO: Handle add store
          }}
          addButtonText="Add Store"
          addButtonIcon={<Plus className="h-4 w-4" />}
          enableRowSelection={true}
          onRowSelectionChange={(selectedRows) => {
            // Handle bulk actions if needed
            console.log("Selected rows:", selectedRows)
          }}
          onRowClick={handleRowClick}
          />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Store</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Shopify store? This action cannot be undone.
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

      {/* Quick View Modal */}
      {selectedStoreForQuickView && (
        <QuickViewModal
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
          title={selectedStoreForQuickView.name}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">URL</p>
              <p className="text-sm font-medium">{selectedStoreForQuickView.url}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-sm font-medium capitalize">{selectedStoreForQuickView.status}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Connected At</p>
              <p className="text-sm font-medium">
                {new Date(selectedStoreForQuickView.connectedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedStoreForQuickView)
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </QuickViewModal>
      )}
    </div>
  )
}
