import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Edit,
  Trash2,
  ExternalLink,
  Store,
  TrendingUp,
  DollarSign,
  Globe,
  Package,
  Star,
  CheckCircle2,
} from "lucide-react"
import { CompetitorStore as CompetitorStoreType, CompetitorStoreProduct } from "@/types/competitor-stores"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { format } from "date-fns"
import { AdminDetailLayout } from "@/components/admin"
import { AdminStatCards } from "@/components/admin"

interface CompetitorStore {
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
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(amount)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(num)
}

export default function CompetitorStoreDetailPage() {
  const router = useRouter()
  const params = useParams()
  const storeId = params?.id as string
  const { showSuccess, showError } = useToast()

  const { hasPermission: canEdit } = useHasPermission("competitor_stores.edit")
  const { hasPermission: canDelete } = useHasPermission("competitor_stores.delete")
  const { hasPermission: canVerify } = useHasPermission("competitor_stores.verify")

  const [store, setStore] = useState<CompetitorStore | null>(null)
  const [products, setProducts] = useState<CompetitorStoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [allStores, setAllStores] = useState<CompetitorStore[]>([])

  const fetchStore = useCallback(async () => {
    if (!storeId) return
    try {
      setLoading(true)
      setError(null)
      const response = await apiFetch(`/api/admin/competitor-stores/${storeId}`, { credentials: 'include' })
      if (!response.ok) {
        if (response.status === 404) throw new Error("Store not found")
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch store")
      }
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
    } catch (err: any) {
      setError(err.message || "Failed to load store")
      showError(err.message || "Failed to load store")
    } finally { setLoading(false) }
  }, [storeId, showError])

  const fetchProducts = useCallback(async () => {
    if (!storeId) return
    try {
      const response = await apiFetch(`/api/admin/competitor-stores/${storeId}/products`, { credentials: 'include' })
      if (!response.ok) return
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) { console.error("Error fetching products:", err) }
  }, [storeId])

  const fetchAllStores = useCallback(async () => {
    try {
      const response = await apiFetch("/api/admin/competitor-stores?pageSize=1000", { credentials: 'include' })
      if (!response.ok) return
      const data = await response.json()
      setAllStores((data.stores || []).map((s: CompetitorStoreType) => ({
        id: s.id, name: s.name, url: s.url, logo: s.logo || undefined,
        category: s.category?.name || "Uncategorized", country: s.country || undefined,
        monthly_traffic: s.monthly_traffic, monthly_revenue: s.monthly_revenue,
        growth: s.growth, products_count: s.products_count || undefined,
        rating: s.rating || undefined, verified: s.verified,
        created_at: s.created_at, updated_at: s.updated_at,
      })))
    } catch (err) { console.error("Error fetching all stores:", err) }
  }, [])

  useEffect(() => { fetchStore(); fetchProducts(); fetchAllStores() }, [fetchStore, fetchProducts, fetchAllStores])

  const currentIndex = useMemo(() => allStores.findIndex(s => s.id === storeId), [allStores, storeId])
  const prevStore = currentIndex > 0 ? allStores[currentIndex - 1] : null
  const nextStore = currentIndex >= 0 && currentIndex < allStores.length - 1 ? allStores[currentIndex + 1] : null

  const confirmDelete = async () => {
    if (!store) return
    setActionLoading("delete")
    try {
      const response = await apiFetch(`/api/admin/competitor-stores/${store.id}`, { method: "DELETE", credentials: 'include' })
      if (!response.ok) throw new Error("Failed to delete store")
      showSuccess(`"${store.name}" deleted successfully`)
      router.push("/admin/competitor-stores")
    } catch (err: any) { showError(err.message || "Failed to delete store") }
    finally { setActionLoading(null); setDeleteConfirmOpen(false) }
  }

  const handleToggleVerify = async () => {
    if (!store) return
    setActionLoading("verify")
    try {
      const response = await apiFetch(`/api/admin/competitor-stores/${store.id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ verified: !store.verified })
      })
      if (!response.ok) throw new Error("Failed to update verification")
      const data = await response.json()
      setStore({ ...store, verified: data.store.verified })
      showSuccess(`Store ${!store.verified ? "verified" : "unverified"} successfully`)
    } catch (err: any) { showError(err.message || "Failed to update store") }
    finally { setActionLoading(null) }
  }

  if (loading) return <AdminDetailLayout backHref="/admin/competitor-stores" backLabel="Competitor Stores" title="" tabs={[]} loading />

  if (error || !store) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" data-testid="store-not-found">
        <Store className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Store not found</h3>
          <p className="text-muted-foreground mb-4">{error || "The store you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/admin/competitor-stores")} variant="outline" data-testid="back-to-stores">
            Back to Stores
          </Button>
        </div>
      </div>
    )
  }

  const metricStats = [
    { label: "Monthly Revenue", value: formatCurrency(store.monthly_revenue), icon: DollarSign, description: "Estimated monthly revenue" },
    { label: "Monthly Traffic", value: formatNumber(store.monthly_traffic), icon: Globe, description: "Monthly visitor count" },
    { label: "Growth", value: `${store.growth >= 0 ? "+" : ""}${store.growth.toFixed(1)}%`, icon: TrendingUp, badge: store.growth >= 0 ? "Growing" : "Declining", badgeVariant: (store.growth >= 0 ? "success" : "danger") as "success" | "danger" },
  ]

  const badges: React.ReactNode[] = [
    <Badge key="cat" variant="secondary" data-testid="badge-category">{store.category}</Badge>,
    store.verified && (
      <Badge key="ver" variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" data-testid="badge-verified">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    ),
    store.country && <Badge key="country" variant="outline" data-testid="badge-country">{store.country}</Badge>,
    store.rating && (
      <Badge key="rating" variant="outline" className="flex items-center gap-1" data-testid="badge-rating">
        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        {store.rating.toFixed(1)}
      </Badge>
    ),
  ].filter(Boolean) as React.ReactNode[]

  const actions = [
    { label: "Visit Store", icon: <ExternalLink className="h-4 w-4" />, onClick: () => { const u = store.url.startsWith("http") ? store.url : `https://${store.url}`; window.open(u, "_blank", "noopener,noreferrer") } },
    ...(canVerify ? [{ label: store.verified ? "Unverify" : "Verify", icon: <CheckCircle2 className="h-4 w-4" />, onClick: handleToggleVerify, disabled: actionLoading === "verify" }] : []),
    { label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: () => setDeleteConfirmOpen(true), variant: "destructive" as const, separator: true, disabled: !canDelete },
  ]

  const overviewTab = (
    <div className="space-y-6">
      <AdminStatCards stats={metricStats} columns={3} />

      <Card>
        <CardHeader>
          <CardTitle>Store Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">URL</p>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <a
                  href={store.url.startsWith("http") ? store.url : `https://${store.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                  data-testid="link-store-url"
                >
                  {store.url}
                </a>
              </div>
            </div>
            {store.products_count !== undefined && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Products Count</p>
                <p className="text-sm" data-testid="text-product-count">{formatNumber(store.products_count)}</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Created</p>
              <p className="text-sm" data-testid="text-created-date">{format(new Date(store.created_at), "PPp")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
              <p className="text-sm" data-testid="text-updated-date">{format(new Date(store.updated_at), "PPp")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const productsTab = (
    <Card>
      <CardHeader>
        <CardTitle>Linked Products</CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8" data-testid="empty-products">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No products linked to this store yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map(product => (
              <div key={product.id} className="flex items-center gap-3 p-3 border rounded-md" data-testid={`product-row-${product.id}`}>
                {product.product && (
                  <>
                    <img
                      src={product.product.image}
                      alt={product.product.title}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Discovered {format(new Date(product.discovered_at), "PP")}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/products/${product.product_id}`)}
                      data-testid={`link-product-${product.product_id}`}
                    >
                      View Product
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const tabs = [
    { value: "overview", label: "Overview", icon: <Store className="h-4 w-4" />, content: overviewTab },
    { value: "products", label: "Products", icon: <Package className="h-4 w-4" />, count: products.length, content: productsTab },
  ]

  return (
    <>
      <AdminDetailLayout
        backHref="/admin/competitor-stores"
        backLabel="Competitor Stores"
        title={store.name}
        subtitle={store.url}
        avatarUrl={store.logo}
        avatarFallback={store.name.substring(0, 2).toUpperCase()}
        badges={badges}
        actions={actions}
        primaryActions={
          canEdit ? (
            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/competitor-stores?edit=${storeId}`)} data-testid="button-edit">
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
          ) : undefined
        }
        tabs={tabs}
        defaultTab="overview"
        onPrev={prevStore ? () => router.push(`/admin/competitor-stores/${prevStore.id}`) : undefined}
        onNext={nextStore ? () => router.push(`/admin/competitor-stores/${nextStore.id}`) : undefined}
        hasPrev={!!prevStore}
        hasNext={!!nextStore}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Store</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{store.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"} data-testid="confirm-delete">
              {actionLoading === "delete" ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
