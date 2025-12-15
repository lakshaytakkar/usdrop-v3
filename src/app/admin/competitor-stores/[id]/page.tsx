"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  MoreVertical,
  Trash2,
  ExternalLink,
  Store,
  TrendingUp,
  DollarSign,
  Globe,
  Package,
  Star,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { CompetitorStore as CompetitorStoreType } from "@/types/competitor-stores"
import { CompetitorStoreProduct } from "@/types/competitor-stores"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { format } from "date-fns"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

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
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(num)
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
      
      const response = await fetch(`/api/admin/competitor-stores/${storeId}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Store not found")
        }
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch store")
      }

      const data = await response.json()
      const storeData = data.store as CompetitorStoreType
      
      // Transform to UI format
      const transformedStore: CompetitorStore = {
        id: storeData.id,
        name: storeData.name,
        url: storeData.url,
        logo: storeData.logo || undefined,
        category: storeData.category?.name || "Uncategorized",
        country: storeData.country || undefined,
        monthly_traffic: storeData.monthly_traffic,
        monthly_revenue: storeData.monthly_revenue,
        growth: storeData.growth,
        products_count: storeData.products_count || undefined,
        rating: storeData.rating || undefined,
        verified: storeData.verified,
        created_at: storeData.created_at,
        updated_at: storeData.updated_at,
      }
      
      setStore(transformedStore)
    } catch (err: any) {
      console.error("Error fetching store:", err)
      setError(err.message || "Failed to load store")
      showError(err.message || "Failed to load store")
    } finally {
      setLoading(false)
    }
  }, [storeId, showError])

  const fetchProducts = useCallback(async () => {
    if (!storeId) return
    
    try {
      const response = await fetch(`/api/admin/competitor-stores/${storeId}/products`, {
        credentials: 'include'
      })

      if (!response.ok) {
        console.error("Failed to fetch products")
        return
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error("Error fetching products:", err)
    }
  }, [storeId])

  const fetchAllStores = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/competitor-stores?pageSize=1000", {
        credentials: 'include'
      })

      if (!response.ok) return

      const data = await response.json()
      const transformedStores: CompetitorStore[] = (data.stores || []).map((s: CompetitorStoreType) => ({
        id: s.id,
        name: s.name,
        url: s.url,
        logo: s.logo || undefined,
        category: s.category?.name || "Uncategorized",
        country: s.country || undefined,
        monthly_traffic: s.monthly_traffic,
        monthly_revenue: s.monthly_revenue,
        growth: s.growth,
        products_count: s.products_count || undefined,
        rating: s.rating || undefined,
        verified: s.verified,
        created_at: s.created_at,
        updated_at: s.updated_at,
      }))
      
      setAllStores(transformedStores)
    } catch (err) {
      console.error("Error fetching all stores:", err)
    }
  }, [])

  useEffect(() => {
    fetchStore()
    fetchProducts()
    fetchAllStores()
  }, [fetchStore, fetchProducts, fetchAllStores])

  const currentIndex = useMemo(() => {
    return allStores.findIndex(s => s.id === storeId)
  }, [allStores, storeId])

  const prevStore = useMemo(() => {
    return currentIndex > 0 ? allStores[currentIndex - 1] : null
  }, [allStores, currentIndex])

  const nextStore = useMemo(() => {
    return currentIndex >= 0 && currentIndex < allStores.length - 1 ? allStores[currentIndex + 1] : null
  }, [allStores, currentIndex])

  const handleEdit = useCallback(() => {
    router.push(`/admin/competitor-stores?edit=${storeId}`)
  }, [router, storeId])

  const handleDelete = useCallback(() => {
    setDeleteConfirmOpen(true)
  }, [])

  const confirmDelete = async () => {
    if (!store) return
    
    setActionLoading("delete")
    try {
      const response = await fetch(`/api/admin/competitor-stores/${store.id}`, {
        method: "DELETE",
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete store")
      }

      showSuccess(`Store "${store.name}" deleted successfully`)
      router.push("/admin/competitor-stores")
    } catch (err: any) {
      showError(err.message || "Failed to delete store")
    } finally {
      setActionLoading(null)
      setDeleteConfirmOpen(false)
    }
  }

  const handleToggleVerify = async () => {
    if (!store) return
    
    setActionLoading("verify")
    try {
      const response = await fetch(`/api/admin/competitor-stores/${store.id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ verified: !store.verified })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update verification status")
      }

      const data = await response.json()
      const storeData = data.store as CompetitorStoreType
      
      setStore({
        ...store,
        verified: storeData.verified,
      })
      
      showSuccess(`Store ${!store.verified ? "verified" : "unverified"} successfully`)
    } catch (err: any) {
      showError(err.message || "Failed to update store")
    } finally {
      setActionLoading(null)
    }
  }

  const handleVisitStore = useCallback(() => {
    if (!store) return
    const url = store.url.startsWith("http") ? store.url : `https://${store.url}`
    window.open(url, "_blank", "noopener,noreferrer")
  }, [store])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Store className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Store not found</h3>
          <p className="text-muted-foreground mb-4">{error || "The store you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/admin/competitor-stores")} variant="outline">
            Back to Stores
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background px-4 py-2">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/admin/competitor-stores" className="hover:text-foreground transition-colors whitespace-nowrap cursor-pointer">
              Competitor Stores
            </Link>
            <span>/</span>
            <span className="line-clamp-1">{store.name}</span>
          </nav>

          {/* Prev/Next Navigation */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {prevStore && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/competitor-stores/${prevStore.id}`)}
                className="cursor-pointer h-7 px-2 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Prev
              </Button>
            )}
            {nextStore && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/competitor-stores/${nextStore.id}`)}
                className="cursor-pointer h-7 px-2 text-xs"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Store Header */}
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarImage src={store.logo} alt={store.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {store.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-xl">{store.name}</CardTitle>
                    {store.verified && (
                      <CheckCircle2 className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{store.category}</Badge>
                    {store.country && (
                      <Badge variant="outline">{store.country}</Badge>
                    )}
                    {store.rating && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {store.rating.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
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
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleVisitStore} className="cursor-pointer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Store
                    </DropdownMenuItem>
                    {canVerify && (
                      <DropdownMenuItem onClick={handleToggleVerify} className="cursor-pointer" disabled={actionLoading === "verify"}>
                        {store.verified ? "Unverify" : "Verify"}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {canDelete && (
                      <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <TabsList>
            <TabsTrigger value="overview">
              <Store className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products ({products.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="overview" className="mt-0 space-y-4">
              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      <span className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(store.monthly_revenue)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Traffic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span className="text-2xl font-bold">
                        {formatNumber(store.monthly_traffic)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-emerald-600">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-2xl font-bold">
                        +{store.growth.toFixed(1)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Details */}
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
                        >
                          {store.url}
                        </a>
                      </div>
                    </div>
                    {store.products_count !== undefined && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Products Count</p>
                        <p className="text-sm">{formatNumber(store.products_count)}</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Created</p>
                      <p className="text-sm">{format(new Date(store.created_at), "PPp")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
                      <p className="text-sm">{format(new Date(store.updated_at), "PPp")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Linked Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {products.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No products linked to this store yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          {product.product && (
                            <>
                              <img
                                src={product.product.image}
                                alt={product.product.title}
                                className="h-12 w-12 rounded object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{product.product.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  Discovered {format(new Date(product.discovered_at), "PP")}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/products/${product.product_id}`)}
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
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Store</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{store.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"}>
              {actionLoading === "delete" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

