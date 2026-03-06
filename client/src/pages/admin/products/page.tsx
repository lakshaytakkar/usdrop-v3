import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "@/hooks/use-router"
import { apiFetch } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Plus, Package, DollarSign, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  StatusBadge,
  FormDialog,
  type Column,
  type RowAction,
} from "@/components/admin-shared"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Product } from "@/types/products"
import { Category } from "@/types/categories"

export default function AdminProductsPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    buy_price: "",
    sell_price: "",
    description: "",
    status: "active",
  })

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/products?pageSize=500")
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } catch {
      showError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [showError])

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

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.title}"? This cannot be undone.`)) return
    try {
      const response = await apiFetch(`/api/admin/products/${product.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete product")
      showSuccess(`"${product.title}" deleted`)
      fetchProducts()
    } catch {
      showError("Failed to delete product")
    }
  }

  const handleAddProduct = async () => {
    if (!formData.title.trim()) {
      showError("Title is required")
      return
    }
    try {
      setIsSubmitting(true)
      const response = await apiFetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          buy_price: formData.buy_price ? Number(formData.buy_price) : 0,
          sell_price: formData.sell_price ? Number(formData.sell_price) : 0,
          description: formData.description,
          status: formData.status,
        }),
      })
      if (!response.ok) throw new Error("Failed to create product")
      showSuccess("Product created successfully")
      setShowAddDialog(false)
      setFormData({ title: "", category: "", buy_price: "", sell_price: "", description: "", status: "active" })
      fetchProducts()
    } catch {
      showError("Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return "$0.00"
    return `$${Number(price).toFixed(2)}`
  }

  const avgProfit = useMemo(() => {
    if (products.length === 0) return 0
    return products.reduce((sum, p) => sum + (p.profit_per_order || 0), 0) / products.length
  }, [products])

  const winningCount = useMemo(() => products.filter(p => p.metadata?.is_winning).length, [products])

  const trendingCount = useMemo(() => products.filter(p => p.metadata?.is_trending).length, [products])
  const lockedCount = useMemo(() => products.filter(p => p.metadata?.is_locked).length, [products])

  const categoryFilterOptions = useMemo(() => {
    return categories.map(c => c.name)
  }, [categories])

  const columns: Column<Product>[] = [
    {
      key: "title",
      header: "Product",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-md overflow-hidden bg-muted border flex-shrink-0">
            {item.image && (item.image.startsWith("http") || item.image.startsWith("/")) ? (
              <img
                src={item.image}
                alt={item.title}
                className="object-cover w-full h-full"
                data-testid={`img-product-${item.id}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
          <span className="font-medium truncate max-w-[240px]" data-testid={`text-product-title-${item.id}`}>
            {item.title}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-category-${item.id}`}>
          {item.category?.name || "\u2014"}
        </span>
      ),
    },
    {
      key: "buy_price",
      header: "Buy Price",
      sortable: true,
      render: (item) => (
        <span className="tabular-nums" data-testid={`text-buy-price-${item.id}`}>
          {formatPrice(item.buy_price)}
        </span>
      ),
    },
    {
      key: "sell_price",
      header: "Sell Price",
      sortable: true,
      render: (item) => (
        <span className="tabular-nums" data-testid={`text-sell-price-${item.id}`}>
          {formatPrice(item.sell_price)}
        </span>
      ),
    },
    {
      key: "profit_per_order",
      header: "Profit",
      sortable: true,
      render: (item) => (
        <span className="text-emerald-600 dark:text-emerald-400 font-medium tabular-nums" data-testid={`text-profit-${item.id}`}>
          {formatPrice(item.profit_per_order)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const isWinning = item.metadata?.is_winning ?? false
        return (
          <StatusBadge
            status={isWinning ? "Winning" : "Regular"}
            variant={isWinning ? "success" : "neutral"}
          />
        )
      },
    },
  ]

  const rowActions: RowAction<Product>[] = [
    {
      label: "View Details",
      onClick: (item) => router.push(`/admin/products/${item.id}`),
    },
    {
      label: "Edit",
      onClick: (item) => router.push(`/admin/products/${item.id}`),
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog"
        actions={
          <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-product">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Product
          </Button>
        }
      />

      <StatGrid>
        <StatCard
          label="Total Products"
          value={total}
          icon={Package}
        />
        <StatCard
          label="Winning Products"
          value={winningCount}
          icon={TrendingUp}
        />
        <StatCard
          label="Avg Profit"
          value={`$${avgProfit.toFixed(2)}`}
          icon={DollarSign}
        />
        <StatCard
          label="Categories"
          value={categories.length}
          icon={Package}
          iconBg="rgba(99, 102, 241, 0.1)"
          iconColor="#6366f1"
        />
      </StatGrid>

      <DataTable
        data={products}
        columns={columns}
        rowActions={rowActions}
        searchPlaceholder="Search products..."
        searchKey="title"
        onRowClick={(item) => router.push(`/admin/products/${item.id}`)}
        filters={[
          ...(categoryFilterOptions.length > 0 ? [{ label: "Category", key: "category", options: categoryFilterOptions }] : []),
          { label: "Type", key: "metadata_type", options: ["Winning", "Trending", "Locked", "Regular"] },
        ]}
        emptyTitle="No products found"
        emptyDescription="Add a new product to get started."
        isLoading={loading}
        pageSize={10}
        headerActions={
          <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-product-table">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Product
          </Button>
        }
      />

      <FormDialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open)
          if (!open) {
            setFormData({ title: "", category: "", buy_price: "", sell_price: "", description: "", status: "active" })
          }
        }}
        title="Add Product"
        onSubmit={handleAddProduct}
        submitLabel="Create Product"
        isSubmitting={isSubmitting}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-title">Title</Label>
          <Input
            id="product-title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Product title"
            data-testid="input-product-title"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-category">Category</Label>
          <Input
            id="product-category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Category name"
            data-testid="input-product-category"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-buy-price">Buy Price</Label>
            <Input
              id="product-buy-price"
              type="number"
              value={formData.buy_price}
              onChange={(e) => setFormData({ ...formData, buy_price: e.target.value })}
              placeholder="0.00"
              data-testid="input-product-buy-price"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-sell-price">Sell Price</Label>
            <Input
              id="product-sell-price"
              type="number"
              value={formData.sell_price}
              onChange={(e) => setFormData({ ...formData, sell_price: e.target.value })}
              placeholder="0.00"
              data-testid="input-product-sell-price"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-description">Description</Label>
          <Textarea
            id="product-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Product description"
            data-testid="input-product-description"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger data-testid="select-product-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormDialog>
    </PageShell>
  )
}
