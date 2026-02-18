

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "@/hooks/use-router"
import { ExternalLayout } from "@/components/layout/external-layout"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { ConnectStoreModal } from "./components/connect-store-modal"
import { StoreList } from "./components/store-list"
import { ShopifyStore } from "./data/stores"
import { useToast } from "@/hooks/use-toast"
import Loader from "@/components/kokonutui/loader"

function ShopifyStoresContent() {
  const { showSuccess, showError } = useToast()
  const searchParams = useSearchParams()
  const [stores, setStores] = useState<ShopifyStore[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for OAuth callback success/error
  useEffect(() => {
    const success = searchParams?.get('success')
    const errorParam = searchParams?.get('error')
    
    if (success) {
      showSuccess('Store connected successfully!')
      // Refresh stores
      fetchStores()
    }
    if (errorParam) {
      showError(`Failed to connect store: ${errorParam}`)
    }
  }, [searchParams, showSuccess, showError])

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
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  const handleStoreAdded = () => {
    // Reload stores
    fetchStores()
  }

  return (
    <ExternalLayout>
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
          <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
            <h1 className="text-2xl font-bold">My Shopify Stores</h1>
            <p className="text-sm text-blue-100 mt-1">Connect and manage your Shopify stores</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
              <Loader 
                title="Loading your stores..." 
                subtitle="Fetching your connected Shopify stores"
                size="md"
              />
            </div>
          ) : stores.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative w-24 h-24 mb-6">
                  <img
                    src="/images/logos/shopify.svg"
                    alt="Shopify logo"
                   
                    className="object-contain"
                  />
                </div>
                <h2 className="text-2xl font-semibold mb-2">No Stores Connected</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Connect your Shopify stores to start tracking and analyzing your performance.
                </p>
                <Button onClick={() => setIsModalOpen(true)} size="lg">
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

          {/* Onboarding Progress Overlay */}
          <OnboardingProgressOverlay pageName="My Shopify Stores" />
        </div>
    </ExternalLayout>
  )
}

export default function ShopifyStoresPage() {
  return (
    <Suspense fallback={
      <ExternalLayout>
          <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0">
            <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
              <Loader
                title="Loading your stores..."
                subtitle="Fetching your connected Shopify stores"
                size="md"
              />
            </div>
          </div>
      </ExternalLayout>
    }>
      <ShopifyStoresContent />
    </Suspense>
  )
}
