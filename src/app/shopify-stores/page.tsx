"use client"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store, Plus } from "lucide-react"
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
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Store className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Shopify Stores</h1>
            </div>
            <p className="text-muted-foreground">
              Connect and manage your Shopify stores
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-muted-foreground">Loading stores...</p>
            </div>
          ) : stores.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <Store className="h-10 w-10 text-primary" />
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
                <p className="text-muted-foreground">
                  {stores.length} {stores.length === 1 ? "store" : "stores"} connected
                </p>
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Store
                </Button>
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

