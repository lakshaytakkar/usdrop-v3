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
import { createSuppliersColumns } from "./components/suppliers-columns"
import { Supplier } from "@/app/suppliers/data/suppliers"
import { adminSampleSuppliers } from "./data/suppliers"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { QuickViewModal } from "@/components/ui/quick-view-modal"

export default function AdminSuppliersPage() {
  const [suppliers] = useState<Supplier[]>(adminSampleSuppliers)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedSupplierForQuickView, setSelectedSupplierForQuickView] = useState<Supplier | null>(null)

  const categories = useMemo(() => {
    const categorySet = new Set(suppliers.map((s) => s.category))
    return Array.from(categorySet)
  }, [suppliers])

  // Filter suppliers based on search and filters
  const filteredSuppliers = useMemo(() => {
    let result = suppliers

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchLower) ||
          supplier.description.toLowerCase().includes(searchLower)
        )
    }

    // Apply column filters
    filters.forEach((filter) => {
      if (filter.id === "category" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        result = result.filter((supplier) => filterValues.includes(supplier.category))
      }
      if (filter.id === "verified" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        const isVerified = filterValues.includes("verified")
        const isUnverified = filterValues.includes("unverified")
        result = result.filter((supplier) => {
          if (isVerified && !supplier.verified) return false
          if (isUnverified && supplier.verified) return false
      return true
    })
      }
    })

    return result
  }, [suppliers, search, filters])

  // Paginate filtered suppliers
  const paginatedSuppliers = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredSuppliers.slice(start, end)
  }, [filteredSuppliers, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredSuppliers.length / pageSize))
    setInitialLoading(false)
  }, [filteredSuppliers.length, pageSize])

  const handleViewDetails = (supplier: Supplier) => {
    setSelectedSupplierForQuickView(supplier)
    setQuickViewOpen(true)
  }

  const handleRowClick = (supplier: Supplier) => {
    setSelectedSupplierForQuickView(supplier)
    setQuickViewOpen(true)
  }

  const handleDelete = (supplier: Supplier) => {
    setSupplierToDelete(supplier)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!supplierToDelete) return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDeleteConfirmOpen(false)
    setSupplierToDelete(null)
  }

  const columns = useMemo(
    () =>
      createSuppliersColumns({
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
    {
      columnId: "verified",
      title: "Verification",
      options: [
        { label: "Verified", value: "verified" },
        { label: "Unverified", value: "unverified" },
      ],
    },
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
      <div>
          <h1 className="text-lg font-semibold tracking-tight">Suppliers</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage suppliers and vendor information
          </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
      </div>

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading suppliers...</div>
            </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedSuppliers}
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
          searchPlaceholder="Search suppliers..."
          page={page}
          pageSize={pageSize}
          onAdd={() => {
            // TODO: Handle add supplier
          }}
          addButtonText="Add Supplier"
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
            <DialogTitle>Delete Supplier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this supplier? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {supplierToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Supplier:</span> {supplierToDelete.name}
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
      {selectedSupplierForQuickView && (
        <QuickViewModal
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
          title={selectedSupplierForQuickView.name}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Country</p>
              <p className="text-sm font-medium">{selectedSupplierForQuickView.country}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <p className="text-sm font-medium">{selectedSupplierForQuickView.category}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Rating</p>
              <p className="text-sm font-medium">{selectedSupplierForQuickView.rating.toFixed(1)} ({selectedSupplierForQuickView.reviews} reviews)</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-sm font-medium capitalize">
                {selectedSupplierForQuickView.verified ? "Verified" : "Unverified"}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedSupplierForQuickView)
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
