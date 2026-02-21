

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

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
    <>
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0">

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-muted-foreground">Loading stores...</p>
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
        </div>
    </>
  )
}

