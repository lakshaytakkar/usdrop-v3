"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { OnboardingProvider, useOnboarding } from "@/contexts/onboarding-context"
import { SeasonalBanner } from "./components/seasonal-banner"
import { UpsellDialog } from "@/components/ui/upsell-dialog"

// Seasonal collections data
const seasonalCollections = [
  {
    name: "Christmas Collection",
    slug: "christmas",
    thumbnail: "/images/seasonal-collections/christmas-thumbnail.png",
    dateRange: "Dec 1 - Dec 25",
    marketingDateRange: "Dec 1 - Dec 25",
    gradient: "from-red-900 to-green-800",
  },
  {
    name: "Halloween Collection",
    slug: "halloween",
    thumbnail: "/images/seasonal-collections/halloween-thumbnail.png",
    dateRange: "Oct 1 - Oct 31",
    marketingDateRange: "Oct 1 - Oct 31",
    gradient: "from-orange-900 to-purple-800",
  },
  {
    name: "Thanksgiving Collection",
    slug: "thanksgiving",
    thumbnail: "/images/seasonal-collections/thanksgiving-thumbnail.png",
    dateRange: "Nov 1 - Nov 28",
    marketingDateRange: "Nov 1 - Nov 28",
    gradient: "from-orange-900 to-yellow-800",
  },
  {
    name: "Father's Day Collection",
    slug: "fathers-day",
    thumbnail: "/images/seasonal-collections/fathers-day-thumbnail.png",
    dateRange: "June 1 - June 16",
    marketingDateRange: "June 1 - June 16",
    gradient: "from-blue-900 to-slate-800",
  },
]

function SeasonalCollectionsPageContent() {
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-gray-50/50 relative">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Seasonal Collections</h1>
            <p className="text-muted-foreground mb-6">
              Discover curated product collections for seasonal holidays and special occasions
            </p>
          </div>

          {/* Seasonal Collection Banners */}
          <div className="flex flex-col gap-4">
            {seasonalCollections.map((collection, index) => {
              // Lock all buttons for free users
              const isLocked = isFree
              return (
                <SeasonalBanner
                  key={collection.slug}
                  name={collection.name}
                  slug={collection.slug}
                  thumbnail={collection.thumbnail}
                  dateRange={collection.dateRange}
                  marketingDateRange={collection.marketingDateRange}
                  gradient={collection.gradient}
                  isLocked={isLocked}
                  onLockedClick={() => setIsUpsellOpen(true)}
                />
              )
            })}
          </div>
        </div>
      </SidebarInset>
      
      {/* Upsell Dialog */}
      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </SidebarProvider>
  )
}

export default function SeasonalCollectionsPage() {
  return (
    <OnboardingProvider>
      <SeasonalCollectionsPageContent />
    </OnboardingProvider>
  )
}





