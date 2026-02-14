"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Image from "next/image"
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
      
      // Add deliberate delay for enhanced UX (1-2 seconds)
      const [response] = await Promise.all([
        fetch("/api/shopify-stores", {
          credentials: 'include', // Include cookies for authentication
        }),
        new Promise(resolve => setTimeout(resolve, 1500))
      ])
      
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
          {/* Premium Banner with grainy gradient */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-800 p-3 text-white h-[154px] flex-shrink-0">
            {/* Enhanced grainy texture layers */}
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                opacity: 0.5,
                mixBlendMode: 'overlay'
              }}
            ></div>
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
                opacity: 0.4,
                mixBlendMode: 'multiply'
              }}
            ></div>
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise3)'/%3E%3C/svg%3E")`,
                opacity: 0.3,
                mixBlendMode: 'screen'
              }}
            ></div>
            <div 
              className="absolute inset-0 z-0"
              style={{
                background: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px),
                              repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)`,
                opacity: 0.6
              }}
            ></div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4 h-full">
              {/* 3D Thumbnail */}
              <img
                src="/3d-characters-ecom/manage-online-store.png"
                alt="My Shopify Stores"
                width={110}
                height={110}
                className="w-[5.5rem] h-[5.5rem] md:w-[6.6rem] md:h-[6.6rem] flex-shrink-0 object-contain"
              />

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">My Shopify Stores</h2>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                  Connect and manage your Shopify stores to track performance and sync products.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  variant="outline" 
                  size="sm"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur-sm cursor-pointer"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <span className="text-xs">Connect Store</span>
                </Button>
              </div>
            </div>
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
                  <Image
                    src="/images/logos/shopify.svg"
                    alt="Shopify logo"
                    fill
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
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function ShopifyStoresPage() {
  return (
    <Suspense fallback={
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0">
            <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
              <Loader
                title="Loading your stores..."
                subtitle="Fetching your connected Shopify stores"
                size="md"
              />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    }>
      <ShopifyStoresContent />
    </Suspense>
  )
}
