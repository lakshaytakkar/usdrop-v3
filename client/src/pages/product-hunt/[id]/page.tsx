

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useRef, useMemo } from "react"
import { useParams, useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  TrendingUp,
  Star,
  Share2,
  Sparkles,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Package,
  Check,
} from "lucide-react"
import { ProductImageGallery } from "../components/product-image-gallery"
import { ProductKPICards } from "../components/product-kpi-cards"
import { MarketAnalyticsChart } from "../components/market-analytics-chart"
import { CompetitorPricingChart } from "../components/competitor-pricing-chart"
import { AudienceDemographicsChart } from "../components/audience-demographics-chart"
import { RelatedProductsCarousel } from "../components/related-products-carousel"
import { Product, ProductResearch } from "@/types/products"
import { cn } from "@/lib/utils"
import Loader from "@/components/kokonutui/loader"

import { Link } from "wouter"
import { useToast } from "@/hooks/use-toast"

function createProductSlug(productName: string): string {
  return productName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
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
  const [isInPicklist, setIsInPicklist] = useState(false)
  const [isAddingToPicklist, setIsAddingToPicklist] = useState(false)
  const [researchData, setResearchData] = useState<ProductResearch | null>(null)
  const [isLoadingResearch, setIsLoadingResearch] = useState(false)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
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
        
        const response = await apiFetch(`/api/products/${productId}`)
        
        if (!isMounted) return
        
        if (!response.ok) {
          let errorMessage = 'Failed to fetch product'
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorData.message || errorMessage
          } catch (e) {
            errorMessage = response.statusText || errorMessage
          }
          
          if (response.status === 404) {
            setError('Product not found')
          } else {
            setError(errorMessage)
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
        
        const allProductsResponse = await apiFetch("/api/products?source_type=scraped&pageSize=1000&sortBy=created_at&sortOrder=desc")
        if (allProductsResponse.ok && isMounted) {
          const allProductsData = await allProductsResponse.json()
          setAllProducts(allProductsData.products || [])
        }
        
        const picklistResponse = await apiFetch("/api/picklist")
        if (picklistResponse.ok && isMounted) {
          const picklistData = await picklistResponse.json()
          const isInList = picklistData.items?.some((item: any) => item.productId === data.product.id) || false
          setIsInPicklist(isInList)
        }
        
        setIsLoadingResearch(true)
        const researchResponse = await apiFetch(`/api/products/${productId}/research`)
        if (researchResponse.ok && isMounted) {
          const researchResult = await researchResponse.json()
          if (researchResult.research) {
            setResearchData(researchResult.research)
          }
        }
        setIsLoadingResearch(false)
        
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
  
  const { prevProduct, nextProduct } = useMemo(() => {
    if (!product || allProducts.length === 0) return { prevProduct: null, nextProduct: null }
    
    const currentIndex = allProducts.findIndex((p) => p.id === product.id)
    const prev = currentIndex > 0 ? allProducts[currentIndex - 1] : null
    const next = currentIndex < allProducts.length - 1 ? allProducts[currentIndex + 1] : null
    
    return { prevProduct: prev, nextProduct: next }
  }, [product, allProducts])

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

  if (isLoading) {
    return (
      <>
          <div className="flex flex-1 flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <Loader 
              title="Loading product details..." 
              subtitle="Fetching comprehensive product information and analytics"
              size="md"
            />
          </div>
      </>
    )
  }

  if (error || !product) {
    return (
      <>
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
      </>
    )
  }

  const safeAdditionalImages = Array.isArray(product.additional_images) ? product.additional_images : []
  const productImages = safeAdditionalImages.length > 0
    ? [product.image, ...safeAdditionalImages]
    : [product.image]
  
  const safeTrendData = Array.isArray(product.trend_data) ? product.trend_data : []
  const description = product.description || 'No description available.'
  const categoryName = product.category?.name || product.category?.slug || 'Uncategorized'
  const isTrending = safeTrendData.length > 1
    ? safeTrendData[safeTrendData.length - 1] > safeTrendData[0]
    : false
  
  const addedDate = product.created_at 
    ? new Date(product.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently'

  const competitionLevel: "Low" | "Medium" | "High" = isTrending ? "Medium" : "Low"

  const handleAddToMyProducts = async () => {
    if (isInPicklist || isAddingToPicklist) return
    
    setIsAddingToPicklist(true)
    try {
      const response = await apiFetch("/api/picklist", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId, source: 'product-hunt' }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setIsInPicklist(true)
          showError('Product is already in your list')
        } else if (response.status === 401) {
          showError('Please sign in to add products')
        } else {
          showError(data.error || 'Failed to add product')
        }
        return
      }

      setIsInPicklist(true)
      showSuccess('Product added to My Products')
      window.dispatchEvent(new CustomEvent("picklist-updated"))
    } catch (err) {
      console.error('Error adding to picklist:', err)
      showError('Failed to add product to your list')
    } finally {
      setIsAddingToPicklist(false)
    }
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
    router.push(`/tools?productId=${productId}`)
  }

  const productSlug = createProductSlug(product.title)
  const aliExpressUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(productSlug)}`
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(productSlug)}`
  const facebookAdsUrl = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&search_type=keyword_unordered&media_type=all&q=${encodeURIComponent(productSlug)}`

  return (
    <>
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden min-w-0 w-full max-w-full">
          {/* Sticky Top Actions */}
          <div
            ref={topActionsRef}
            className={cn(
              "sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transition-all w-full min-w-0",
              isSticky && "shadow-sm"
            )}
          >
            <div className="flex items-center justify-between p-3 md:px-6 gap-2 sm:gap-4 max-w-full min-w-0 w-full">
              <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-1 min-w-0 overflow-hidden">
                <button onClick={() => router.push("/")} className="hover:text-foreground transition-colors cursor-pointer">Home</button>
                <span>/</span>
                <button onClick={() => router.push("/product-hunt")} className="hover:text-foreground transition-colors cursor-pointer">Product Hunt</button>
                <span>/</span>
                <span className="text-foreground line-clamp-1 truncate">{product.title}</span>
              </nav>

              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div className="hidden sm:flex items-center gap-1 border-r pr-2 mr-2">
                  <Button variant="ghost" size="sm" onClick={() => prevProduct && router.push(`/product-hunt/${prevProduct.id}`)} disabled={!prevProduct} className="h-8 w-8 p-0" title={prevProduct ? `Previous: ${prevProduct.title}` : "No previous product"}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => nextProduct && router.push(`/product-hunt/${nextProduct.id}`)} disabled={!nextProduct} className="h-8 w-8 p-0" title={nextProduct ? `Next: ${nextProduct.title}` : "No next product"}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => router.push("/product-hunt")} className="h-8 px-2" title="Back">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Back</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleShareProduct} className="h-8 w-8 p-0" title="Share">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleAddToMyProducts}
                  disabled={isInPicklist || isAddingToPicklist}
                  variant={isInPicklist ? "default" : "outline"}
                  size="sm"
                  className={cn("h-8 px-2", isInPicklist && "bg-emerald-600 hover:bg-emerald-700 text-white")}
                  title={isInPicklist ? "Already in My Products" : "Add to My Products"}
                >
                  {isInPicklist ? (
                    <><Check className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Added</span></>
                  ) : (
                    <><Package className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Add to My Products</span></>
                  )}
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
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-full overflow-x-hidden min-w-0 w-full">
            <div className="w-full space-y-8 min-w-0 max-w-full">

              {/* Product Hero: Images + Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-w-0 w-full max-w-full">
                <ProductImageGallery images={productImages} videos={[]} />

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">Added to USDrop {addedDate}</div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{product.title}</h1>
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">({product.reviews_count || 0})</span>
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs">{categoryName}</Badge>
                        {isTrending && (
                          <Badge className="bg-orange-500 text-white text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>

                  {/* Pricing Card */}
                  <Card className="p-4 bg-gradient-to-br from-slate-50 to-white border-slate-200">
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Product Cost</span>
                        <span className="font-semibold">${product.buy_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Selling Price</span>
                        <span className="font-semibold text-primary">${product.sell_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2.5 border-t border-slate-200">
                        <span className="text-sm font-medium">Profit per Sale</span>
                        <div className="text-right">
                          <span className="text-xl font-bold text-emerald-600">${product.profit_per_order.toFixed(2)}</span>
                          <p className="text-xs text-muted-foreground">
                            {product.sell_price > 0 ? `${(((product.sell_price - product.buy_price) / product.sell_price) * 100).toFixed(0)}% margin` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Source Links */}
                  <div className="grid grid-cols-3 gap-2 min-w-0 max-w-full">
                    <Link href={aliExpressUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-xs h-9">
                        <div className="relative w-4 h-4 mr-1.5 flex-shrink-0">
                          <img src="/images/logos/aliexpress.svg" alt="AliExpress" className="object-contain" />
                        </div>
                        <span className="truncate">AliExpress</span>
                      </Button>
                    </Link>
                    <Link href={amazonUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-xs h-9">
                        <div className="relative w-4 h-4 mr-1.5 flex-shrink-0">
                          <img src="/images/logos/amazon.svg" alt="Amazon" className="object-contain" />
                        </div>
                        <span className="truncate">Amazon</span>
                      </Button>
                    </Link>
                    <Link href={facebookAdsUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-xs h-9">
                        <div className="relative w-4 h-4 mr-1.5 flex-shrink-0">
                          <img src="/images/logos/meta.svg" alt="Facebook Ads" className="object-contain" />
                        </div>
                        <span className="truncate">FB Ads</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* KPI Summary */}
              <div className="space-y-3 min-w-0 max-w-full">
                <SectionHeader title="Performance Overview" description="Key metrics at a glance for quick evaluation" />
                <ProductKPICards
                  buyPrice={product.buy_price}
                  sellPrice={product.sell_price}
                  profitPerOrder={product.profit_per_order}
                  trendData={safeTrendData}
                  competitionLevel={competitionLevel}
                  rating={product.rating}
                  reviewsCount={product.reviews_count}
                />
              </div>

              {/* Market Analytics */}
              <div className="space-y-3 min-w-0 max-w-full">
                <SectionHeader title="Market Analytics" description="Search interest trends and revenue projections based on market data" />
                <MarketAnalyticsChart
                  trendData={safeTrendData}
                  sellPrice={product.sell_price}
                  profitPerOrder={product.profit_per_order}
                  seasonalDemand={researchData?.seasonal_demand || undefined}
                />
              </div>

              {researchData?.competitor_pricing && (
                <div className="space-y-3 min-w-0 max-w-full">
                  <SectionHeader title="Pricing & Competition" description="How your pricing compares to competitors in the market" />
                  <CompetitorPricingChart
                    productPrice={product.sell_price}
                    competitors={researchData.competitor_pricing.competitors}
                    priceRange={researchData.competitor_pricing.price_range}
                  />
                </div>
              )}

              {researchData?.audience_targeting && (
                <div className="space-y-3 min-w-0 max-w-full">
                  <SectionHeader title="Audience & Targeting" description="Who buys this product and how to reach them effectively" />
                  <AudienceDemographicsChart
                    demographics={researchData.audience_targeting.demographics}
                    interests={researchData.audience_targeting.interests}
                    suggestions={researchData.audience_targeting.suggestions}
                  />
                </div>
              )}

              {/* More Products */}
              <div className="space-y-3 min-w-0 max-w-full">
                <SectionHeader title="More Products" description="Explore similar and related products" />
                <RelatedProductsCarousel 
                  productIds={[]}
                  currentProductId={productId}
                  products={allProducts}
                />
              </div>

            </div>
            
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
    </>
  )
}
