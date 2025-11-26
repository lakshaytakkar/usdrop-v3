"use client"

import { useState, useMemo, useEffect } from "react"
import { ColumnDef, SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Plus, Lock, LockOpen, Trash2, MoreVertical, Eye, Star } from "lucide-react"
import Image from "next/image"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { QuickViewModal } from "@/components/ui/quick-view-modal"
import { LargeModal } from "@/components/ui/large-modal"
import { DetailDrawer } from "@/components/ui/detail-drawer"
import { HandPickedProduct, ProductPick } from "@/types/admin/products"
import { sampleHandPickedProducts, sampleProductPicks } from "./data/products"
import { format } from "date-fns"

type ProductType = "hand-picked" | "product-picks"
type ProductUnion = HandPickedProduct | ProductPick

export default function AdminProductsPage() {
  const [handPickedProducts] = useState<HandPickedProduct[]>(sampleHandPickedProducts)
  const [productPicks] = useState<ProductPick[]>(sampleProductPicks)
  const [activeTab, setActiveTab] = useState<ProductType>("hand-picked")
  const [selectedProducts, setSelectedProducts] = useState<ProductUnion[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [largeModalOpen, setLargeModalOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductUnion | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<ProductUnion | null>(null)

  const categories = useMemo(() => {
    const products = activeTab === "hand-picked" ? handPickedProducts : productPicks
    const categorySet = new Set(products.map((p) => p.category))
    return Array.from(categorySet)
  }, [activeTab, handPickedProducts, productPicks])

  const filteredProducts = useMemo(() => {
    const products = activeTab === "hand-picked" ? handPickedProducts : productPicks

    let filtered = products.filter((product) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        if (!product.title.toLowerCase().includes(searchLower)) return false
      }

      // Category filter from column filters
      const categoryFilter = columnFilters.find((f) => f.id === "category")
      if (categoryFilter && categoryFilter.value && Array.isArray(categoryFilter.value) && categoryFilter.value.length > 0) {
        if (!categoryFilter.value.includes(product.category)) return false
      }

      // Lock filter (only for hand-picked)
      if (activeTab === "hand-picked") {
        const lockFilter = columnFilters.find((f) => f.id === "is_locked")
        if (lockFilter && lockFilter.value && Array.isArray(lockFilter.value) && lockFilter.value.length > 0) {
          const hp = product as HandPickedProduct
          const isLocked = lockFilter.value.includes("locked")
          const isUnlocked = lockFilter.value.includes("unlocked")
          if (isLocked && !hp.is_locked) return false
          if (isUnlocked && hp.is_locked) return false
        }
      }

      return true
    })

    // Apply sorting
    if (sorting.length > 0) {
      const sort = sorting[0]
      filtered.sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (sort.id) {
          case "title":
            aValue = a.title
            bValue = b.title
            break
          case "category":
            aValue = a.category
            bValue = b.category
            break
          case "profit_margin":
            aValue = (a as HandPickedProduct).profit_margin
            bValue = (b as HandPickedProduct).profit_margin
            break
          case "pot_revenue":
            aValue = (a as HandPickedProduct).pot_revenue
            bValue = (b as HandPickedProduct).pot_revenue
            break
          case "buy_price":
            aValue = (a as ProductPick).buy_price
            bValue = (b as ProductPick).buy_price
            break
          case "sell_price":
            aValue = (a as ProductPick).sell_price
            bValue = (b as ProductPick).sell_price
            break
          default:
            return 0
        }

        if (aValue < bValue) return sort.desc ? 1 : -1
        if (aValue > bValue) return sort.desc ? -1 : 1
        return 0
      })
    }

    return filtered
  }, [activeTab, handPickedProducts, productPicks, searchQuery, columnFilters, sorting])

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredProducts.slice(start, end)
  }, [filteredProducts, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredProducts.length / pageSize))
    setInitialLoading(false)
  }, [filteredProducts.length, pageSize])

  const handleViewDetails = (product: ProductUnion) => {
    setSelectedProduct(product)
    setDetailDrawerOpen(true)
  }

  const handleQuickView = (product: ProductUnion) => {
    setSelectedProduct(product)
    setQuickViewOpen(true)
  }

  const handleLargeModal = (product: ProductUnion) => {
    setSelectedProduct(product)
    setLargeModalOpen(true)
  }

  const handleToggleLock = (product: HandPickedProduct) => {
    // TODO: Toggle lock status
    console.log("Toggle lock:", product)
  }

  const handleDelete = (product: ProductUnion) => {
    setProductToDelete(product)
    setDeleteConfirmOpen(true)
  }

  const handleRowClick = (product: ProductUnion) => {
    setSelectedProduct(product)
    setQuickViewOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDeleteConfirmOpen(false)
    setProductToDelete(null)
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productToDelete.id))
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSelectedProducts([])
  }

  const handleBulkLock = async () => {
    if (selectedProducts.length === 0 || activeTab !== "hand-picked") return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSelectedProducts([])
  }

  const handleBulkUnlock = async () => {
    if (selectedProducts.length === 0 || activeTab !== "hand-picked") return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSelectedProducts([])
  }

  const handPickedColumns: ColumnDef<HandPickedProduct>[] = [
    {
      id: "image",
      cell: ({ row }) => (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
          <Image
            src={row.original.image}
            alt={row.original.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      ),
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      id: "category",
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.category.replace(/-/g, " ")}</Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: "profit_margin",
      accessorKey: "profit_margin",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Profit Margin" />,
      cell: ({ row }) => (
        <span className="text-emerald-600 font-medium">{row.original.profit_margin}%</span>
      ),
    },
    {
      id: "pot_revenue",
      accessorKey: "pot_revenue",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pot Revenue" />,
      cell: ({ row }) => (
        <span className="font-medium">${row.original.pot_revenue.toFixed(2)}</span>
      ),
    },
    {
      id: "is_locked",
      accessorKey: "is_locked",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={row.original.is_locked ? "destructive" : "default"}>
          {row.original.is_locked ? "Locked" : "Unlocked"}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        const isLocked = value.includes("locked")
        const isUnlocked = value.includes("unlocked")
        if (isLocked && !row.original.is_locked) return false
        if (isUnlocked && row.original.is_locked) return false
        return true
      },
    },
    {
      id: "found_date",
      accessorKey: "found_date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Found Date" />,
      cell: ({ row }) => (
        <div className="text-sm">
          {format(new Date(row.original.found_date), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleQuickView(product)}>
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLargeModal(product)}>
                <Eye className="h-4 w-4 mr-2" />
                View Full Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                <Eye className="h-4 w-4 mr-2" />
                View in Drawer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleLock(product)}>
                {product.is_locked ? (
                  <>
                    <LockOpen className="h-4 w-4 mr-2" />
                    Unlock
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Lock
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(product)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const productPicksColumns: ColumnDef<ProductPick>[] = [
    {
      id: "image",
      cell: ({ row }) => (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
          <Image
            src={row.original.image}
            alt={row.original.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      ),
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      id: "buy_price",
      accessorKey: "buy_price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Buy Price" />,
      cell: ({ row }) => <span>${row.original.buy_price.toFixed(2)}</span>,
    },
    {
      id: "sell_price",
      accessorKey: "sell_price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sell Price" />,
      cell: ({ row }) => <span className="font-medium">${row.original.sell_price.toFixed(2)}</span>,
    },
    {
      id: "profit_per_order",
      accessorKey: "profit_per_order",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Profit" />,
      cell: ({ row }) => (
        <span className="text-emerald-600 font-medium">
          ${row.original.profit_per_order.toFixed(2)}
        </span>
      ),
    },
    {
      id: "category",
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.category.replace(/-/g, " ")}</Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: "rating",
      accessorKey: "rating",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
      cell: ({ row }) => {
        const product = row.original
        return product.rating ? (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )
      },
    },
    {
      id: "supplier",
      accessorFn: (row) => row.supplier?.name || "",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Supplier" />,
      cell: ({ row }) => {
        const product = row.original
        return product.supplier ? (
          <span className="text-sm">{product.supplier.name}</span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleQuickView(product)}>
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLargeModal(product)}>
                <Eye className="h-4 w-4 mr-2" />
                View Full Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                <Eye className="h-4 w-4 mr-2" />
                View in Drawer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(product)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const categoryOptions = categories.map((cat) => ({
    label: cat.replace(/-/g, " "),
    value: cat,
  }))

  const lockOptions = [
    { label: "Locked", value: "locked" },
    { label: "Unlocked", value: "unlocked" },
  ]

  const currentColumns = activeTab === "hand-picked" ? handPickedColumns : productPicksColumns

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
      <div>
          <h1 className="text-lg font-semibold tracking-tight">Products</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage hand-picked products and product picks
          </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ProductType)} className="mt-0">
        <TabsList>
          <TabsTrigger value="hand-picked">Hand-picked Products</TabsTrigger>
          <TabsTrigger value="product-picks">Product Picks</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {initialLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading products...</div>
            </div>
          ) : (
              <DataTable
                columns={currentColumns as ColumnDef<ProductUnion>[]}
                data={paginatedProducts as ProductUnion[]}
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
                searchPlaceholder="Search products..."
                page={page}
                pageSize={pageSize}
                enableRowSelection={true}
                onRowSelectionChange={setSelectedProducts}
              onRowClick={handleRowClick}
                filterConfig={[
                  {
                    columnId: "category",
                    title: "Category",
                    options: categoryOptions,
                  },
                  ...(activeTab === "hand-picked"
                    ? [
                        {
                          columnId: "is_locked",
                          title: "Lock Status",
                          options: lockOptions,
                        },
                      ]
                    : []),
                ]}
                secondaryButtons={[
                  ...(activeTab === "hand-picked" && selectedProducts.length > 0
                    ? [
                        {
                          label: "Lock Selected",
                          icon: <Lock className="h-4 w-4" />,
                          onClick: handleBulkLock,
                          variant: "outline" as const,
                        },
                        {
                          label: "Unlock Selected",
                          icon: <LockOpen className="h-4 w-4" />,
                          onClick: handleBulkUnlock,
                          variant: "outline" as const,
                        },
                      ]
                    : []),
                  ...(selectedProducts.length > 0
                    ? [
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
        </TabsContent>
      </Tabs>

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
          title={selectedProduct.title}
        >
          <div className="space-y-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.title}
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <Badge variant="outline">{selectedProduct.category.replace(/-/g, " ")}</Badge>
            </div>
            {activeTab === "hand-picked" && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Profit Margin</p>
                  <p className="text-sm font-medium text-emerald-600">
                    {(selectedProduct as HandPickedProduct).profit_margin}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge variant={(selectedProduct as HandPickedProduct).is_locked ? "destructive" : "default"}>
                    {(selectedProduct as HandPickedProduct).is_locked ? "Locked" : "Unlocked"}
                  </Badge>
                </div>
              </>
            )}
            {activeTab === "product-picks" && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Buy Price</p>
                  <p className="text-sm font-medium">${(selectedProduct as ProductPick).buy_price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sell Price</p>
                  <p className="text-sm font-medium">${(selectedProduct as ProductPick).sell_price.toFixed(2)}</p>
                </div>
              </>
            )}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedProduct)
                }}
              >
                View Full
              </Button>
            </div>
          </div>
        </QuickViewModal>
      )}

      {/* Large Modal */}
      {selectedProduct && (
        <LargeModal
          open={largeModalOpen}
          onOpenChange={setLargeModalOpen}
          title={selectedProduct.title}
          footer={
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setLargeModalOpen(false)}>
                Close
              </Button>
              {activeTab === "hand-picked" && (
                <Button
                  variant="outline"
                  onClick={() => handleToggleLock(selectedProduct as HandPickedProduct)}
                >
                  {(selectedProduct as HandPickedProduct).is_locked ? (
                    <>
                      <LockOpen className="h-4 w-4 mr-2" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Lock
                    </>
                  )}
                </Button>
              )}
              <Button variant="destructive" onClick={() => handleDelete(selectedProduct)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.title}
                fill
                className="object-cover"
                sizes="90vw"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <Badge variant="outline">{selectedProduct.category.replace(/-/g, " ")}</Badge>
              </div>
              {activeTab === "hand-picked" && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge variant={(selectedProduct as HandPickedProduct).is_locked ? "destructive" : "default"}>
                      {(selectedProduct as HandPickedProduct).is_locked ? "Locked" : "Unlocked"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Profit Margin</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {(selectedProduct as HandPickedProduct).profit_margin}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pot Revenue</p>
                    <p className="text-lg font-semibold">
                      ${(selectedProduct as HandPickedProduct).pot_revenue.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
              {activeTab === "product-picks" && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Buy Price</p>
                    <p className="text-lg font-semibold">
                      ${(selectedProduct as ProductPick).buy_price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Sell Price</p>
                    <p className="text-lg font-semibold">
                      ${(selectedProduct as ProductPick).sell_price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Profit per Order</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      ${(selectedProduct as ProductPick).profit_per_order.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>
            {selectedProduct.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{selectedProduct.description}</p>
              </div>
            )}
          </div>
        </LargeModal>
      )}

      {/* Detail Drawer */}
      {selectedProduct && (
        <DetailDrawer
          open={detailDrawerOpen}
          onOpenChange={setDetailDrawerOpen}
          title={selectedProduct.title}
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="space-y-6">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      fill
                      className="object-cover"
                      sizes="100%"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <Badge variant="outline">{selectedProduct.category.replace(/-/g, " ")}</Badge>
                    </div>
                    {activeTab === "hand-picked" && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Status</p>
                          <Badge variant={(selectedProduct as HandPickedProduct).is_locked ? "destructive" : "default"}>
                            {(selectedProduct as HandPickedProduct).is_locked ? "Locked" : "Unlocked"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Profit Margin</p>
                          <p className="text-lg font-semibold text-emerald-600">
                            {(selectedProduct as HandPickedProduct).profit_margin}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Pot Revenue</p>
                          <p className="text-lg font-semibold">
                            ${(selectedProduct as HandPickedProduct).pot_revenue.toFixed(2)}
                          </p>
                        </div>
                      </>
                    )}
                    {activeTab === "product-picks" && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Buy Price</p>
                          <p className="text-lg font-semibold">
                            ${(selectedProduct as ProductPick).buy_price.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Sell Price</p>
                          <p className="text-lg font-semibold">
                            ${(selectedProduct as ProductPick).sell_price.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Profit per Order</p>
                          <p className="text-lg font-semibold text-emerald-600">
                            ${(selectedProduct as ProductPick).profit_per_order.toFixed(2)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  {selectedProduct.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Description</p>
                      <p className="text-sm">{selectedProduct.description}</p>
                    </div>
                  )}
                </div>
              ),
            },
            {
              value: "details",
              label: "Details",
              content: (
                <div className="space-y-4">
                  {activeTab === "hand-picked" && (
                    <>
                      {(selectedProduct as HandPickedProduct).supplier_info && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Supplier</p>
                          <p className="text-sm">
                            {(selectedProduct as HandPickedProduct).supplier_info?.name || "N/A"}
                          </p>
                        </div>
                      )}
                      {(selectedProduct as HandPickedProduct).unlock_price && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Unlock Price</p>
                          <p className="text-sm">
                            ${(selectedProduct as HandPickedProduct).unlock_price?.toFixed(2)}
                          </p>
                        </div>
                      )}
                      {(selectedProduct as HandPickedProduct).detailed_analysis && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Detailed Analysis</p>
                          <p className="text-sm">{(selectedProduct as HandPickedProduct).detailed_analysis}</p>
                        </div>
                      )}
                    </>
                  )}
                  {activeTab === "product-picks" && (
                    <>
                      {(selectedProduct as ProductPick).supplier && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Supplier</p>
                          <p className="text-sm">{(selectedProduct as ProductPick).supplier?.name}</p>
                        </div>
                      )}
                      {(selectedProduct as ProductPick).rating && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Rating</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {(selectedProduct as ProductPick).rating?.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({(selectedProduct as ProductPick).reviews_count} reviews)
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ),
            },
          ]}
          headerActions={
            <div className="flex gap-2">
              {activeTab === "hand-picked" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleLock(selectedProduct as HandPickedProduct)}
                >
                  {(selectedProduct as HandPickedProduct).is_locked ? (
                    <>
                      <LockOpen className="h-4 w-4 mr-2" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Lock
                    </>
                  )}
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedProduct)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          }
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {productToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Product:</span> {productToDelete.title}
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
