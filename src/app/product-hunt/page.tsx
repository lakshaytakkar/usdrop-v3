"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./components/product-card"
import { Loader2, AlertCircle, Play } from "lucide-react"
import { Product } from "@/types/products"
import { Category } from "@/types/categories"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"

type ProductCardData = {
  id: string
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
  const PRODUCTS_PER_PAGE = 12 // 3 rows × 4 columns
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [showFade, setShowFade] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const params = new URLSearchParams({
          source_type: 'scraped',
          page: page.toString(),
          pageSize: PRODUCTS_PER_PAGE.toString(),
          sortBy: 'created_at',
          sortOrder: 'desc',
        })
        
        if (selectedCategory !== "all") {
          // Find category ID by slug
          const category = categories.find(c => c.slug === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase())
          if (category) {
            params.append('category_id', category.id)
          }
        }
        
        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        
        if (page === 1) {
          setProducts(data.products || [])
        } else {
          setProducts(prev => [...prev, ...(data.products || [])])
        }
        
        setHasMore(data.page < data.totalPages)
        setIsLoading(false)
        setIsLoadingMore(false)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load products')
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }
    
    fetchProducts()
  }, [page, selectedCategory, categories])
  
  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    
    fetchCategories()
  }, [])
  
  // Reset page when category changes
  useEffect(() => {
    setPage(1)
    setProducts([])
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [selectedCategory])
  
  // Map products to ProductCard format
  const productCardData: ProductCardData[] = useMemo(() => {
    return products.map((product) => ({
      id: product.id,
      image: product.image,
      title: product.title,
      buyPrice: product.buy_price,
      sellPrice: product.sell_price,
      profitPerOrder: product.profit_per_order,
      trendData: product.trend_data || [],
      category: product.category?.name || product.category?.slug || 'uncategorized',
      rating: product.rating || 0,
      reviews: product.reviews_count || 0,
      trending: product.trend_data && product.trend_data.length > 1 
        ? product.trend_data[product.trend_data.length - 1] > product.trend_data[0]
        : false,
    }))
  }, [products])
  
  // Get unique categories from products
  const availableCategories = useMemo(() => {
    const categorySet = new Set<string>()
    products.forEach(p => {
      if (p.category?.slug) {
        categorySet.add(p.category.slug)
      } else if (p.category?.name) {
        categorySet.add(p.category.name.toLowerCase().replace(/\s+/g, '-'))
      }
    })
    return Array.from(categorySet)
  }, [products])

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return
    
    setIsLoadingMore(true)
    setPage(prev => prev + 1)
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
  }, [hasMore, products.length])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div 
          ref={containerRef}
          className="flex flex-1 flex-col gap-4 p-4 md:p-6 overflow-y-auto relative"
        >
          {/* Category Filter */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-3 -mx-4 md:-mx-6 px-4 md:px-6 pt-2 border-b border-border/50">
            <div className="grid grid-cols-5 gap-2">
              {/* All Products Button */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border shadow-sm ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white border-blue-600 shadow-md hover:shadow-lg"
                    : "bg-card text-foreground hover:bg-accent border-border hover:border-accent-foreground/20 hover:shadow-md"
                }`}
              >
                <span className="truncate">All Products</span>
              </button>
              
              {/* Category Filter Buttons */}
              {categories
                .filter(cat => !cat.parent_category_id) // Only show parent categories
                .slice(0, 9) // Show 9 categories (10 total with "All Products")
                .map(category => {
                  const categorySlug = category.slug
                  const isSelected = selectedCategory === categorySlug
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(categorySlug)}
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border shadow-sm ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white border-blue-600 shadow-md hover:shadow-lg"
                          : "bg-card text-foreground hover:bg-accent border-border hover:border-accent-foreground/20 hover:shadow-md"
                      }`}
                    >
                      {/* Category Thumbnail */}
                      {category.image ? (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-border/50">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border border-border/50">
                          <span className="text-base font-medium text-muted-foreground">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="truncate capitalize flex-1 text-left">{category.name}</span>
                    </button>
                  )
                })}
            </div>
          </div>
          
          <div className="relative">
            {/* Error State */}
            {error && (
              <div className="flex items-center gap-2 p-4 mb-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && products.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden border-border/50 p-0">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-16 w-full" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* Products Grid */}
                {productCardData.length > 0 ? (
                  <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {productCardData.map((product, index) => {
                      // Apply progressive fade to bottom 4 products (products 9-12, indices 8-11)
                      // Only apply when showing first page with exactly 12 products
                      const isFirstPage = page === 1
                      const shouldFade = isFirstPage && productCardData.length === 12 && index >= 8 && index < 12
                      
                      // Calculate progressive opacity for the 4 bottom products
                      // Product 9 (index 8): 90%, Product 10 (index 9): 70%
                      // Product 11 (index 10): 50%, Product 12 (index 11): 30%
                      const opacity = shouldFade 
                        ? [0.9, 0.7, 0.5, 0.3][index - 8] // Progressive fade: 0.9, 0.7, 0.5, 0.3
                        : 1
                      
                      return (
                        <div
                          key={product.id}
                          className={shouldFade ? `transition-all duration-300` : ''}
                          style={shouldFade ? {
                            opacity: opacity,
                          } : {}}
                        >
                          <ProductCard product={product} />
                        </div>
                      )
                    })}
                    
                    {/* Progressive fade gradient overlay for bottom 4 products */}
                    {page === 1 && productCardData.length === 12 && (
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-[calc(33.333%+1rem)] pointer-events-none bg-gradient-to-b from-transparent via-background/50 to-background"
                      />
                    )}
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
              </>
            )}
          </div>

          {/* Load More Button */}
          {!isLoading && hasMore && productCardData.length > 0 && (
            <div className="flex justify-center py-8">
              <Button
                onClick={loadMore}
                disabled={isLoadingMore}
                size="lg"
                className="min-w-[200px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white hover:from-blue-700 hover:via-blue-600 hover:to-blue-700"
              >
                {isLoadingMore ? (
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
          {!hasMore && productCardData.length > 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              You've reached the end of the products
            </div>
          )}

          {/* Onboarding Progress Overlay */}
          <OnboardingProgressOverlay pageName="Product Hunt" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

