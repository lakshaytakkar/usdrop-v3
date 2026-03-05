import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { apiFetch } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Package,
  Trash2,
  Star,
  Building,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  PageShell,
  PageHeader,
  DetailSection,
  InfoRow,
  StatCard,
  StatGrid,
  StatusBadge,
} from "@/components/admin-shared"
import { Product } from "@/types/products"
import { format } from "date-fns"

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string
  const { showSuccess, showError } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProduct = useCallback(async () => {
    if (!productId || productId === "undefined") {
      showError("Invalid product ID")
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const response = await apiFetch(`/api/admin/products/${productId}`)
      if (!response.ok) throw new Error("Failed to fetch product")
      const data = await response.json()
      setProduct(data.product)
    } catch {
      showError("Failed to load product")
    } finally {
      setLoading(false)
    }
  }, [productId, showError])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const handleDelete = async () => {
    if (!product) return
    if (!confirm(`Delete "${product.title}"? This cannot be undone.`)) return
    try {
      const response = await apiFetch(`/api/admin/products/${product.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete product")
      showSuccess("Product deleted successfully")
      router.push("/admin/products")
    } catch {
      showError("Failed to delete product")
    }
  }

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return "$0.00"
    return `$${Number(price).toFixed(2)}`
  }

  if (loading) {
    return (
      <PageShell>
        <div className="space-y-4">
          <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
          <div className="h-6 w-72 bg-muted/50 rounded animate-pulse" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-muted/50 rounded-lg animate-pulse" />
        </div>
      </PageShell>
    )
  }

  if (!product) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-16" data-testid="text-product-not-found">
          <Package className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Product not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/products")} data-testid="button-back-products">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Products
          </Button>
        </div>
      </PageShell>
    )
  }

  const isWinning = product.metadata?.is_winning ?? false
  const isLocked = product.metadata?.is_locked ?? false
  const profit = product.profit_per_order || 0
  const margin = product.sell_price > 0 ? ((profit / product.sell_price) * 100).toFixed(1) : "0.0"

  return (
    <PageShell>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/products")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Back to Products</span>
      </div>

      <PageHeader
        title={product.title}
        subtitle={product.category?.name || "Uncategorized"}
        actions={
          <div className="flex items-center gap-2">
            {isWinning && <StatusBadge status="Winning" variant="success" />}
            {isLocked && <StatusBadge status="Locked" variant="warning" />}
            <Button
              variant="destructive"
              onClick={handleDelete}
              data-testid="button-delete-product"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          </div>
        }
      />

      <StatGrid>
        <StatCard
          label="Buy Price"
          value={formatPrice(product.buy_price)}
          icon={DollarSign}
        />
        <StatCard
          label="Sell Price"
          value={formatPrice(product.sell_price)}
          icon={DollarSign}
          iconBg="rgba(99, 102, 241, 0.1)"
          iconColor="#6366f1"
        />
        <StatCard
          label="Profit"
          value={formatPrice(profit)}
          icon={TrendingUp}
          iconBg="rgba(16, 185, 129, 0.1)"
          iconColor="#10b981"
          trend={`${margin}% margin`}
        />
        <StatCard
          label="Rating"
          value={product.rating ? `${product.rating.toFixed(1)} / 5` : "N/A"}
          icon={Star}
          iconBg="rgba(245, 158, 11, 0.1)"
          iconColor="#f59e0b"
          trend={product.reviews_count > 0 ? `${product.reviews_count} reviews` : undefined}
        />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg border bg-background overflow-hidden">
            <div className="relative w-full aspect-square bg-muted">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  data-testid="img-product-main"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            {product.additional_images && product.additional_images.length > 0 && (
              <div className="grid grid-cols-4 gap-1 p-2">
                {product.additional_images.slice(0, 4).map((img, i) => (
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
          </div>

          {product.metadata?.filters && product.metadata.filters.length > 0 && (
            <DetailSection title="Tags">
              <div className="flex flex-wrap gap-2 py-3">
                {product.metadata.filters.map((filter, idx) => (
                  <Badge key={idx} variant="secondary" data-testid={`badge-filter-${idx}`}>
                    {filter}
                  </Badge>
                ))}
              </div>
            </DetailSection>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <DetailSection title="Product Details">
            <InfoRow label="Title" value={product.title} />
            <InfoRow label="Category" value={product.category?.name || "Uncategorized"} />
            <InfoRow label="Product ID">
              <span className="text-sm font-mono">{product.id}</span>
            </InfoRow>
            <InfoRow label="Created" value={format(new Date(product.created_at), "MMM dd, yyyy")} />
            <InfoRow label="Updated" value={format(new Date(product.updated_at), "MMM dd, yyyy HH:mm")} />
          </DetailSection>

          <DetailSection title="Pricing">
            <InfoRow label="Buy Price" value={formatPrice(product.buy_price)} />
            <InfoRow label="Sell Price" value={formatPrice(product.sell_price)} />
            <InfoRow label="Profit per Order">
              <span className={`text-sm font-medium ${profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                {formatPrice(profit)}
              </span>
            </InfoRow>
            <InfoRow label="Margin">
              <span className={`text-sm font-medium ${profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                {margin}%
              </span>
            </InfoRow>
          </DetailSection>

          {product.description && (
            <DetailSection title="Description">
              <div className="py-3">
                <p className="text-sm whitespace-pre-wrap" data-testid="text-description">{product.description}</p>
              </div>
            </DetailSection>
          )}

          {product.supplier && (
            <DetailSection title="Supplier">
              <InfoRow label="Supplier Name" value={product.supplier.name} />
              {product.supplier.company_name && (
                <InfoRow label="Company" value={product.supplier.company_name} />
              )}
              <div className="py-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (product.supplier_id) router.push(`/admin/suppliers/${product.supplier_id}`)
                  }}
                  data-testid="button-view-supplier"
                >
                  <Building className="h-3.5 w-3.5 mr-1.5" />
                  View Supplier Details
                </Button>
              </div>
            </DetailSection>
          )}

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <DetailSection title="Specifications">
              {Object.entries(product.specifications).map(([key, value]) => (
                <InfoRow
                  key={key}
                  label={key.replace(/([A-Z])/g, " $1").trim()}
                  value={String(value)}
                />
              ))}
            </DetailSection>
          )}

          {product.metadata?.detailed_analysis && (
            <DetailSection title="Detailed Analysis">
              <div className="py-3">
                <p className="text-sm whitespace-pre-wrap" data-testid="text-analysis">
                  {product.metadata.detailed_analysis}
                </p>
              </div>
            </DetailSection>
          )}

          <DetailSection title="Metadata">
            <InfoRow label="Winning">
              <StatusBadge status={isWinning ? "Yes" : "No"} />
            </InfoRow>
            <InfoRow label="Locked">
              <StatusBadge status={isLocked ? "Yes" : "No"} />
            </InfoRow>
            <InfoRow label="Trending">
              <StatusBadge status={product.metadata?.is_trending ? "Yes" : "No"} />
            </InfoRow>
            {product.rating !== null && product.rating !== undefined && (
              <InfoRow label="Rating">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews_count} reviews)</span>
                </div>
              </InfoRow>
            )}
            {product.source && (
              <InfoRow label="Source Type" value={product.source.source_type.replace(/_/g, " ")} />
            )}
          </DetailSection>
        </div>
      </div>
    </PageShell>
  )
}
