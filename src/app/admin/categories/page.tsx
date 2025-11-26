"use client"

import { useState, useMemo, useEffect } from "react"
import { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, TrendingUp } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createCategoriesColumns } from "./components/categories-columns"
import { QuickViewModal } from "@/components/ui/quick-view-modal"
import { LargeModal } from "@/components/ui/large-modal"
import { DetailDrawer } from "@/components/ui/detail-drawer"
import { ProductCategory } from "@/types/admin/categories"
import { sampleCategories } from "./data/categories"
import Image from "next/image"

export default function AdminCategoriesPage() {
  const [categories] = useState<ProductCategory[]>(sampleCategories)
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [largeModalOpen, setLargeModalOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null)

  const parentCategories = useMemo(() => {
    return categories.filter((cat) => !cat.parent_category_id)
  }, [categories])

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter((category) => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
          category.name.toLowerCase().includes(searchLower) ||
          category.slug.toLowerCase().includes(searchLower) ||
          (category.description && category.description.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }

      const parentFilter = columnFilters.find((f) => f.id === "parent_category_id")
      if (parentFilter && parentFilter.value && Array.isArray(parentFilter.value) && parentFilter.value.length > 0) {
        if (!parentFilter.value.includes(category.parent_category_id || "")) return false
      }

      const trendingFilter = columnFilters.find((f) => f.id === "trending")
      if (trendingFilter && trendingFilter.value && Array.isArray(trendingFilter.value) && trendingFilter.value.length > 0) {
        const isTrending = trendingFilter.value.includes("trending")
        const isNotTrending = trendingFilter.value.includes("not-trending")
        if (isTrending && !category.trending) return false
        if (isNotTrending && category.trending) return false
      }

      return true
    })

    if (sorting.length > 0) {
      const sort = sorting[0]
      filtered.sort((a, b) => {
        let aValue: any = a[sort.id as keyof ProductCategory]
        let bValue: any = b[sort.id as keyof ProductCategory]
        if (aValue < bValue) return sort.desc ? 1 : -1
        if (aValue > bValue) return sort.desc ? -1 : 1
        return 0
      })
    }

    return filtered
  }, [categories, searchQuery, columnFilters, sorting])

  const paginatedCategories = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredCategories.slice(start, end)
  }, [filteredCategories, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredCategories.length / pageSize))
    setInitialLoading(false)
  }, [filteredCategories.length, pageSize])

  const handleViewDetails = (category: ProductCategory) => {
    setSelectedCategory(category)
    setDetailDrawerOpen(true)
  }

  const handleQuickView = (category: ProductCategory) => {
    setSelectedCategory(category)
    setQuickViewOpen(true)
  }

  const handleLargeModal = (category: ProductCategory) => {
    setSelectedCategory(category)
    setLargeModalOpen(true)
  }

  const handleDelete = (category: ProductCategory) => {
    setCategoryToDelete(category)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDeleteConfirmOpen(false)
    setCategoryToDelete(null)
    setSelectedCategories(selectedCategories.filter((c) => c.id !== categoryToDelete.id))
  }

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSelectedCategories([])
  }

  const handleBulkToggleTrending = async () => {
    if (selectedCategories.length === 0) return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSelectedCategories([])
  }

  const handleRowClick = (category: ProductCategory) => {
    setSelectedCategory(category)
    setQuickViewOpen(true)
  }

  const columns = useMemo(
    () =>
      createCategoriesColumns({
        onViewDetails: handleViewDetails,
        onQuickView: handleQuickView,
        onLargeModal: handleLargeModal,
        onDelete: handleDelete,
      }),
    []
  )

  const parentOptions = parentCategories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }))

  const trendingOptions = [
    { label: "Trending", value: "trending" },
    { label: "Not Trending", value: "not-trending" },
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
      <div>
          <h1 className="text-lg font-semibold tracking-tight">Categories</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage product categories
          </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading categories...</div>
      </div>
      ) : (
          <DataTable
            columns={columns}
            data={paginatedCategories}
            pageCount={pageCount}
          onPaginationChange={(p, s) => {
            setPage(p)
            setPageSize(s)
            }}
            onSortingChange={setSorting}
            onFilterChange={setColumnFilters}
            onSearchChange={setSearchQuery}
          loading={loading}
          initialLoading={initialLoading}
            filterConfig={[
              {
                columnId: "parent_category_id",
                title: "Parent Category",
                options: [{ label: "None", value: "" }, ...parentOptions],
              },
              {
                columnId: "trending",
                title: "Trending Status",
                options: trendingOptions,
              },
            ]}
          searchPlaceholder="Search categories..."
          page={page}
          pageSize={pageSize}
          onAdd={() => {
            // TODO: Handle add category
          }}
          addButtonText="Add Category"
          addButtonIcon={<Plus className="h-4 w-4" />}
          enableRowSelection={true}
          onRowSelectionChange={setSelectedCategories}
          onRowClick={handleRowClick}
            secondaryButtons={[
              ...(selectedCategories.length > 0
                ? [
                    {
                      label: "Toggle Trending",
                      icon: <TrendingUp className="h-4 w-4" />,
                      onClick: handleBulkToggleTrending,
                      variant: "outline" as const,
                    },
                    {
                      label: "Delete Selected",
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: handleBulkDelete,
                      variant: "destructive" as const,
                    },
                  ]
                : []),
            ]}
          />
      )}

      {/* Quick View Modal */}
      {selectedCategory && (
        <QuickViewModal
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
          title={selectedCategory.name}
        >
          <div className="space-y-4">
            {selectedCategory.image && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Products</p>
              <p className="text-sm font-medium">{selectedCategory.product_count}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge variant={selectedCategory.trending ? "default" : "outline"}>
                {selectedCategory.trending ? "Trending" : "Not Trending"}
              </Badge>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedCategory)
                }}
              >
                View Full
              </Button>
            </div>
          </div>
        </QuickViewModal>
      )}

      {/* Large Modal */}
      {selectedCategory && (
        <LargeModal
          open={largeModalOpen}
          onOpenChange={setLargeModalOpen}
          title={selectedCategory.name}
          footer={
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setLargeModalOpen(false)}>
                Close
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(selectedCategory)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {selectedCategory.image && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  fill
                  className="object-cover"
                  sizes="90vw"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Slug</p>
                <p className="text-sm font-mono">{selectedCategory.slug}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={selectedCategory.trending ? "default" : "outline"}>
                  {selectedCategory.trending ? "Trending" : "Not Trending"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Products</p>
                <p className="text-lg font-semibold">{selectedCategory.product_count}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Profit Margin</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {selectedCategory.avg_profit_margin ? `${selectedCategory.avg_profit_margin.toFixed(1)}%` : "—"}
                </p>
              </div>
            </div>
            {selectedCategory.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{selectedCategory.description}</p>
              </div>
            )}
          </div>
        </LargeModal>
      )}

      {/* Detail Drawer */}
      {selectedCategory && (
        <DetailDrawer
          open={detailDrawerOpen}
          onOpenChange={setDetailDrawerOpen}
          title={selectedCategory.name}
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="space-y-6">
                  {selectedCategory.image && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={selectedCategory.image}
                        alt={selectedCategory.name}
                        fill
                        className="object-cover"
                        sizes="100%"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Slug</p>
                      <p className="text-sm font-mono">{selectedCategory.slug}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge variant={selectedCategory.trending ? "default" : "outline"}>
                        {selectedCategory.trending ? "Trending" : "Not Trending"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Products</p>
                      <p className="text-lg font-semibold">{selectedCategory.product_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Avg Profit Margin</p>
                      <p className="text-lg font-semibold text-emerald-600">
                        {selectedCategory.avg_profit_margin ? `${selectedCategory.avg_profit_margin.toFixed(1)}%` : "—"}
                      </p>
                    </div>
                  </div>
                  {selectedCategory.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Description</p>
                      <p className="text-sm">{selectedCategory.description}</p>
                    </div>
                  )}
                </div>
              ),
            },
            {
              value: "stats",
              label: "Statistics",
              content: (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Product Count</p>
                    <p className="text-2xl font-bold">{selectedCategory.product_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Average Profit Margin</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {selectedCategory.avg_profit_margin ? `${selectedCategory.avg_profit_margin.toFixed(1)}%` : "—"}
                    </p>
                  </div>
                  {selectedCategory.growth_percentage !== null && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Growth Percentage</p>
                      <p className="text-2xl font-bold">{selectedCategory.growth_percentage.toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
          headerActions={
            <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedCategory)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          }
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {categoryToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Category:</span> {categoryToDelete.name}
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
    </div>
  )
}
