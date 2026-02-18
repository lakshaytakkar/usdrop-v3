"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
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
import { Plus, Trash2, MoreHorizontal, Eye, Package, Edit, Download, RefreshCw, Search, Upload, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, Folder } from "lucide-react"
import Image from "next/image"
import { ProductFormModal } from "./components/product-form-modal"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Loader } from "@/components/ui/loader"
import { Product } from "@/types/products"
import { Category } from "@/types/categories"

type SortField = "title" | "created_at" | "sell_price" | "profit_per_order" | "rating"
type SortOrder = "asc" | "desc"

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

      const response = await fetch(`/api/admin/products?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } catch (err) {
      showError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, sortField, sortOrder, searchQuery, categoryFilter, showError])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/categories")
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
  }, [searchQuery, categoryFilter])

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
      const response = await fetch(`/api/admin/products/${productToDelete.id}`, { method: "DELETE" })
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
        fetch(`/api/admin/products/${id}`, { method: "DELETE" })
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

    const headers = ["Title", "Category", "Buy Price", "Sell Price", "Profit", "Rating", "Created"]
    const rows = exportProducts.map((p) => [
      p.title,
      p.category?.name || "",
      `$${p.buy_price?.toFixed(2) || "0.00"}`,
      `$${p.sell_price?.toFixed(2) || "0.00"}`,
      `$${p.profit_per_order?.toFixed(2) || "0.00"}`,
      p.rating?.toFixed(1) || "",
      new Date(p.created_at).toLocaleDateString(),
    ])

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-semibold leading-[1.35] tracking-tight text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your product catalog</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-card border rounded-lg p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Products</span>
            <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
              <Package className="h-[18px] w-[18px] text-primary" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-semibold">{total}</span>
          </div>
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">All products in catalog</span>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Categories</span>
            <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
              <Folder className="h-[18px] w-[18px] text-primary" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-semibold">{categories.length}</span>
          </div>
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">Product categories</span>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">On This Page</span>
            <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
              <Eye className="h-[18px] w-[18px] text-primary" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-semibold">{products.length}</span>
          </div>
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">Products on current page</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-8 text-sm"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-[160px] text-sm">
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

        {selectedIds.size > 0 && (
          <>
            <Button variant="outline" size="sm" className="h-9" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1.5" />
              Export ({selectedIds.size})
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-9"
              onClick={() => setBulkDeleteConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete ({selectedIds.size})
            </Button>
          </>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
          <Button
            size="sm"
            className="h-9"
            disabled={!canCreate}
            onClick={() => {
              if (!canCreate) {
                showError("You don't have permission to create products")
                return
              }
              setEditingProduct(null)
              setProductFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add product
          </Button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="w-10 px-3 py-2.5">
                  <Checkbox
                    checked={products.length > 0 && selectedIds.size === products.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground w-16"></th>
                <th className="px-3 py-2.5 text-left">
                  <button
                    className="flex items-center font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleSort("title")}
                  >
                    Product
                    <SortIcon field="title" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-3 py-2.5 text-right">
                  <button
                    className="flex items-center ml-auto font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleSort("sell_price")}
                  >
                    Price
                    <SortIcon field="sell_price" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-right">
                  <button
                    className="flex items-center ml-auto font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleSort("profit_per_order")}
                  >
                    Profit
                    <SortIcon field="profit_per_order" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-right">
                  <button
                    className="flex items-center ml-auto font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleSort("rating")}
                  >
                    Rating
                    <SortIcon field="rating" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-right">
                  <button
                    className="flex items-center ml-auto font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleSort("created_at")}
                  >
                    Date
                    <SortIcon field="created_at" />
                  </button>
                </th>
                <th className="w-12 px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader size="sm" />
                      <span>Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="h-10 w-10 opacity-40" />
                      <p className="text-sm font-medium">No products found</p>
                      <p className="text-xs">Try adjusting your search or filters, or add a new product.</p>
                      <Button
                        size="sm"
                        className="mt-2"
                        disabled={!canCreate}
                        onClick={() => {
                          setEditingProduct(null)
                          setProductFormOpen(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add product
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-3 py-2.5">
                      <Checkbox
                        checked={selectedIds.has(product.id)}
                        onCheckedChange={() => toggleSelect(product.id)}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted border flex-shrink-0">
                        {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="40px"
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
                        >
                          {product.title}
                        </button>
                        {product.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[280px] mt-0.5">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge variant="outline" className="text-xs font-normal bg-emerald-50 text-emerald-700 border-emerald-200">
                        Active
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-sm text-muted-foreground">
                        {product.category?.name || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {formatPrice(product.sell_price)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      <span className="text-emerald-600 font-medium">
                        {formatPrice(product.profit_per_order)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {product.rating ? (
                        <span>{Number(product.rating).toFixed(1)}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(product.created_at)}
                    </td>
                    <td className="px-3 py-2.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/products/${product.id}`)}
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(product)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(product)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && products.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} of {total} products
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => {
                  setPageSize(Number(v))
                  setPage(1)
                }}
              >
                <SelectTrigger className="h-7 w-[70px] text-xs">
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
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2 text-muted-foreground">
                Page {page} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
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
                  <Image src={productToDelete.image} alt={productToDelete.title} fill className="object-cover" sizes="40px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              <p className="text-sm font-medium">{productToDelete.title}</p>
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

      <Dialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.size} Products</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedIds.size} selected product(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
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
