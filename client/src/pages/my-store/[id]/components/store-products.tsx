import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Package, Search, Image as ImageIcon } from "lucide-react"
import { BlueSpinner } from "@/components/ui/blue-spinner"

interface StoreProduct {
  id: string
  store_id: string
  shopify_product_id: string
  title: string
  body_html: string | null
  vendor: string | null
  product_type: string | null
  status: string
  tags: string[]
  image_url: string | null
  variants: any[]
  price: number | null
  compare_at_price: number | null
  inventory_quantity: number
  shopify_created_at: string | null
  shopify_updated_at: string | null
  created_at: string
  updated_at: string
}

interface StoreProductsProps {
  storeId: string
}

export function StoreProducts({ storeId }: StoreProductsProps) {
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch(`/api/shopify-stores/${storeId}/products`)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [storeId])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filtered = products.filter(p => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.vendor && p.vendor.toLowerCase().includes(search.toLowerCase())) ||
      (p.product_type && p.product_type.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <BlueSpinner size="lg" label="Loading products..." />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No Products Synced</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Click "Sync Now" to pull your Shopify products into USDrop.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-products"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground" data-testid="text-products-showing">
          {filtered.length} of {products.length} products
        </span>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Inventory</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Vendor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                  <TableCell>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="h-10 w-10 rounded object-cover border"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">
                      <p className="font-medium truncate" data-testid={`text-product-title-${product.id}`}>
                        {product.title}
                      </p>
                      {product.variants && product.variants.length > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {product.variants.length} variants
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.status === 'active' ? 'default' : product.status === 'draft' ? 'secondary' : 'outline'}
                      className="capitalize"
                      data-testid={`badge-product-status-${product.id}`}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium" data-testid={`text-product-price-${product.id}`}>
                    {product.price != null ? `$${Number(product.price).toFixed(2)}` : '—'}
                    {product.compare_at_price != null && product.compare_at_price > (product.price || 0) && (
                      <span className="text-xs text-muted-foreground line-through ml-1">
                        ${Number(product.compare_at_price).toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right" data-testid={`text-product-inventory-${product.id}`}>
                    <span className={product.inventory_quantity <= 0 ? 'text-destructive font-medium' : ''}>
                      {product.inventory_quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {product.product_type || '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {product.vendor || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
