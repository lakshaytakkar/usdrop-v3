

import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, Suspense } from "react"
import { useRouter, useParams, useSearchParams } from "@/hooks/use-router"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  MoreVertical,
  Lock,
  LockOpen,
  Trash2,
  Copy,
  Package,
  Building,
  TrendingUp,
  DollarSign,
  Star,
} from "lucide-react"
import { HandPickedProduct, ProductPick } from "@/types/admin/products"
import { Product, ProductMetadata } from "@/types/products"

import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Loader2 } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ProductFormModal } from "../components/product-form-modal"

type ProductType = "hand-picked" | "product-picks"
type ProductUnion = HandPickedProduct | ProductPick

// Transform API Product to HandPickedProduct
const transformToHandPicked = (product: Product): HandPickedProduct => {
  const metadata: Partial<ProductMetadata> = product.metadata || {}
  return {
    id: product.id,
    image: product.image,
    title: product.title,
    profit_margin: metadata.profit_margin || 0,
    pot_revenue: metadata.pot_revenue || 0,
    category: product.category?.slug || product.category?.name || 'other',
    is_locked: metadata.is_locked || false,
    found_date: metadata.found_date || product.created_at,
    filters: metadata.filters || [],
    description: product.description,
    supplier_info: product.supplier ? {
      name: product.supplier.name,
      company_name: product.supplier.company_name || undefined,
      min_order: 0,
    } : null,
    unlock_price: metadata.unlock_price || null,
    detailed_analysis: metadata.detailed_analysis || null,
    created_at: product.created_at,
    updated_at: product.updated_at,
  }
}

// Transform API Product to ProductPick
const transformToProductPick = (product: Product): ProductPick => {
  return {
    id: product.id,
    image: product.image,
    title: product.title,
    buy_price: product.buy_price,
    sell_price: product.sell_price,
    profit_per_order: product.profit_per_order,
    trend_data: product.trend_data || [],
    category: product.category?.slug || product.category?.name || 'other',
    rating: product.rating,
    reviews_count: product.reviews_count || 0,
    description: product.description,
    supplier_id: product.supplier_id,
    supplier: product.supplier ? {
      id: product.supplier.id,
      name: product.supplier.name,
      company_name: product.supplier.company_name || null,
      logo: product.supplier.logo || null,
    } : undefined,
    additional_images: product.additional_images || [],
    specifications: product.specifications,
    created_at: product.created_at,
    updated_at: product.updated_at,
  }
}

function ProductDetailContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const productId = params?.id as string
  const productType = (searchParams?.get("type") || "hand-picked") as ProductType
  const { showSuccess, showError } = useToast()

  // Permission checks
  const { hasPermission: canEdit } = useHasPermission("products.edit")
  const { hasPermission: canDelete } = useHasPermission("products.delete")
  const { hasPermission: canLockUnlock } = useHasPermission("products.lock_unlock")

  const [product, setProduct] = useState<ProductUnion | null>(null)
  const [allHandPicked, setAllHandPicked] = useState<HandPickedProduct[]>([])
  const [allProductPicks, setAllProductPicks] = useState<ProductPick[]>([])
  const [loading, setLoading] = useState(true)
  const [productFormOpen, setProductFormOpen] = useState(false)

  // Fetch product and all products for navigation
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        
        // Validate productId before making request
        if (!productId || productId === 'undefined') {
          showError('Invalid product ID')
          setLoading(false)
          return
        }
        
        // Fetch the specific product
        const productResponse = await apiFetch(`/api/admin/products/${productId}`)
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product')
        }
        const productData = await productResponse.json()
        const apiProduct: Product = productData.product
        
        // Determine product type from source
        const sourceType = apiProduct.source?.source_type || 'hand_picked'
        const isHandPicked = sourceType === 'hand_picked'
        
        // Transform to appropriate type
        if (isHandPicked) {
          setProduct(transformToHandPicked(apiProduct))
        } else {
          setProduct(transformToProductPick(apiProduct))
        }
        
        // Fetch all products for navigation
        const allProductsResponse = await fetch(
          `/api/admin/products?source_type=${isHandPicked ? 'hand_picked' : 'scraped'}&pageSize=1000`
        )
        if (allProductsResponse.ok) {
          const allProductsData = await allProductsResponse.json()
          const allProducts: Product[] = allProductsData.products || []
          
          if (isHandPicked) {
            setAllHandPicked(allProducts.map(transformToHandPicked))
          } else {
            setAllProductPicks(allProducts.map(transformToProductPick))
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        showError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    
    if (productId) {
      fetchProduct()
    }
  }, [productId, showError])

  // Find previous and next products
  const { prevProduct, nextProduct } = useMemo(() => {
    if (!product) return { prevProduct: null, nextProduct: null }
    
    const products = productType === "hand-picked" ? allHandPicked : allProductPicks
    const currentIndex = products.findIndex((p) => p.id === product.id)
    const prev = currentIndex > 0 ? products[currentIndex - 1] : null
    const next = currentIndex < products.length - 1 ? products[currentIndex + 1] : null
    
    return { prevProduct: prev, nextProduct: next }
  }, [product, productType, allHandPicked, allProductPicks])

  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading product...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Product not found</div>
        </div>
      </div>
    )
  }

  const refetchProduct = async () => {
    try {
      const productResponse = await apiFetch(`/api/admin/products/${productId}`)
      if (!productResponse.ok) return
      const productData = await productResponse.json()
      const apiProduct: Product = productData.product
      const sourceType = apiProduct.source?.source_type || 'hand_picked'
      const isHandPicked = sourceType === 'hand_picked'
      if (isHandPicked) {
        setProduct(transformToHandPicked(apiProduct))
      } else {
        setProduct(transformToProductPick(apiProduct))
      }
    } catch (err) {
      console.error('Error refetching product:', err)
    }
  }

  const handleEdit = () => {
    if (!canEdit) {
      showError("You don't have permission to edit products")
      return
    }
    setProductFormOpen(true)
  }

  const handleDelete = async () => {
    if (!canDelete) {
      showError("You don't have permission to delete products")
      return
    }
    
    if (!confirm(`Are you sure you want to delete "${product.title}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      const response = await apiFetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete product')
      }
      
      showSuccess('Product deleted successfully')
      router.push('/admin/products')
    } catch (err) {
      showError("Failed to delete product")
    }
  }

  const handleToggleLock = async () => {
    if (productType !== "hand-picked") return
    if (!canLockUnlock) {
      showError("You don't have permission to lock/unlock products")
      return
    }
    try {
      const hp = product as HandPickedProduct
      const response = await apiFetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: { is_locked: !hp.is_locked }
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update product')
      }
      
      setProduct({ ...hp, is_locked: !hp.is_locked, updated_at: new Date().toISOString() } as ProductUnion)
      showSuccess(`Product ${!hp.is_locked ? "locked" : "unlocked"} successfully`)
    } catch (err) {
      showError("Failed to update product")
    }
  }

  const handleDuplicate = () => {
    if (!canEdit) {
      showError("You don't have permission to create products")
      return
    }
    // TODO: Implement duplicate
    showError("Duplicate functionality will be implemented")
  }

  const handleCopyProductId = async () => {
    try {
      await navigator.clipboard.writeText(product.id)
      showSuccess("Product ID copied to clipboard")
    } catch (err) {
      showError("Failed to copy Product ID")
    }
  }

  const handleCopyTitle = async () => {
    try {
      await navigator.clipboard.writeText(product.title)
      showSuccess("Product title copied to clipboard")
    } catch (err) {
      showError("Failed to copy title")
    }
  }

  const handleViewCategory = () => {
    router.push(`/admin/categories?category=${product.category}`)
  }

  const handleViewSupplier = () => {
    if (productType === "hand-picked") {
      const hp = product as HandPickedProduct
      if (hp.supplier_info) {
        // TODO: Navigate to supplier page
        showError(`Supplier navigation will be implemented. Supplier: ${hp.supplier_info.name}`)
      }
    } else {
      const pp = product as ProductPick
      if (pp.supplier_id) {
        router.push(`/admin/suppliers/${pp.supplier_id}`)
      }
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Topbar with Back Button, Breadcrumbs and Navigation */}
      <div className="flex items-center justify-between p-3 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/products")}
            className="h-8 w-8 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/admin/products" className="hover:text-foreground cursor-pointer">
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {prevProduct && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/products/${prevProduct.id}?type=${productType}`)}
              className="h-8 w-8 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {nextProduct && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/products/${nextProduct.id}?type=${productType}`)}
              className="h-8 w-8 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Product Header */}
        <Card className="mb-2">
          <CardHeader className="pb-2 px-4 pt-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                     
                      className="object-cover"
                     
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg mb-0.5">{product.title}</CardTitle>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {product.category.replace(/-/g, " ")}
                    </Badge>
                    {productType === "hand-picked" && (
                      <Badge variant={(product as HandPickedProduct).is_locked ? "destructive" : "default"} className="text-xs">
                        {(product as HandPickedProduct).is_locked ? (
                          <>
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </>
                        ) : (
                          "Unlocked"
                        )}
                      </Badge>
                    )}
                    {productType === "product-picks" && (product as ProductPick).rating && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {(product as ProductPick).rating?.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {/* Button Group with Edit and More Actions */}
              <div className="flex items-center gap-1.5">
                <Button onClick={handleEdit} className="cursor-pointer" size="sm" variant="outline" disabled={!canEdit}>
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="cursor-pointer h-8 w-8">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {productType === "hand-picked" && (
                      <DropdownMenuItem onClick={handleToggleLock} className="cursor-pointer" disabled={!canLockUnlock}>
                        {(product as HandPickedProduct).is_locked ? (
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
                    )}
                    <DropdownMenuItem onClick={handleViewCategory} className="cursor-pointer">
                      <Package className="h-4 w-4 mr-2" />
                      View Category
                    </DropdownMenuItem>
                    {(productType === "hand-picked" && (product as HandPickedProduct).supplier_info) ||
                    (productType === "product-picks" && (product as ProductPick).supplier) ? (
                      <DropdownMenuItem onClick={handleViewSupplier} className="cursor-pointer">
                        <Building className="h-4 w-4 mr-2" />
                        View Supplier
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleCopyProductId} className="cursor-pointer">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Product ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyTitle} className="cursor-pointer">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Title
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDuplicate} className="cursor-pointer" disabled={!canEdit}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate Product
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer" disabled={!canDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <TabsList>
            <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
            <TabsTrigger value="pricing" className="cursor-pointer">Pricing & Profit</TabsTrigger>
            <TabsTrigger value="supplier" className="cursor-pointer">Supplier Info</TabsTrigger>
            {productType === "hand-picked" ? (
              <TabsTrigger value="analysis" className="cursor-pointer">Analysis</TabsTrigger>
            ) : (
              <TabsTrigger value="trend" className="cursor-pointer">Trend Data</TabsTrigger>
            )}
            <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="overview" className="space-y-2 mt-0">
              <Card>
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-base">Product Information</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                       
                        className="object-cover"
                       
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Package className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Product ID</p>
                      <p className="text-sm font-mono">{product.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Category</p>
                      <Badge variant="outline">{product.category.replace(/-/g, " ")}</Badge>
                    </div>
                    {productType === "hand-picked" && (
                      <>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Status</p>
                          <Badge variant={(product as HandPickedProduct).is_locked ? "destructive" : "default"}>
                            {(product as HandPickedProduct).is_locked ? "Locked" : "Unlocked"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Found Date</p>
                          <p className="text-sm">{format(new Date((product as HandPickedProduct).found_date), "MMM dd, yyyy")}</p>
                        </div>
                      </>
                    )}
                    {productType === "product-picks" && (
                      <>
                        {(product as ProductPick).rating && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">
                                {(product as ProductPick).rating?.toFixed(1)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({(product as ProductPick).reviews_count} reviews)
                              </span>
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Created At</p>
                          <p className="text-sm">{format(new Date(product.created_at), "MMM dd, yyyy HH:mm")}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Updated At</p>
                      <p className="text-sm">{format(new Date(product.updated_at), "MMM dd, yyyy HH:mm")}</p>
                    </div>
                  </div>
                  {product.description && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Description</p>
                      <p className="text-sm">{product.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pricing" className="space-y-2 mt-0">
              <Card>
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-base">Pricing & Profit Information</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {productType === "hand-picked" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Profit Margin</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {(product as HandPickedProduct).profit_margin}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Pot Revenue</p>
                        <p className="text-2xl font-bold">
                          ${(product as HandPickedProduct).pot_revenue.toFixed(2)}
                        </p>
                      </div>
                      {(product as HandPickedProduct).unlock_price && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Unlock Price</p>
                          <p className="text-lg font-semibold"> 
                            ${(product as HandPickedProduct).unlock_price?.toFixed(2) ?? '0.00'}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (() => {
                    const pp = product as ProductPick
                    const buyPrice = pp.buy_price
                    const sellPrice = pp.sell_price
                    const profit = pp.profit_per_order
                    const margin = buyPrice > 0 ? ((profit / sellPrice) * 100).toFixed(1) : "0.0"
                    const chartData = [
                      { name: 'Buy Price', value: buyPrice, fill: '#3b82f6' },
                      { name: 'Profit', value: profit, fill: '#10b981' },
                      { name: 'Sell Price', value: sellPrice, fill: '#6366f1' },
                    ]
                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="rounded-lg border p-3">
                            <p className="text-xs text-muted-foreground mb-1">Buy Price</p>
                            <p className="text-2xl font-bold text-blue-500">${buyPrice.toFixed(2)}</p>
                          </div>
                          <div className="rounded-lg border p-3">
                            <p className="text-xs text-muted-foreground mb-1">Sell Price</p>
                            <p className="text-2xl font-bold text-indigo-500">${sellPrice.toFixed(2)}</p>
                          </div>
                          <div className="rounded-lg border p-3">
                            <p className="text-xs text-muted-foreground mb-1">Profit per Order</p>
                            <p className="text-2xl font-bold text-emerald-600">${profit.toFixed(2)}</p>
                          </div>
                          <div className="rounded-lg border p-3">
                            <p className="text-xs text-muted-foreground mb-1">Profit Margin</p>
                            <p className="text-2xl font-bold text-emerald-600">{margin}%</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-3">Profit Breakdown</p>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData} barSize={60}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, '']} />
                              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="supplier" className="space-y-2 mt-0">
              <Card>
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-base">Supplier Information</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {productType === "hand-picked" ? (
                    (product as HandPickedProduct).supplier_info ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Supplier Name</p>
                          <p className="text-sm font-medium">
                            {(product as HandPickedProduct).supplier_info?.name || "N/A"}
                          </p>
                        </div>
                        {(product as HandPickedProduct).supplier_info?.min_order && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Minimum Order</p>
                            <p className="text-sm">
                              {(product as HandPickedProduct).supplier_info?.min_order} units
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No supplier information available</p>
                    )
                  ) : (
                    (product as ProductPick).supplier ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Supplier Name</p>
                          <p className="text-sm font-medium">
                            {(product as ProductPick).supplier?.name}
                          </p>
                        </div>
                        {(product as ProductPick).supplier?.company_name && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Company Name</p>
                            <p className="text-sm">
                              {(product as ProductPick).supplier?.company_name}
                            </p>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleViewSupplier}
                          className="cursor-pointer"
                        >
                          <Building className="h-4 w-4 mr-2" />
                          View Supplier Details
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No supplier information available</p>
                    )
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            {productType === "hand-picked" ? (
              <TabsContent value="analysis" className="space-y-2 mt-0">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-4">
                    <CardTitle className="text-base">Product Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-4">
                    {(product as HandPickedProduct).detailed_analysis && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Detailed Analysis</p>
                        <p className="text-sm whitespace-pre-wrap">
                          {(product as HandPickedProduct).detailed_analysis}
                        </p>
                      </div>
                    )}
                    {(product as HandPickedProduct).filters && (product as HandPickedProduct).filters!.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Filters</p>
                        <div className="flex flex-wrap gap-1">
                          {(product as HandPickedProduct).filters!.map((filter, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {filter}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ) : (
              <TabsContent value="trend" className="space-y-2 mt-0">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-4">
                    <CardTitle className="text-base">Trend Data</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    {(product as ProductPick).trend_data && (product as ProductPick).trend_data!.length > 0 ? (() => {
                      const trendData = (product as ProductPick).trend_data!
                      const chartData = trendData.map((val, i) => ({ period: `Week ${i + 1}`, value: val }))
                      const minVal = Math.min(...trendData)
                      const maxVal = Math.max(...trendData)
                      const avgVal = trendData.reduce((a, b) => a + b, 0) / trendData.length
                      const firstVal = trendData[0]
                      const lastVal = trendData[trendData.length - 1]
                      const pctChange = firstVal > 0 ? (((lastVal - firstVal) / firstVal) * 100).toFixed(1) : "0.0"
                      const isTrendingUp = lastVal > firstVal
                      return (
                        <div className="space-y-6">
                          <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={chartData}>
                              <defs>
                                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                              <YAxis tick={{ fontSize: 11 }} />
                              <Tooltip />
                              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#trendGradient)" />
                            </AreaChart>
                          </ResponsiveContainer>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="rounded-lg border p-3">
                              <p className="text-xs text-muted-foreground mb-1">Min</p>
                              <p className="text-lg font-bold">{minVal}</p>
                            </div>
                            <div className="rounded-lg border p-3">
                              <p className="text-xs text-muted-foreground mb-1">Max</p>
                              <p className="text-lg font-bold">{maxVal}</p>
                            </div>
                            <div className="rounded-lg border p-3">
                              <p className="text-xs text-muted-foreground mb-1">Average</p>
                              <p className="text-lg font-bold">{avgVal.toFixed(1)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className={`h-4 w-4 ${isTrendingUp ? 'text-emerald-600' : 'text-red-500'}`} />
                            <span className="text-sm font-medium">
                              {isTrendingUp ? "Trending Up" : "Trending Down"} {pctChange}%
                            </span>
                          </div>
                        </div>
                      )
                    })() : (
                      <p className="text-sm text-muted-foreground">No trend data available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            <TabsContent value="settings" className="space-y-2 mt-0">
              <Card>
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-base">Product Settings</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Product settings and management options will be available here.
                  </p>
                  {/* TODO: Add product settings form */}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {productType === "product-picks" && (
        <ProductFormModal
          open={productFormOpen}
          onOpenChange={setProductFormOpen}
          product={product as ProductPick}
          onSuccess={refetchProduct}
        />
      )}
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading product...</span>
          </div>
        </div>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  )
}
