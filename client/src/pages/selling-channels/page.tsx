

import { useState } from "react"
import { ModuleAccessGuard } from "@/components/auth/module-access-guard"
import { MarketplaceCard } from "./components/marketplace-card"
import { marketplaces } from "./data/marketplaces"
import { useOnboarding } from "@/contexts/onboarding-context"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { getTeaserLockState } from "@/hooks/use-teaser-lock"
import { FrameworkBanner } from "@/components/framework-banner"

export default function SellingChannelsPage() {
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

  return (
    <ModuleAccessGuard moduleId="selling-channels">
    <>
        <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2 min-h-0 relative">
          <FrameworkBanner
            title="Selling Channels"
            description="Explore and connect to major US marketplaces to sell your products"
            iconSrc="/3d-ecom-icons-blue/Delivery_Truck.png"
          />

          <div>
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
    </>
    </ModuleAccessGuard>
  )
}

