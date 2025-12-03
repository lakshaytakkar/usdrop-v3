"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Play,
  MessageCircle,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Calculator,
  Target,
  Star,
  Instagram
} from "lucide-react"
import productsData from "../data/products.json"
import productDetailsData from "../data/product-details.json"
import { ProductImageGallery } from "../components/product-image-gallery"
import { ProfitCalculator } from "../components/profit-calculator"
import { DemandCharts } from "../components/demand-charts"
import { RelatedProductsCarousel } from "../components/related-products-carousel"
import { ReviewsSection } from "../components/reviews-section"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = parseInt(params.id as string)
  
  const products = productsData as any[]
  const details = productDetailsData as any
  
  const product = products.find(p => p.id === productId)
  const productDetail = details[productId.toString()]
  
  const [showFullDescription, setShowFullDescription] = useState(false)
  
  // Find previous and next products
  const currentIndex = products.findIndex(p => p.id === productId)
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null
  const nextProduct = currentIndex < products.length - 1 ? products[currentIndex + 1] : null

  if (!product || !productDetail) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col items-center justify-center p-8">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button 
              onClick={() => router.push("/product-hunt")}
              className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 cursor-pointer"
            >
              Back to Products
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const description = showFullDescription 
    ? productDetail.fullDescription 
    : productDetail.description

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 overflow-y-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-2">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
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
              <span className="text-foreground line-clamp-1">{product.title}</span>
            </nav>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              {prevProduct && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/product-hunt/${prevProduct.id}`)}
                  className="h-8 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/product-hunt")}
                className="h-8 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              {nextProduct && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/product-hunt/${nextProduct.id}`)}
                  className="h-8 cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Added Date and Tutorial */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>Added to USDrop {productDetail.addedDate}</span>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              <Play className="h-4 w-4" />
              Watch Tutorial
            </button>
          </div>

          {/* Product Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Image Gallery */}
            <ProductImageGallery images={productDetail.images || [product.image]} />

            {/* Right: Product Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews})</span>
                  </div>
                  <Badge variant="outline">{product.category}</Badge>
                  {product.trending && (
                    <Badge className="bg-orange-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
                {productDetail.fullDescription && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-sm text-blue-600 hover:underline mt-1 cursor-pointer"
                  >
                    {showFullDescription ? "Show less" : "Show more"}
                  </button>
                )}
              </div>

              {/* Pricing */}
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Product Cost</span>
                    <span className="font-semibold">${product.buyPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Selling Price</span>
                    <span className="font-semibold text-primary">${product.sellPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Profit per Sale</span>
                    <span className="text-lg font-bold text-emerald-600">
                      ${product.profitPerOrder.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Supplier Links */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full cursor-pointer" asChild>
                  <a href={productDetail.supplierLinks?.aliexpress} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    AliExpress
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full cursor-pointer" asChild>
                  <a href={productDetail.supplierLinks?.amazon} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Amazon
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full cursor-pointer" asChild>
                  <a href={productDetail.supplierLinks?.facebookAd} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Facebook Ad
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full cursor-pointer">
                  Find Best Supplier
                </Button>
              </div>

              {/* Help Section */}
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">
                  Need help choosing products? Store review, targeting, scaling, sales advice?
                </p>
                <Button variant="outline" size="sm" className="w-full cursor-pointer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat now
                </Button>
              </Card>
            </div>
          </div>

          {/* Fulfillment Section */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Fulfillment by USDrop</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product cost:</span>
                    <span className="font-medium">${productDetail.fulfillment?.productCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Shipping cost to {productDetail.fulfillment?.shippingTo}:
                    </span>
                    <span className="font-medium">
                      ${productDetail.fulfillment?.shippingCost.toFixed(2)} ({productDetail.fulfillment?.shippingTime})
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-semibold">
                    <span>Total price:</span>
                    <span>${productDetail.fulfillment?.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 cursor-pointer">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Import to Shopify
              </Button>
            </div>
          </Card>

          {/* Demand & Saturation Section */}
          <DemandCharts 
            seasonalData={productDetail.demand?.seasonalData}
            saturation={productDetail.demand?.saturation}
            regionalInterest={productDetail.demand?.regionalInterest}
          />

          {/* Profit Calculator */}
          <ProfitCalculator 
            buyPrice={product.buyPrice}
            sellPrice={product.sellPrice}
            fulfillment={productDetail.fulfillment}
          />

          {/* Targeting Section */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Targeting on Social Media</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Interest Groups & Audience Size</h4>
                <div className="space-y-2">
                  {productDetail.targeting?.interests?.map((interest: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                      <span className="text-sm">{interest.name}</span>
                      <span className="text-sm font-semibold">{interest.audienceSize}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">Demographics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 rounded-md bg-muted/50">
                    <span className="text-sm text-muted-foreground">Gender:</span>
                    <span className="text-sm font-semibold">{productDetail.targeting?.demographics?.gender}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-md bg-muted/50">
                    <span className="text-sm text-muted-foreground">Age:</span>
                    <span className="text-sm font-semibold">{productDetail.targeting?.demographics?.age}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-md bg-muted/50 pt-3 border-t">
                    <span className="text-sm font-medium">Total Audience Size:</span>
                    <span className="text-sm font-bold text-primary">
                      {productDetail.targeting?.demographics?.totalAudienceSize}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Competition & Metrics */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Competition & Key Metrics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Stores selling this product</h4>
                <div className="space-y-1">
                  {productDetail.competition?.stores?.map((store: string, idx: number) => (
                    <div key={idx} className="text-sm text-muted-foreground">
                      • {store}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">Key Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Revenue:</span>
                    <span className="text-sm font-semibold">
                      ${productDetail.competition?.metrics?.monthlyRevenue?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Sales:</span>
                    <span className="text-sm font-semibold">
                      {productDetail.competition?.metrics?.monthlySales?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ROI:</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {productDetail.competition?.metrics?.roi}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">AliExpress Orders:</span>
                    <span className="text-sm font-semibold">
                      +{productDetail.competition?.metrics?.aliexpressOrders?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amazon Price:</span>
                    <span className="text-sm font-semibold">
                      ${productDetail.competition?.metrics?.amazonPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Product Specifications</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {Object.entries(productDetail.specifications || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-foreground">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Related Products */}
          <RelatedProductsCarousel 
            productIds={productDetail.relatedProducts || []}
            currentProductId={productId}
          />

          {/* Reviews Section */}
          <ReviewsSection reviews={productDetail.reviews || []} />

          {/* Instagram Influencers */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Instagram className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Fitting Instagram Influencers</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {productDetail.influencers?.map((handle: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-sm">
                  {handle}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Scroll to Top */}
          <div className="flex justify-center py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer"
            >
              Scroll to top
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

