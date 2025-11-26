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
import { Plus, Trash2, RefreshCw } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createStoreResearchColumns } from "./components/store-research-columns"
import { StoreResearchEntry, sampleStoreResearchEntries } from "./data/store-research"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { QuickViewModal } from "@/components/ui/quick-view-modal"

export default function AdminStoreResearchPage() {
  const [entries] = useState<StoreResearchEntry[]>(sampleStoreResearchEntries)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<StoreResearchEntry | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedEntryForQuickView, setSelectedEntryForQuickView] = useState<StoreResearchEntry | null>(null)

  const categories = useMemo(() => {
    const categorySet = new Set(entries.map((e) => e.data.category))
    return Array.from(categorySet)
  }, [entries])

  // Filter entries based on search and filters
  const filteredEntries = useMemo(() => {
    let result = entries

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (entry) =>
          entry.store_url.toLowerCase().includes(searchLower) ||
          (entry.store_name && entry.store_name.toLowerCase().includes(searchLower))
        )
    }

    // Apply column filters
    filters.forEach((filter) => {
      if (filter.id === "category" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        result = result.filter((entry) => filterValues.includes(entry.data.category))
      }
    })

    return result
  }, [entries, search, filters])

  // Paginate filtered entries
  const paginatedEntries = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredEntries.slice(start, end)
  }, [filteredEntries, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredEntries.length / pageSize))
    setInitialLoading(false)
  }, [filteredEntries.length, pageSize])

  const handleViewDetails = (entry: StoreResearchEntry) => {
    setSelectedEntryForQuickView(entry)
    setQuickViewOpen(true)
  }

  const handleRowClick = (entry: StoreResearchEntry) => {
    setSelectedEntryForQuickView(entry)
    setQuickViewOpen(true)
  }

  const handleRefresh = async (entry: StoreResearchEntry) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Refresh data for:", entry.store_url)
  }

  const handleDelete = (entry: StoreResearchEntry) => {
    setEntryToDelete(entry)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!entryToDelete) return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDeleteConfirmOpen(false)
    setEntryToDelete(null)
  }

  const columns = useMemo(
    () =>
      createStoreResearchColumns({
        onViewDetails: handleViewDetails,
        onRefresh: handleRefresh,
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
          <h1 className="text-lg font-semibold tracking-tight">Store Research</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage store research data
          </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Store
          </Button>
      </div>

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading entries...</div>
            </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedEntries}
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
          secondaryButtons={[
            {
              label: "Refresh Selected",
              icon: <RefreshCw className="h-4 w-4" />,
              onClick: () => {
                // TODO: Handle bulk refresh
              },
              variant: "outline",
            },
          ]}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Store Research</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this store research entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {entryToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Store:</span> {entryToDelete.store_url}
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
      {selectedEntryForQuickView && (
        <QuickViewModal
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
          title={selectedEntryForQuickView.store_name || selectedEntryForQuickView.store_url}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Store URL</p>
              <p className="text-sm font-medium">{selectedEntryForQuickView.store_url}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <p className="text-sm font-medium">{selectedEntryForQuickView.data.category}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Monthly Traffic</p>
              <p className="text-sm font-medium">
                {new Intl.NumberFormat("en-US", { notation: "compact" }).format(selectedEntryForQuickView.data.monthlyTraffic)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Monthly Revenue</p>
              <p className="text-sm font-medium">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(selectedEntryForQuickView.data.monthlyRevenue)}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedEntryForQuickView)
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
