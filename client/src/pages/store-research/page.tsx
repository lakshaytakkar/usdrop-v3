

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Search as SearchIcon } from "lucide-react"
import { StoreSearch } from "./components/store-search"
import { StoreAnalysisCard } from "./components/store-analysis-card"
import { RevenueEstimates } from "./components/revenue-estimates"
import { TrafficSourcesChart } from "./components/traffic-sources-chart"
import { ProductsGrid } from "./components/products-grid"
import { getStoreResearchData, StoreResearchData } from "./data/store-research-data"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"

export default function StoreResearchPage() {
  const [storeData, setStoreData] = useState<StoreResearchData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (url: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getStoreResearchData(url)
      if (data) {
        setStoreData(data)
      } else {
        setError("Store not found or could not be analyzed")
        setStoreData(null)
      }
    } catch (err) {
      setError("Error analyzing store. Please try again.")
      setStoreData(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50 relative">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <SearchIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Store Research</h1>
            </div>
            <p className="text-muted-foreground">
              Analyze competitor stores and discover winning strategies
            </p>
          </div>

          {/* Search Section */}
          <div>
            <StoreSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Store Data Display */}
          {storeData && !isLoading && (
            <>
              {/* Store Analysis */}
              <StoreAnalysisCard data={storeData} />

              {/* Revenue Estimates and Traffic Sources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <RevenueEstimates data={storeData} />
                <TrafficSourcesChart sources={storeData.trafficSources} />
              </div>

              {/* Products Grid */}
              {storeData.products.length > 0 && <ProductsGrid products={storeData.products} />}
            </>
          )}

          {/* Onboarding Progress Overlay */}
          <OnboardingProgressOverlay pageName="Store Research" />
        </div>
    </>
  )
}

