import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Trash2,
  MoreHorizontal,
  Eye,
  Package,
  Edit,
  Download,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { ProductFormModal } from "./components/product-form-modal"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Product } from "@/types/products"
import { Category } from "@/types/categories"
import {
  AdminPageHeader,
  AdminStatCards,
  AdminFilterBar,
  AdminActionBar,
  AdminEmptyState,
} from "@/components/admin"

type SortField = "title" | "created_at" | "sell_price" | "profit_per_order" | "rating"
type SortOrder = "asc" | "desc"
type ProductTab = "all" | "winning" | "locked"

export default function AdminProductsPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const { hasPermission: canCreate } = useHasPermission("products.create")
  const { hasPermission: canEdit } = useHasPermission("products.edit")
  const { hasPermission: canDelete } = useHasPermission("products.delete")

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<ProductTab>("all")

  const totalPages = Math.ceil(total / pageSize)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy: sortField,
        sortOrder: sortOrder,
      })

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim())
      }

      if (categoryFilter && categoryFilter !== "all") {
        params.set("category_id", categoryFilter)
      }

      if (activeTab === "winning") {
        params.set("is_winning", "true")
      } else if (activeTab === "locked") {
        params.set("is_locked", "true")
      }

      const response = await apiFetch(`/api/admin/products?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } catch (err) {
      showError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, sortField, sortOrder, searchQuery, categoryFilter, activeTab, showError])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiFetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    setPage(1)
    setSelectedIds(new Set())
  }, [searchQuery, categoryFilter, activeTab])

  useEffect(() => {
    if (page > 1 && page > totalPages && totalPages > 0) {
      setPage(totalPages)
    }
  }, [total, pageSize, page, totalPages])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-40" />
    return sortOrder === "asc" ? <ArrowUp className="h-3.5 w-3.5 ml-1" /> : <ArrowDown className="h-3.5 w-3.5 ml-1" />
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const handleDelete = (product: Product) => {
    if (!canDelete) {
      showError("You don't have permission to delete products")
      return
    }
    setProductToDelete(product)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    try {
      const response = await apiFetch(`/api/admin/products/${productToDelete.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete product")
      showSuccess(`"${productToDelete.title}" deleted`)
      setDeleteConfirmOpen(false)
      setProductToDelete(null)
      fetchProducts()
    } catch {
      showError("Failed to delete product")
    }
  }

  const handleBulkDelete = async () => {
    if (!canDelete) {
      showError("You don't have permission to delete products")
      return
    }
    try {
      const promises = Array.from(selectedIds).map((id) =>
        apiFetch(`/api/admin/products/${id}`, { method: "DELETE" })
      )
      const results = await Promise.allSettled(promises)
      const failed = results.filter((r) => r.status === "rejected").length
      const succeeded = selectedIds.size - failed
      if (failed > 0) {
        showError(`Failed to delete ${failed} product(s)`)
      }
      if (succeeded > 0) {
        showSuccess(`${succeeded} product(s) deleted`)
      }
      setSelectedIds(new Set())
      setBulkDeleteConfirmOpen(false)
      fetchProducts()
    } catch {
      showError("Failed to delete products")
    }
  }

  const handleEdit = (product: Product) => {
    if (!canEdit) {
      showError("You don't have permission to edit products")
      return
    }
    const pick = {
      id: product.id,
      image: product.image,
      title: product.title,
      buy_price: product.buy_price,
      sell_price: product.sell_price,
      profit_per_order: product.profit_per_order,
      trend_data: product.trend_data || [],
      category: product.category?.slug || product.category?.name || "other",
      rating: product.rating,
      reviews_count: product.reviews_count || 0,
      description: product.description,
      supplier_id: product.supplier_id,
      supplier: product.supplier,
      additional_images: product.additional_images || [],
      specifications: product.specifications,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }
    setEditingProduct(pick)
    setProductFormOpen(true)
  }

  const handleExport = () => {
    const exportProducts = selectedIds.size > 0
      ? products.filter((p) => selectedIds.has(p.id))
      : products

    const headers = ["Title", "Category", "Buy Price", "Sell Price", "Profit", "Margin%", "Rating", "Created"]
    const rows = exportProducts.map((p) => {
      const margin = p.sell_price > 0 ? ((p.profit_per_order / p.sell_price) * 100).toFixed(1) : "0.0"
      return [
        p.title,
        p.category?.name || "",
        `$${p.buy_price?.toFixed(2) || "0.00"}`,
        `$${p.sell_price?.toFixed(2) || "0.00"}`,
        `$${p.profit_per_order?.toFixed(2) || "0.00"}`,
        `${margin}%`,
        p.rating?.toFixed(1) || "",
        new Date(p.created_at).toLocaleDateString(),
      ]
    })

    const csv = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `products-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showSuccess(`Exported ${exportProducts.length} product(s)`)
  }

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return "$0.00"
    return `$${Number(price).toFixed(2)}`
  }

  const winningCount = useMemo(() => products.filter(p => p.metadata?.is_winning).length, [products])
  const avgProfit = useMemo(() => {
    if (products.length === 0) return 0
    const totalProfit = products.reduce((sum, p) => sum + (p.profit_per_order || 0), 0)
    return totalProfit / products.length
  }, [products])

  const statCards = useMemo(() => [
    {
      label: "Total Products",
      value: total,
      icon: Package,
      description: "All products in catalog",
    },
    {
      label: "Winning Products",
      value: winningCount,
      icon: Star,
      description: "Marked as winning",
    },
    {
      label: "Avg Profit",
      value: `$${avgProfit.toFixed(2)}`,
      icon: TrendingUp,
      description: "Average profit per order",
    },
  ], [total, winningCount, avgProfit])

  const tabs = [
    { value: "all", label: "All" },
    { value: "winning", label: "Winning" },
    { value: "locked", label: "Locked" },
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden" data-testid="admin-products-page">
      <AdminPageHeader
        title="Products"
        description="Manage your product catalog"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products" },
        ]}
        actions={[
          {
            label: "Export",
            icon: <Download className="h-4 w-4" />,
            onClick: handleExport,
            variant: "outline",
          },
          {
            label: "Add Product",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => {
              if (!canCreate) {
                showError("You don't have permission to create products")
                return
              }
              setEditingProduct(null)
              setProductFormOpen(true)
            },
            disabled: !canCreate,
          },
        ]}
        className="mb-4"
      />

      <AdminStatCards stats={statCards} loading={false} columns={3} />

      <div className="mt-4">
        <AdminFilterBar
          search={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search products..."
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(v) => setActiveTab(v as ProductTab)}
        >
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-[160px] text-sm" data-testid="filter-category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => fetchProducts()}
            data-testid="button-refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </AdminFilterBar>
      </div>

      {selectedIds.size > 0 && (
        <div className="mt-3">
          <AdminActionBar
            selectedCount={selectedIds.size}
            onClearSelection={() => setSelectedIds(new Set())}
            actions={[
              {
                label: "Export",
                icon: <Download className="h-4 w-4" />,
                onClick: handleExport,
                variant: "outline",
              },
              {
                label: "Delete",
                icon: <Trash2 className="h-4 w-4" />,
                onClick: () => setBulkDeleteConfirmOpen(true),
                variant: "destructive",
                disabled: !canDelete,
              },
            ]}
          />
        </div>
      )}

      <Card className="flex-1 overflow-hidden border rounded-lg mt-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="w-10 px-3 py-2.5">
                  <Checkbox
                    checked={products.length > 0 && selectedIds.size === products.length}
                    onCheckedChange={toggleSelectAll}
                    data-testid="checkbox-select-all"
                  />
                </th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground w-16"></th>
                <th className="px-3 py-2.5 text-left">
                  <button
                    className="flex items-center font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleSort("title")}
                    data-testid="sort-title"
                  >
                    Title
                    <SortIcon field="title" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Buy Price</th>
                <th className="px-3 py-2.5 text-right">
                  <button
                    className="flex items-center ml-auto font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleSort("sell_price")}
                    data-testid="sort-price"
                  >
                    Sell Price
                    <SortIcon field="sell_price" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-right">
                  <button
                    className="flex items-center ml-auto font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleSort("profit_per_order")}
                    data-testid="sort-profit"
                  >
                    Profit
                    <SortIcon field="profit_per_order" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                <th className="w-12 px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span className="text-sm">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <AdminEmptyState
                      icon={Package}
                      title="No products found"
                      description="Try adjusting your search or filters, or add a new product."
                      actionLabel={canCreate ? "Add Product" : undefined}
                      onAction={canCreate ? () => {
                        setEditingProduct(null)
                        setProductFormOpen(true)
                      } : undefined}
                    />
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isWinning = product.metadata?.is_winning ?? false
                  const isLocked = product.metadata?.is_locked ?? false

                  return (
                    <tr
                      key={product.id}
                      className="border-b hover:bg-muted/30 transition-colors group"
                      data-testid={`row-product-${product.id}`}
                    >
                      <td className="px-3 py-2.5">
                        <Checkbox
                          checked={selectedIds.has(product.id)}
                          onCheckedChange={() => toggleSelect(product.id)}
                          data-testid={`checkbox-product-${product.id}`}
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted border flex-shrink-0">
                          {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="object-cover w-full h-full"
                              data-testid={`img-product-${product.id}`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="min-w-0">
                          <button
                            className="font-medium truncate max-w-[280px] text-left hover:text-primary hover:underline transition-colors cursor-pointer block"
                            onClick={() => router.push(`/admin/products/${product.id}`)}
                            data-testid={`link-product-${product.id}`}
                          >
                            {product.title}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">
                          {product.category?.name || "\u2014"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        {formatPrice(product.buy_price)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        {formatPrice(product.sell_price)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {formatPrice(product.profit_per_order)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1 flex-wrap">
                          {isWinning ? (
                            <Badge variant="default" className="text-xs" data-testid={`badge-winning-${product.id}`}>
                              <Star className="h-3 w-3 mr-0.5" />
                              Winning
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs" data-testid={`badge-regular-${product.id}`}>
                              Regular
                            </Badge>
                          )}
                          {isLocked && (
                            <Badge variant="outline" className="text-xs" data-testid={`badge-locked-${product.id}`}>
                              Locked
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              data-testid={`button-actions-${product.id}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/products/${product.id}`)}
                              className="cursor-pointer"
                              data-testid={`action-view-${product.id}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(product)}
                              className="cursor-pointer"
                              disabled={!canEdit}
                              data-testid={`action-edit-${product.id}`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(product)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                              disabled={!canDelete}
                              data-testid={`action-delete-${product.id}`}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && products.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span data-testid="text-pagination-info">
                {((page - 1) * pageSize) + 1}&ndash;{Math.min(page * pageSize, total)} of {total} products
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => {
                  setPageSize(Number(v))
                  setPage(1)
                }}
              >
                <SelectTrigger className="h-7 w-[70px] text-xs" data-testid="select-page-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs">per page</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(1)}
                disabled={page === 1}
                data-testid="button-first-page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                data-testid="button-prev-page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2 text-muted-foreground" data-testid="text-page-number">
                Page {page} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                data-testid="button-next-page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                data-testid="button-last-page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {productToDelete && (
            <div className="flex items-center gap-3 py-2">
              <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted border flex-shrink-0">
                {productToDelete.image && (productToDelete.image.startsWith('http') || productToDelete.image.startsWith('/')) ? (
                  <img src={productToDelete.image} alt={productToDelete.title} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              <p className="text-sm font-medium" data-testid="text-delete-product-name">{productToDelete.title}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} data-testid="button-confirm-delete">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.size} Products</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedIds.size} selected product(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteConfirmOpen(false)} data-testid="button-cancel-bulk-delete">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete} data-testid="button-confirm-bulk-delete">
              Delete {selectedIds.size} products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProductFormModal
        open={productFormOpen}
        onOpenChange={(open) => {
          setProductFormOpen(open)
          if (!open) setEditingProduct(null)
        }}
        product={editingProduct}
        onSuccess={() => fetchProducts()}
      />
    </div>
  )
}
