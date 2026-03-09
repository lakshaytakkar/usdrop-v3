

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "@/hooks/use-router"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight } from "lucide-react"
import { Link } from "wouter"

import { ConnectStoreModal } from "./components/connect-store-modal"
import { StoreList } from "./components/store-list"
import { ShopifyStore } from "./data/stores"
import { useToast } from "@/hooks/use-toast"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { FrameworkBanner } from "@/components/framework-banner"

function ShopifyStoresContent() {
  const { showSuccess, showError } = useToast()
  const [searchParams] = useSearchParams()
  const [stores, setStores] = useState<ShopifyStore[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [oauthHandled, setOauthHandled] = useState(false)

  useEffect(() => {
    if (oauthHandled) return
    const success = searchParams?.get('success')
    const errorParam = searchParams?.get('error')
    
    if (success) {
      setOauthHandled(true)
      showSuccess('Store connected successfully!')
      window.history.replaceState({}, '', '/framework/my-store')
    }
    if (errorParam) {
      setOauthHandled(true)
      showError(`Failed to connect store: ${errorParam}`)
      window.history.replaceState({}, '', '/framework/my-store')
    }
  }, [searchParams, showSuccess, showError, oauthHandled])

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiFetch("/api/shopify-stores", {
        credentials: 'include',
      })
      
      if (response.status === 401) {
        // User is not authenticated - show empty state
        setStores([])
        setError(null)
        return
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch stores")
      }
      
      const data = await response.json()
      const storesData: ShopifyStore[] = (data.stores || []).map((store: any) => ({
        ...store,
        connected_at: store.connected_at || new Date().toISOString(),
        last_synced_at: store.last_synced_at,
        created_at: store.created_at,
        updated_at: store.updated_at,
      }))
      
      setStores(storesData)
    } catch (err) {
      console.error("Error fetching stores:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load stores"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  const handleStoreAdded = () => {
    // Reload stores
    fetchStores()
  }

  return (
    <>
        <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2">
          <FrameworkBanner
            title="My Store"
            description="Manage your connected Shopify stores and track performance"
            iconSrc="/images/banners/3d-store.png"
            tutorialVideoUrl=""
          />
          <div>

          {loading ? (
            <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
              <BlueSpinner size="lg" label="Loading your stores..." />
            </div>
          ) : stores.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative w-24 h-24 mb-6">
                  <img
                    src="/images/logos/shopify.svg"
                    alt="Shopify logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="ds-page-title mb-2">No Stores Connected</h2>
                <p className="ds-body mb-8 max-w-md">
                  Connect your Shopify stores to start tracking and analyzing your performance.
                </p>
                <Button onClick={() => setIsModalOpen(true)} size="lg" data-testid="button-connect-store">
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Store
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {stores.length} {stores.length === 1 ? "store" : "stores"} connected
                </p>
              </div>

              <StoreList stores={stores} onStoresChange={handleStoreAdded} />
            </>
          )}

          <ConnectStoreModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onStoreAdded={handleStoreAdded}
          />

          <div
            className="rounded-2xl overflow-hidden relative mt-2"
            style={{
              background: 'linear-gradient(135deg, #0d9e5f 0%, #15803d 40%, #166534 70%, #14532d 100%)',
            }}
            data-testid="banner-shopify-dev"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/[0.04]" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/[0.06]" />
              <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/[0.03]" />
            </div>

            <div className="relative z-[1] flex flex-col md:flex-row items-center gap-6 px-8 py-8 md:py-10">
              <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <img src="/images/logos/shopify.svg" alt="Shopify" className="h-8 w-8 md:h-10 md:w-10 object-contain brightness-0 invert" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-[10px] font-bold text-black uppercase tracking-wider mb-2 shadow-sm">
                  Included in Elite Plan
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5">
                  Need a Professional Shopify Store?
                </h3>
                <p className="text-sm text-white/70 max-w-lg">
                  Get a fully designed, conversion-optimized Shopify store built for you. Included with the Elite LLC formation plan — no extra cost.
                </p>
              </div>

              <Link
                href="/llc"
                className="shrink-0 inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-white text-green-700 hover:bg-white/90 text-sm font-bold transition-all shadow-lg shadow-black/10 cursor-pointer whitespace-nowrap"
                data-testid="button-view-elite-plan"
              >
                View Elite Plan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          </div>
        </div>
    </>
  )
}

export default function ShopifyStoresPage() {
  return (
    <Suspense fallback={
      <>
          <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0">
            <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
              <BlueSpinner size="lg" label="Loading your stores..." />
            </div>
          </div>
      </>
    }>
      <ShopifyStoresContent />
    </Suspense>
  )
}
