"use client"

import { useState } from "react"
import { ExternalLayout } from "@/components/layout/external-layout"
import { MarketplaceCard } from "./components/marketplace-card"
import { marketplaces } from "./data/marketplaces"
import { useOnboarding } from "@/contexts/onboarding-context"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { getTeaserLockState } from "@/hooks/use-teaser-lock"

export default function SellingChannelsPage() {
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

  return (
    <ExternalLayout>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
          <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
            <h1 className="text-2xl font-bold">Selling Channels</h1>
            <p className="text-sm text-blue-100 mt-1">Connect with top marketplaces to expand your reach</p>
          </div>

          {/* Marketplaces Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Marketplaces</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketplaces.map((marketplace, index) => {
                const { isLocked } = getTeaserLockState(index, isFree, {
                  freeVisibleCount: 3,
                  strategy: "first-n-items"
                })
                return (
                  <MarketplaceCard 
                    key={marketplace.id} 
                    marketplace={{
                      ...marketplace,
                      isLocked: isLocked || marketplace.isLocked
                    }}
                    onLockedClick={() => setIsUpsellOpen(true)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      
      {/* Upsell Dialog */}
      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </ExternalLayout>
  )
}

