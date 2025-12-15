"use client"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Image from "next/image"
import { ConnectStoreModal } from "./components/connect-store-modal"
import { StoreList } from "./components/store-list"
import { ShopifyStore, sampleStores } from "./data/stores"

export default function ShopifyStoresPage() {
  const [stores, setStores] = useState<ShopifyStore[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading stores
    setTimeout(() => {
      setStores(sampleStores)
      setLoading(false)
    }, 500)
  }, [])

  const handleStoreAdded = () => {
    // Reload stores
    setStores([...sampleStores])
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0">
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
              <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                  <Image
                    src="/images/banner-thumbnails/shopify-stores.png"
                    alt="Shopify Stores"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">USDrop Shopify Stores</h2>
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
            <div className="flex justify-center items-center py-12">
              <p className="text-muted-foreground">Loading stores...</p>
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

