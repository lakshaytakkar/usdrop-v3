import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, ExternalLink, Store, TrendingUp, DollarSign, Globe, Package, CheckCircle2, Star } from "lucide-react"
import { CompetitorStore as CompetitorStoreType, CompetitorStoreProduct } from "@/types/competitor-stores"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import {
  PageShell,
  PageHeader,
  DetailSection,
  InfoRow,
  StatusBadge,
  SectionGrid,
  SectionCard,
  StatCard,
  StatGrid,
} from "@/components/admin-shared"

interface StoreDetail {
  id: string
  name: string
  url: string
  logo?: string
  category: string
  country?: string
  monthly_traffic: number
  monthly_revenue: number | null
  growth: number
  products_count?: number
  rating?: number
  verified: boolean
  created_at: string
  updated_at: string
}

const formatCurrency = (amount: number | null) => {
  if (!amount) return "N/A"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

const formatNumber = (num: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(num)

export default function CompetitorStoreDetailPage() {
  const router = useRouter()
  const params = useParams()
  const storeId = params?.id as string
  const { showSuccess, showError } = useToast()

  const [store, setStore] = useState<StoreDetail | null>(null)
  const [products, setProducts] = useState<CompetitorStoreProduct[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStore = useCallback(async () => {
    if (!storeId) return
    try {
      setLoading(true)
      const response = await apiFetch(`/api/admin/competitor-stores/${storeId}`, { credentials: 'include' })
      if (!response.ok) throw new Error("Store not found")
      const data = await response.json()
      const s = data.store as CompetitorStoreType
      setStore({
        id: s.id, name: s.name, url: s.url, logo: s.logo || undefined,
        category: s.category?.name || "Uncategorized", country: s.country || undefined,
        monthly_traffic: s.monthly_traffic, monthly_revenue: s.monthly_revenue,
        growth: s.growth, products_count: s.products_count || undefined,
        rating: s.rating || undefined, verified: s.verified,
        created_at: s.created_at, updated_at: s.updated_at,
      })
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load store")
    } finally { setLoading(false) }
  }, [storeId, showError])

  const fetchProducts = useCallback(async () => {
    if (!storeId) return
    try {
      const response = await apiFetch(`/api/admin/competitor-stores/${storeId}/products`, { credentials: 'include' })
      if (!response.ok) return
      const data = await response.json()
      setProducts(data.products || [])
    } catch { }
  }, [storeId])

  useEffect(() => { fetchStore(); fetchProducts() }, [fetchStore, fetchProducts])

  const handleDelete = async () => {
    if (!store) return
    try {
      const response = await apiFetch(`/api/admin/competitor-stores/${store.id}`, { method: "DELETE", credentials: 'include' })
      if (!response.ok) throw new Error("Failed to delete store")
      showSuccess(`"${store.name}" deleted`)
      router.push("/admin/competitor-stores")
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete store")
    }
  }

  const handleToggleVerify = async () => {
    if (!store) return
    try {
      const response = await apiFetch(`/api/admin/competitor-stores/${store.id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ verified: !store.verified }),
      })
      if (!response.ok) throw new Error("Failed to update verification")
      showSuccess(`Store ${!store.verified ? "verified" : "unverified"}`)
      fetchStore()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update store")
    }
  }

  if (loading) {
    return (
      <PageShell>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </PageShell>
    )
  }

  if (!store) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-12 gap-4" data-testid="store-not-found">
          <Store className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Store not found</p>
          <Button onClick={() => router.push("/admin/competitor-stores")} variant="outline" data-testid="back-to-stores">
            Back to Stores
          </Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/competitor-stores")} data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Competitor Stores
        </Button>
      </div>

      <PageHeader
        title={store.name}
        subtitle={store.url}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => { const u = store.url.startsWith("http") ? store.url : `https://${store.url}`; window.open(u, "_blank", "noopener,noreferrer") }} data-testid="button-visit">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Visit Store
            </Button>
            <Button variant="outline" size="sm" onClick={handleToggleVerify} data-testid="button-verify">
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              {store.verified ? "Unverify" : "Verify"}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} data-testid="button-delete">
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={store.category} variant="neutral" />
        {store.verified && <StatusBadge status="Verified" />}
        {store.country && <StatusBadge status={store.country} variant="neutral" />}
        {store.rating && <StatusBadge status={`${store.rating.toFixed(1)} rating`} variant="info" />}
      </div>

      <StatGrid>
        <StatCard label="Monthly Revenue" value={formatCurrency(store.monthly_revenue)} icon={DollarSign} />
        <StatCard label="Monthly Traffic" value={formatNumber(store.monthly_traffic)} icon={Globe} />
        <StatCard label="Growth" value={`${store.growth >= 0 ? "+" : ""}${store.growth.toFixed(1)}%`} icon={TrendingUp} trend={store.growth >= 0 ? "Growing" : "Declining"} />
      </StatGrid>

      <SectionGrid>
        <DetailSection title="Store Details">
          <InfoRow label="URL">
            <a href={store.url.startsWith("http") ? store.url : `https://${store.url}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-1" data-testid="link-store-url">
              {store.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </InfoRow>
          <InfoRow label="Category" value={store.category} />
          {store.country && <InfoRow label="Country" value={store.country} />}
          {store.products_count !== undefined && <InfoRow label="Products" value={formatNumber(store.products_count)} />}
          <InfoRow label="Verified">
            <StatusBadge status={store.verified ? "Verified" : "Unverified"} />
          </InfoRow>
          <InfoRow label="Created" value={format(new Date(store.created_at), "PPp")} />
          <InfoRow label="Updated" value={format(new Date(store.updated_at), "PPp")} />
        </DetailSection>

        <SectionCard title={`Linked Products (${products.length})`}>
          {products.length === 0 ? (
            <div className="text-center py-8" data-testid="empty-products">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No products linked to this store yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {products.map(product => (
                <div key={product.id} className="flex items-center gap-3 p-3 border rounded-md" data-testid={`product-row-${product.id}`}>
                  {product.product && (
                    <>
                      <img src={product.product.image} alt={product.product.title} className="h-12 w-12 rounded-md object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.product.title}</p>
                        <p className="text-xs text-muted-foreground">Discovered {format(new Date(product.discovered_at), "PP")}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => router.push(`/admin/products/${product.product_id}`)} data-testid={`link-product-${product.product_id}`}>
                        View
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </SectionGrid>
    </PageShell>
  )
}
