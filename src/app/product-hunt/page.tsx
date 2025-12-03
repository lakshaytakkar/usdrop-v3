"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./components/product-card"
import { productPicks } from "@/data/product-picks"
import { Loader2 } from "lucide-react"

type Product = {
  id: string | number
  image: string
  title: string
  buyPrice: number
  sellPrice: number
  profitPerOrder: number
  trendData: number[]
  category: string
  rating: number
  reviews: number
  trending?: boolean
}

export default function ProductHuntPage() {
  // Map product picks to the format expected by this page
  const products: Product[] = productPicks.map((pick, index) => ({
    id: pick.id,
    image: pick.image,
    title: pick.title,
    buyPrice: pick.buy_price,
    sellPrice: pick.sell_price,
    profitPerOrder: pick.profit_per_order,
    trendData: pick.trend_data || [],
    category: pick.category,
    rating: pick.rating || 0,
    reviews: pick.reviews_count,
    trending: pick.trend_data && pick.trend_data.length > 1 
      ? pick.trend_data[pick.trend_data.length - 1] > pick.trend_data[0]
      : false,
  }))
  const PRODUCTS_PER_PAGE = 12 // 3 rows × 4 columns
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(false)
  const [showFade, setShowFade] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products
    }
    return products.filter((product) => product.category === selectedCategory)
  }, [selectedCategory, products])
  
  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE)
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [selectedCategory])
  
  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  const loadMore = async () => {
    setIsLoading(true)
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 600))
    setVisibleCount(prev => Math.min(prev + PRODUCTS_PER_PAGE, filteredProducts.length))
    setIsLoading(false)
    setShowFade(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const scrolledPercentage = (scrollTop + clientHeight) / scrollHeight
      
      // Show fade effect when scrolled 80% of the way down
      if (scrolledPercentage > 0.8 && hasMore) {
        setShowFade(true)
      } else {
        setShowFade(false)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [hasMore, filteredProducts.length])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div 
          ref={containerRef}
          className="flex flex-1 flex-col gap-4 p-4 md:p-6 overflow-y-auto"
        >
          {/* Category Filter */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 -mx-4 md:-mx-6 px-4 md:px-6 pt-2 border-b border-border/50">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                All Products
              </button>
              {Array.from(new Set(products.map(p => p.category)))
                .filter(cat => cat && cat !== "uncategorized")
                .slice(0, 15)
                .map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize cursor-pointer ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {category.replace(/-/g, " ")}
                  </button>
                ))}
            </div>
          </div>
          
          <div className="relative">
            {/* Products Grid */}
            {visibleProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg font-medium">No products found in this category</p>
                <p className="text-sm mt-2">Try selecting a different category</p>
              </div>
            )}

            {/* Fade Overlay */}
            {showFade && hasMore && (
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none backdrop-blur-[2px]" />
            )}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center py-8">
              <Button
                onClick={loadMore}
                disabled={isLoading}
                size="lg"
                className="min-w-[200px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white hover:from-blue-700 hover:via-blue-600 hover:to-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}

          {/* End Message */}
          {!hasMore && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              You've reached the end of the products
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

