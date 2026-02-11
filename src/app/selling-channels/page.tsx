"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { MarketplaceCard } from "./components/marketplace-card"
import { marketplaces } from "./data/marketplaces"
import { useOnboarding } from "@/contexts/onboarding-context"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { ProPageWrapper } from "@/components/ui/pro-page-wrapper"

export default function SellingChannelsPage() {
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <ProPageWrapper featureName="Selling Channels" featureDescription="Manage and connect multiple selling channels for your products">
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
          {/* Banner with grainy gradient */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 via-blue-950 to-blue-800 p-3 text-white h-[154px] flex-shrink-0">
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
                src="/3d-ecom-icons-blue/Shopping_Cart.png"
                alt="Selling Channels"
                width={110}
                height={110}
                className="w-[5.5rem] h-[5.5rem] md:w-[6.6rem] md:h-[6.6rem] flex-shrink-0 object-contain"
              />

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">Selling Channels</h2>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                  Connect with top marketplaces to expand your sales reach. Premium marketplaces require an upgraded plan.
                </p>
              </div>
            </div>
          </div>

          {/* Marketplaces Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Marketplaces</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketplaces.map((marketplace, index) => {
                // Show first 3 marketplaces, lock rest for free users
                const shouldLock = isFree && index >= 3
                return (
                  <MarketplaceCard 
                    key={marketplace.id} 
                    marketplace={{
                      ...marketplace,
                      isLocked: shouldLock || marketplace.isLocked
                    }}
                    onLockedClick={() => setIsUpsellOpen(true)}
                  />
                )
              })}
            </div>
          </div>
        </div>
        </ProPageWrapper>
      </SidebarInset>
      
      {/* Upsell Dialog */}
      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </SidebarProvider>
  )
}

