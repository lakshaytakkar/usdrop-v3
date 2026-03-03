import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, Suspense } from "react"
import { useRouter, useParams, useSearchParams } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { BlueSpinner, ButtonSpinner } from "@/components/ui/blue-spinner"
import { AdminDetailLayout, AdminStatCards } from "@/components/admin"
import {
  Edit,
  Lock,
  LockOpen,
  Trash2,
  Copy,
  Package,
  Building,
  TrendingUp,
  DollarSign,
  Star,
  Eye,
  Bookmark,
  BarChart3,
  Calendar,
  Save,
  X,
  ImageIcon,
} from "lucide-react"
import { HandPickedProduct, ProductPick } from "@/types/admin/products"
import { Product, ProductMetadata } from "@/types/products"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ProductFormModal } from "../components/product-form-modal"

type ProductType = "hand-picked" | "product-picks"
type ProductUnion = HandPickedProduct | ProductPick

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

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

interface InlineFieldProps {
  label: string
  value: string
  onSave: (value: string) => Promise<void>
  type?: "text" | "textarea" | "number"
  disabled?: boolean
  testId: string
}

function InlineEditField({ label, value, onSave, type = "text", disabled = false, testId }: InlineFieldProps) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleSave = async () => {
    if (editValue === value) {
      setEditing(false)
      return
    }
    setSaving(true)
    try {
      await onSave(editValue)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <div className="flex items-start gap-2">
          {type === "textarea" ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 text-sm"
              rows={3}
              data-testid={`${testId}-input`}
            />
          ) : (
            <Input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 text-sm"
              step={type === "number" ? "0.01" : undefined}
              data-testid={`${testId}-input`}
            />
          )}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={saving}
              data-testid={`${testId}-save`}
            >
              {saving ? <ButtonSpinner /> : <Save className="h-4 w-4 text-emerald-600" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={saving}
              data-testid={`${testId}-cancel`}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`space-y-1 group ${!disabled ? 'cursor-pointer' : ''}`}
      onClick={() => !disabled && setEditing(true)}
      data-testid={testId}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{value || "—"}</p>
        {!disabled && (
          <Edit className="h-3.5 w-3.5 text-muted-foreground invisible group-hover:visible" />
        )}
      </div>
    </div>
  )
}

function ProductDetailContent() {
  const router = useRouter()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const productId = params?.id as string
  const productType = (searchParams?.get("type") || "hand-picked") as ProductType
  const { showSuccess, showError } = useToast()

  const { hasPermission: canEdit } = useHasPermission("products.edit")
  const { hasPermission: canDelete } = useHasPermission("products.delete")
  const { hasPermission: canLockUnlock } = useHasPermission("products.lock_unlock")

  const [product, setProduct] = useState<ProductUnion | null>(null)
  const [allHandPicked, setAllHandPicked] = useState<HandPickedProduct[]>([])
  const [allProductPicks, setAllProductPicks] = useState<ProductPick[]>([])
  const [loading, setLoading] = useState(true)
  const [productFormOpen, setProductFormOpen] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        if (!productId || productId === 'undefined') {
          showError('Invalid product ID')
          setLoading(false)
          return
        }

        const productResponse = await apiFetch(`/api/admin/products/${productId}`)
        if (!productResponse.ok) throw new Error('Failed to fetch product')
        const productData = await productResponse.json()
        const apiProduct: Product = productData.product

        const sourceType = apiProduct.source?.source_type || 'hand_picked'
        const isHandPicked = sourceType === 'hand_picked'

        if (isHandPicked) {
          setProduct(transformToHandPicked(apiProduct))
        } else {
          setProduct(transformToProductPick(apiProduct))
        }

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

    if (productId) fetchProduct()
  }, [productId, showError])

  const { prevProduct, nextProduct } = useMemo(() => {
    if (!product) return { prevProduct: null, nextProduct: null }
    const products = productType === "hand-picked" ? allHandPicked : allProductPicks
    const currentIndex = products.findIndex((p) => p.id === product.id)
    return {
      prevProduct: currentIndex > 0 ? products[currentIndex - 1] : null,
      nextProduct: currentIndex < products.length - 1 ? products[currentIndex + 1] : null,
    }
  }, [product, productType, allHandPicked, allProductPicks])

  const refetchProduct = async () => {
    try {
      const productResponse = await apiFetch(`/api/admin/products/${productId}`)
      if (!productResponse.ok) return
      const productData = await productResponse.json()
      const apiProduct: Product = productData.product
      const sourceType = apiProduct.source?.source_type || 'hand_picked'
      if (sourceType === 'hand_picked') {
        setProduct(transformToHandPicked(apiProduct))
      } else {
        setProduct(transformToProductPick(apiProduct))
      }
    } catch (err) {
      console.error('Error refetching product:', err)
    }
  }

  const handleInlineSave = async (field: string, value: string) => {
    try {
      const body: Record<string, unknown> = {}
      if (field === "title" || field === "description" || field === "image") {
        body[field] = value
      } else if (field === "buy_price" || field === "sell_price") {
        body[field] = parseFloat(value) || 0
      } else if (field === "rating") {
        body[field] = parseFloat(value) || null
      } else if (field === "reviews_count") {
        body[field] = parseInt(value) || 0
      } else if (field === "profit_margin" || field === "pot_revenue" || field === "unlock_price") {
        body.metadata = { [field]: parseFloat(value) || 0 }
      }

      const response = await apiFetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error('Failed to update')
      showSuccess('Field updated successfully')
      await refetchProduct()
    } catch {
      showError('Failed to update field')
      throw new Error('Save failed')
    }
  }

  const handleDelete = async () => {
    if (!canDelete) {
      showError("You don't have permission to delete products")
      return
    }
    if (!product) return
    if (!confirm(`Are you sure you want to delete "${product.title}"? This action cannot be undone.`)) return

    try {
      const response = await apiFetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete product')
      showSuccess('Product deleted successfully')
      router.push('/admin/products')
    } catch {
      showError("Failed to delete product")
    }
  }

  const handleToggleLock = async () => {
    if (productType !== "hand-picked" || !product) return
    if (!canLockUnlock) {
      showError("You don't have permission to lock/unlock products")
      return
    }
    try {
      const hp = product as HandPickedProduct
      const response = await apiFetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata: { is_locked: !hp.is_locked } })
      })
      if (!response.ok) throw new Error('Failed to update product')
      setProduct({ ...hp, is_locked: !hp.is_locked, updated_at: new Date().toISOString() } as ProductUnion)
      showSuccess(`Product ${!hp.is_locked ? "locked" : "unlocked"} successfully`)
    } catch {
      showError("Failed to update product")
    }
  }

  const handleCopyProductId = async () => {
    if (!product) return
    try {
      await navigator.clipboard.writeText(product.id)
      showSuccess("Product ID copied to clipboard")
    } catch {
      showError("Failed to copy Product ID")
    }
  }

  if (!product && !loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground" data-testid="text-product-not-found">Product not found</div>
      </div>
    )
  }

  const isHandPicked = productType === "hand-picked"

  const badges: React.ReactNode[] = []
  if (product) {
    badges.push(
      <Badge key="category" variant="outline" data-testid="badge-category">
        {product.category.replace(/-/g, " ")}
      </Badge>
    )
    if (isHandPicked) {
      const hp = product as HandPickedProduct
      badges.push(
        <Badge
          key="lock"
          variant={hp.is_locked ? "destructive" : "default"}
          data-testid="badge-lock-status"
        >
          {hp.is_locked ? (
            <><Lock className="h-3 w-3 mr-1" />Locked</>
          ) : "Unlocked"}
        </Badge>
      )
    }
    if (!isHandPicked && (product as ProductPick).rating) {
      badges.push(
        <Badge key="rating" variant="secondary" data-testid="badge-rating">
          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
          {(product as ProductPick).rating?.toFixed(1)}
        </Badge>
      )
    }
  }

  const actions = product ? [
    ...(isHandPicked ? [{
      label: (product as HandPickedProduct).is_locked ? "Unlock Product" : "Lock Product",
      icon: (product as HandPickedProduct).is_locked ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />,
      onClick: handleToggleLock,
      disabled: !canLockUnlock,
    }] : []),
    {
      label: "View Category",
      icon: <Package className="h-4 w-4" />,
      onClick: () => router.push(`/admin/categories?category=${product.category}`),
    },
    ...((isHandPicked && (product as HandPickedProduct).supplier_info) ||
      (!isHandPicked && (product as ProductPick).supplier) ? [{
        label: "View Supplier",
        icon: <Building className="h-4 w-4" />,
        onClick: () => {
          if (!isHandPicked) {
            const pp = product as ProductPick
            if (pp.supplier_id) router.push(`/admin/suppliers/${pp.supplier_id}`)
          }
        },
      }] : []),
    {
      label: "Copy Product ID",
      icon: <Copy className="h-4 w-4" />,
      onClick: handleCopyProductId,
      separator: true,
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "destructive" as const,
      disabled: !canDelete,
      separator: true,
    },
  ] : []

  const primaryActions = product ? (
    <Button
      onClick={() => setProductFormOpen(true)}
      size="sm"
      variant="outline"
      disabled={!canEdit}
      data-testid="button-edit-product"
    >
      <Edit className="h-3.5 w-3.5 mr-1.5" />
      Edit
    </Button>
  ) : undefined

  const overviewTab = product ? (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    data-testid="img-product-main"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              {!isHandPicked && (product as ProductPick).additional_images && (product as ProductPick).additional_images!.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {(product as ProductPick).additional_images!.slice(0, 4).map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                      <img
                        src={img}
                        alt={`${product.title} ${i + 1}`}
                        className="w-full h-full object-cover"
                        data-testid={`img-product-additional-${i}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-base">Pricing & Profit</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {isHandPicked ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <InlineEditField
                    label="Profit Margin (%)"
                    value={String((product as HandPickedProduct).profit_margin)}
                    onSave={(v) => handleInlineSave("profit_margin", v)}
                    type="number"
                    disabled={!canEdit}
                    testId="field-profit-margin"
                  />
                  <InlineEditField
                    label="Potential Revenue"
                    value={String((product as HandPickedProduct).pot_revenue)}
                    onSave={(v) => handleInlineSave("pot_revenue", v)}
                    type="number"
                    disabled={!canEdit}
                    testId="field-pot-revenue"
                  />
                  {(product as HandPickedProduct).unlock_price !== null && (
                    <InlineEditField
                      label="Unlock Price"
                      value={String((product as HandPickedProduct).unlock_price ?? "")}
                      onSave={(v) => handleInlineSave("unlock_price", v)}
                      type="number"
                      disabled={!canEdit}
                      testId="field-unlock-price"
                    />
                  )}
                </div>
              ) : (() => {
                const pp = product as ProductPick
                const profit = pp.profit_per_order
                const margin = pp.sell_price > 0 ? ((profit / pp.sell_price) * 100).toFixed(1) : "0.0"
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <InlineEditField
                        label="Buy Price ($)"
                        value={String(pp.buy_price)}
                        onSave={(v) => handleInlineSave("buy_price", v)}
                        type="number"
                        disabled={!canEdit}
                        testId="field-buy-price"
                      />
                      <InlineEditField
                        label="Sell Price ($)"
                        value={String(pp.sell_price)}
                        onSave={(v) => handleInlineSave("sell_price", v)}
                        type="number"
                        disabled={!canEdit}
                        testId="field-sell-price"
                      />
                      <div className="space-y-1" data-testid="field-profit">
                        <p className="text-xs text-muted-foreground">Profit / Order</p>
                        <p className={`text-sm font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {currencyFormatter.format(profit)}
                        </p>
                      </div>
                      <div className="space-y-1" data-testid="field-margin">
                        <p className="text-xs text-muted-foreground">Margin</p>
                        <p className={`text-sm font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {margin}%
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Profit Breakdown</p>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                          data={[
                            { name: 'Buy Price', value: pp.buy_price, fill: '#3b82f6' },
                            { name: 'Profit', value: profit, fill: '#10b981' },
                            { name: 'Sell Price', value: pp.sell_price, fill: '#6366f1' },
                          ]}
                          barSize={50}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, '']} />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {[0, 1, 2].map((i) => (
                              <Cell key={i} fill={['#3b82f6', '#10b981', '#6366f1'][i]} />
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

          <Card>
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-base">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              <InlineEditField
                label="Title"
                value={product.title}
                onSave={(v) => handleInlineSave("title", v)}
                disabled={!canEdit}
                testId="field-title"
              />
              <InlineEditField
                label="Description"
                value={product.description || ""}
                onSave={(v) => handleInlineSave("description", v)}
                type="textarea"
                disabled={!canEdit}
                testId="field-description"
              />
              <InlineEditField
                label="Image URL"
                value={product.image || ""}
                onSave={(v) => handleInlineSave("image", v)}
                disabled={!canEdit}
                testId="field-image"
              />

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div data-testid="field-product-id">
                  <p className="text-xs text-muted-foreground">Product ID</p>
                  <p className="text-sm font-mono truncate">{product.id}</p>
                </div>
                <div data-testid="field-category">
                  <p className="text-xs text-muted-foreground">Category</p>
                  <Badge variant="outline">{product.category.replace(/-/g, " ")}</Badge>
                </div>
                {isHandPicked && (
                  <div data-testid="field-found-date">
                    <p className="text-xs text-muted-foreground">Found Date</p>
                    <p className="text-sm">{format(new Date((product as HandPickedProduct).found_date), "MMM dd, yyyy")}</p>
                  </div>
                )}
                {!isHandPicked && (product as ProductPick).rating && (
                  <div data-testid="field-rating-display">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{(product as ProductPick).rating?.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({(product as ProductPick).reviews_count} reviews)</span>
                    </div>
                  </div>
                )}
                <div data-testid="field-created-at">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm">{format(new Date(product.created_at), "MMM dd, yyyy")}</p>
                </div>
                <div data-testid="field-updated-at">
                  <p className="text-xs text-muted-foreground">Updated</p>
                  <p className="text-sm">{format(new Date(product.updated_at), "MMM dd, yyyy HH:mm")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {((isHandPicked && (product as HandPickedProduct).supplier_info) ||
            (!isHandPicked && (product as ProductPick).supplier)) && (
            <Card>
              <CardHeader className="pb-2 px-4 pt-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Supplier Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {isHandPicked && (product as HandPickedProduct).supplier_info ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div data-testid="field-supplier-name">
                      <p className="text-xs text-muted-foreground">Supplier Name</p>
                      <p className="text-sm font-medium">{(product as HandPickedProduct).supplier_info?.name || "N/A"}</p>
                    </div>
                    {(product as HandPickedProduct).supplier_info?.company_name && (
                      <div data-testid="field-supplier-company">
                        <p className="text-xs text-muted-foreground">Company</p>
                        <p className="text-sm">{(product as HandPickedProduct).supplier_info?.company_name}</p>
                      </div>
                    )}
                  </div>
                ) : (product as ProductPick).supplier ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div data-testid="field-supplier-name">
                        <p className="text-xs text-muted-foreground">Supplier Name</p>
                        <p className="text-sm font-medium">{(product as ProductPick).supplier?.name}</p>
                      </div>
                      {(product as ProductPick).supplier?.company_name && (
                        <div data-testid="field-supplier-company">
                          <p className="text-xs text-muted-foreground">Company</p>
                          <p className="text-sm">{(product as ProductPick).supplier?.company_name}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const pp = product as ProductPick
                        if (pp.supplier_id) router.push(`/admin/suppliers/${pp.supplier_id}`)
                      }}
                      data-testid="button-view-supplier"
                    >
                      <Building className="h-3.5 w-3.5 mr-1.5" />
                      View Supplier Details
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {isHandPicked && (product as HandPickedProduct).filters && (product as HandPickedProduct).filters!.length > 0 && (
            <Card>
              <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-base">Filters / Tags</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  {(product as HandPickedProduct).filters!.map((filter, idx) => (
                    <Badge key={idx} variant="secondary" data-testid={`badge-filter-${idx}`}>
                      {filter}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {isHandPicked && (product as HandPickedProduct).detailed_analysis && (
            <Card>
              <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-base">Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-sm whitespace-pre-wrap" data-testid="text-analysis">
                  {(product as HandPickedProduct).detailed_analysis}
                </p>
              </CardContent>
            </Card>
          )}

          {!isHandPicked && (product as ProductPick).specifications && Object.keys((product as ProductPick).specifications!).length > 0 && (
            <Card>
              <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-base">Specifications</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-2">
                  {Object.entries((product as ProductPick).specifications!).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start py-2 border-b last:border-0" data-testid={`spec-${key}`}>
                      <span className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-sm font-medium text-right ml-4">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  ) : null

  const analyticsTab = product ? (
    <div className="space-y-6">
      <AdminStatCards
        stats={[
          {
            label: "Views",
            value: "—",
            icon: Eye,
            description: "No tracking data yet",
          },
          {
            label: "Picks / Saves",
            value: "—",
            icon: Bookmark,
            description: "No tracking data yet",
          },
          {
            label: "Added",
            value: format(new Date(product.created_at), "MMM dd, yyyy"),
            icon: Calendar,
          },
          ...(isHandPicked ? [{
            label: "Profit Margin",
            value: `${(product as HandPickedProduct).profit_margin}%`,
            icon: TrendingUp,
            badgeVariant: "success" as const,
          }] : [{
            label: "Profit / Order",
            value: currencyFormatter.format((product as ProductPick).profit_per_order),
            icon: DollarSign,
            badgeVariant: "success" as const,
          }]),
        ]}
        columns={4}
      />

      {!isHandPicked && (product as ProductPick).trend_data && (product as ProductPick).trend_data!.length > 0 && (() => {
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
          <Card>
            <CardHeader className="pb-2 px-4 pt-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <CardTitle className="text-base">Trend Data</CardTitle>
                <div className="flex items-center gap-2">
                  <TrendingUp className={`h-4 w-4 ${isTrendingUp ? 'text-emerald-600' : 'text-red-500'}`} />
                  <span className="text-sm font-medium" data-testid="text-trend-change">
                    {isTrendingUp ? "Up" : "Down"} {pctChange}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
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
                <div className="rounded-lg border p-3" data-testid="stat-trend-min">
                  <p className="text-xs text-muted-foreground mb-1">Min</p>
                  <p className="text-lg font-bold">{minVal}</p>
                </div>
                <div className="rounded-lg border p-3" data-testid="stat-trend-max">
                  <p className="text-xs text-muted-foreground mb-1">Max</p>
                  <p className="text-lg font-bold">{maxVal}</p>
                </div>
                <div className="rounded-lg border p-3" data-testid="stat-trend-avg">
                  <p className="text-xs text-muted-foreground mb-1">Average</p>
                  <p className="text-lg font-bold">{avgVal.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })()}

      {!isHandPicked && (!(product as ProductPick).trend_data || (product as ProductPick).trend_data!.length === 0) && (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">No trend data available</p>
            <p className="text-xs text-muted-foreground">Trend analytics will appear here when data is available.</p>
          </CardContent>
        </Card>
      )}

      {isHandPicked && (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">Analytics Coming Soon</p>
            <p className="text-xs text-muted-foreground">View counts, pick counts, and user saves tracking will be available here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  ) : null

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      icon: <Package className="h-4 w-4" />,
      content: overviewTab,
    },
    {
      value: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      content: analyticsTab,
    },
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <AdminDetailLayout
        backHref="/admin/products"
        backLabel="Products"
        title={product?.title || "Loading..."}
        subtitle={product ? `${isHandPicked ? "Hand-Picked" : "Product Pick"} — ${product.category.replace(/-/g, " ")}` : ""}
        avatarUrl={product?.image || undefined}
        avatarFallback={product ? product.title.slice(0, 2).toUpperCase() : "PR"}
        badges={badges}
        actions={actions}
        primaryActions={primaryActions}
        tabs={tabs}
        defaultTab="overview"
        loading={loading}
        onPrev={prevProduct ? () => router.push(`/admin/products/${prevProduct.id}?type=${productType}`) : undefined}
        onNext={nextProduct ? () => router.push(`/admin/products/${nextProduct.id}?type=${productType}`) : undefined}
        hasPrev={!!prevProduct}
        hasNext={!!nextProduct}
      />

      {!isHandPicked && product && (
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
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BlueSpinner size="md" />
          <span>Loading product...</span>
        </div>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  )
}
