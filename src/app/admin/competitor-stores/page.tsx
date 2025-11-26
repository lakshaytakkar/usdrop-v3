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
import { createCompetitorStoresColumns } from "./components/competitor-stores-columns"
import { CompetitorStore, sampleCompetitorStores } from "./data/stores"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { QuickViewModal } from "@/components/ui/quick-view-modal"

export default function AdminCompetitorStoresPage() {
  const [stores] = useState<CompetitorStore[]>(sampleCompetitorStores)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState<CompetitorStore | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedStoreForQuickView, setSelectedStoreForQuickView] = useState<CompetitorStore | null>(null)

  const categories = useMemo(() => {
    const categorySet = new Set(stores.map((s) => s.category))
    return Array.from(categorySet)
  }, [stores])

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
      if (filter.id === "category" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        result = result.filter((store) => filterValues.includes(store.category))
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

  const handleViewDetails = (store: CompetitorStore) => {
    setSelectedStoreForQuickView(store)
    setQuickViewOpen(true)
  }

  const handleRowClick = (store: CompetitorStore) => {
    setSelectedStoreForQuickView(store)
    setQuickViewOpen(true)
  }

  const handleDelete = (store: CompetitorStore) => {
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
      createCompetitorStoresColumns({
        onViewDetails: handleViewDetails,
        onDelete: handleDelete,
      }),
    []
  )

  const categoryOptions = categories.map((cat) => ({
    label: cat,
    value: cat,
  }))

  const filterConfig = [
    {
      columnId: "category",
      title: "Category",
      options: categoryOptions,
    },
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
      <div>
          <h1 className="text-lg font-semibold tracking-tight">Competitor Stores</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage competitor store data
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
              Are you sure you want to delete this competitor store? This action cannot be undone.
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
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <p className="text-sm font-medium">{selectedStoreForQuickView.category}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Monthly Traffic</p>
              <p className="text-sm font-medium">
                {new Intl.NumberFormat("en-US", { notation: "compact" }).format(selectedStoreForQuickView.monthly_traffic)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Monthly Revenue</p>
              <p className="text-sm font-medium">
                {selectedStoreForQuickView.monthly_revenue
                  ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(selectedStoreForQuickView.monthly_revenue)
                  : "—"}
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
