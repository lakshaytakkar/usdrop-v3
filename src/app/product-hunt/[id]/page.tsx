"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ArrowLeft, 
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Star,
  Bookmark,
  Share2,
  Sparkles,
  ArrowUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { ProductImageGallery } from "../components/product-image-gallery"
import { RelatedProductsCarousel } from "../components/related-products-carousel"
import { ReviewsSection } from "../components/reviews-section"
import { FulfillmentSection } from "../components/fulfillment-section"
import { SeasonalInterestChart } from "../components/seasonal-interest-chart"
import { SaturationGauge } from "../components/saturation-gauge"
import { TargetingSection } from "../components/targeting-section"
import { CompetitionSection } from "../components/competition-section"
import { Product } from "@/types/products"
import { cn } from "@/lib/utils"
import Loader from "@/components/kokonutui/loader"
import Image from "next/image"
import Link from "next/link"

// Utility function to create product slug for search URLs
function createProductSlug(productName: string): string {
  return productName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const topActionsRef = useRef<HTMLDivElement>(null)
  
  const [product, setProduct] = useState<Product | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Fetch product from API
  useEffect(() => {
    // Prevent fetching if productId is invalid
    if (!productId || productId === 'undefined' || productId === 'null') {
      setError('Product ID is missing or invalid')
      setIsLoading(false)
      return
    }

    let isMounted = true

    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`/api/products/${productId}`)
        
        if (!isMounted) return
        
        if (!response.ok) {
          let errorMessage = 'Failed to fetch product'
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorData.message || errorMessage
            if (errorData.details) {
              console.error('API Error Details:', errorData.details)
            }
          } catch (e) {
            errorMessage = response.statusText || errorMessage
          }
          
          if (response.status === 404) {
            setError('Product not found')
          } else {
            setError(errorMessage)
            console.error('API Error Status:', response.status, 'Message:', errorMessage)
          }
          setIsLoading(false)
          return
        }
        
        const data = await response.json()
        
        if (!isMounted) return
        
        if (!data.product) {
          setError('Product data is missing')
          setIsLoading(false)
          return
        }
        
        setProduct(data.product)
        
        // Fetch all products for navigation
        const allProductsResponse = await fetch('/api/products?source_type=scraped&pageSize=1000&sortBy=created_at&sortOrder=desc')
        if (allProductsResponse.ok && isMounted) {
          const allProductsData = await allProductsResponse.json()
          setAllProducts(allProductsData.products || [])
        }
        
        setIsLoading(false)
      } catch (err) {
        if (!isMounted) return
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Failed to load product')
        setIsLoading(false)
      }
    }
    
    fetchProduct()

    return () => {
      isMounted = false
    }
  }, [productId])
  
  // Find previous and next products
  const { prevProduct, nextProduct } = useMemo(() => {
    if (!product || allProducts.length === 0) return { prevProduct: null, nextProduct: null }
    
    const currentIndex = allProducts.findIndex((p) => p.id === product.id)
    const prev = currentIndex > 0 ? allProducts[currentIndex - 1] : null
    const next = currentIndex < allProducts.length - 1 ? allProducts[currentIndex + 1] : null
    
    return { prevProduct: prev, nextProduct: next }
  }, [product, allProducts])

  // Sticky header and scroll to top button effects
  useEffect(() => {
    const handleScroll = () => {
      if (topActionsRef.current) {
        const rect = topActionsRef.current.getBoundingClientRect()
        setIsSticky(rect.top <= 0)
      }
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Loading state
  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <Loader 
              title="Loading product details..." 
              subtitle="Fetching comprehensive product information and analytics"
              size="md"
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Error state or product not found
  if (error || !product) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col items-center justify-center p-8">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <p className="text-muted-foreground mb-4">{error || 'The product you are looking for does not exist.'}</p>
            <Button 
              onClick={() => router.push("/product-hunt")}
              variant="default"
              className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white hover:from-blue-700 hover:via-blue-600 hover:to-blue-700"
            >
              Back to Products
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Map API product to expected format
  const productImages = product.additional_images && product.additional_images.length > 0
    ? [product.image, ...product.additional_images]
    : [product.image]
  
  const description = product.description || 'No description available.'
  const categoryName = product.category?.name || product.category?.slug || 'Uncategorized'
  const isTrending = product.trend_data && product.trend_data.length > 1
    ? product.trend_data[product.trend_data.length - 1] > product.trend_data[0]
    : false
  
  const addedDate = product.created_at 
    ? new Date(product.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently'

  const handleImportToShopify = () => {
    // TODO: Implement import to Shopify
    console.log('Import to Shopify:', productId)
  }

  const handleSaveProduct = () => {
    // TODO: Implement save/bookmark
    console.log('Save product:', productId)
  }

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this product: ${product.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleGenerateAI = () => {
    router.push(`/ai-toolkit?productId=${productId}`)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden min-w-0">
        <Topbar />
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden min-w-0 w-full max-w-full">
          {/* Sticky Top Actions */}
          <div
            ref={topActionsRef}
            className={cn(
              "sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transition-all w-full min-w-0",
              isSticky && "shadow-sm"
            )}
          >
            <div className="flex items-center justify-between p-4 md:p-6 gap-2 sm:gap-4 max-w-full min-w-0 w-full">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-1 min-w-0 overflow-hidden">
                <button 
                  onClick={() => router.push("/")}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span>/</span>
                <button 
                  onClick={() => router.push("/product-hunt")}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Product Hunt
                </button>
                <span>/</span>
                <span className="text-foreground line-clamp-1 truncate">{product.title}</span>
              </nav>

              {/* Top Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {/* Prev/Next Navigation */}
                <div className="hidden sm:flex items-center gap-1 border-r pr-2 mr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => prevProduct && router.push(`/product-hunt/${prevProduct.id}`)}
                    disabled={!prevProduct}
                    className="h-8 w-8 p-0"
                    title={prevProduct ? `Previous: ${prevProduct.title}` : "No previous product"}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => nextProduct && router.push(`/product-hunt/${nextProduct.id}`)}
                    disabled={!nextProduct}
                    className="h-8 w-8 p-0"
                    title={nextProduct ? `Next: ${nextProduct.title}` : "No next product"}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/product-hunt")}
                  className="h-8 px-2"
                  title="Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Back</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveProduct}
                  className="h-8 w-8 p-0"
                  title="Save"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareProduct}
                  className="h-8 w-8 p-0"
                  title="Share"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleGenerateAI}
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white hover:from-blue-700 hover:via-blue-600 hover:to-blue-700"
                  title="AI Studio"
                >
                  <Sparkles className="h-4 w-4 sm:mr-2" />
                  <span className="hidden md:inline">AI Studio</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 max-w-full overflow-x-hidden min-w-0 w-full">
            <div className="w-full space-y-12 min-w-0 max-w-full">
            {/* Main Product Section: Images & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-w-0 w-full max-w-full">
              {/* Image Gallery */}
              <ProductImageGallery 
                images={productImages}
                videos={[]}
              />

              {/* Product Info & Pricing */}
              <div className="space-y-4">
                {/* Product Header - Moved to right side */}
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <span>Added to USDrop {addedDate}</span>
                  </div>

                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.title}</h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{product.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({product.reviews_count || 0})</span>
                        </div>
                      )}
                      <Badge variant="outline">{categoryName}</Badge>
                      {isTrending && (
                        <Badge className="bg-orange-500 text-white">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Product Description */}
                  <div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
                {/* Pricing Card */}
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Product Cost</span>
                      <span className="font-semibold">${product.buy_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Selling Price</span>
                      <span className="font-semibold text-primary">${product.sell_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Profit per Sale</span>
                      <span className="text-lg font-bold text-emerald-600">
                        ${product.profit_per_order.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Supplier Links */}
                {(() => {
                  const productSlug = createProductSlug(product.title)
                  const aliExpressUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(productSlug)}`
                  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(productSlug)}`
                  const facebookAdsUrl = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&search_type=keyword_unordered&media_type=all&q=${encodeURIComponent(productSlug)}`
                  
                  return (
                    <div className="grid grid-cols-2 gap-2 min-w-0 max-w-full">
                      <Link 
                        href={aliExpressUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full">
                          <div className="relative w-4 h-4 mr-2 flex-shrink-0">
                            <Image
                              src="/images/logos/aliexpress.svg"
                              alt="AliExpress"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="truncate">AliExpress</span>
                        </Button>
                      </Link>
                      <Link 
                        href={amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full">
                          <div className="relative w-4 h-4 mr-2 flex-shrink-0">
                            <Image
                              src="/images/logos/amazon.svg"
                              alt="Amazon"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="truncate">Amazon</span>
                        </Button>
                      </Link>
                      <Link 
                        href={facebookAdsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full">
                          <div className="relative w-4 h-4 mr-2 flex-shrink-0">
                            <Image
                              src="/images/logos/meta.svg"
                              alt="Facebook Ads"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="truncate">Facebook Ads</span>
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">Find other supplier</span>
                      </Button>
                    </div>
                  )
                })()}

                {/* Help Section */}
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">
                    Need help choosing products? Store review, targeting, scaling, sales advice? Ask USDrop's support team.
                  </p>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat now
                  </Button>
                </Card>
              </div>
            </div>

            {/* Fulfillment by USDrop */}
            <div className="space-y-6 min-w-0 max-w-full">
              <h2 className="text-2xl font-bold">Fulfillment by USDrop</h2>
              <FulfillmentSection 
                product={product}
                onImportToShopify={handleImportToShopify}
              />
            </div>

            {/* Product Demand & Saturation */}
            <div className="space-y-6 min-w-0 max-w-full">
              <h2 className="text-2xl font-bold">Product Demand & Saturation</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-w-0 w-full max-w-full">
                <SeasonalInterestChart 
                  data={product.trend_data?.map((value, index) => {
                    const date = new Date(2022, 6 + index) // Start from July 2022
                    return {
                      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                      value
                    }
                  })}
                />
                <SaturationGauge 
                  storesSelling={1}
                  competitionLevel={isTrending ? "Medium" : "Low"}
                />
              </div>
            </div>

            {/* Targeting on Social Media */}
            <div className="space-y-6 min-w-0 max-w-full">
              <h2 className="text-2xl font-bold">Targeting on Social Media</h2>
              <TargetingSection />
            </div>

            {/* Competition & Key Metrics */}
            <div className="space-y-6 min-w-0 max-w-full">
              <h2 className="text-2xl font-bold">Competition & Key Metrics</h2>
              <CompetitionSection 
                productSpecs={{
                  dimensions: product.specifications?.dimensions || product.specifications?.product_dimensions || "8.7 x 3.5 x 3.1 inches",
                  weight: product.specifications?.weight || product.specifications?.item_weight || "0.70 pounds"
                }}
              />
            </div>

            {/* Product Complements & Upsales */}
            {product.metadata?.filters && product.metadata.filters.length > 0 && (
              <div className="space-y-6 min-w-0 max-w-full">
                <h2 className="text-2xl font-bold">Product Complements & Upsales</h2>
                <RelatedProductsCarousel 
                  productIds={[]}
                  currentProductId={productId}
                  products={allProducts}
                />
              </div>
            )}

            {/* Product Reviews */}
            <div className="space-y-6 min-w-0 max-w-full">
              <h2 className="text-2xl font-bold">Product Reviews</h2>
              <ReviewsSection reviews={[]} />
            </div>

            {/* More Products */}
            <div className="space-y-6 min-w-0 max-w-full">
              <h2 className="text-2xl font-bold">More Products</h2>
              <RelatedProductsCarousel 
                productIds={[]}
                currentProductId={productId}
                products={allProducts}
              />
            </div>

            </div>
            
            {/* Scroll to Top Button */}
            {showScrollTop && (
              <Button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 rounded-full h-12 w-12 shadow-lg z-50"
                size="icon"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
