"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ChevronLeft, ChevronRight, Package } from "lucide-react"
import { useState, useRef } from "react"
import { Product } from "@/types/products"

interface RelatedProductsCarouselProps {
  productIds?: string[]
  currentProductId: string
  products?: Product[]
}

export function RelatedProductsCarousel({ productIds = [], currentProductId, products = [] }: RelatedProductsCarouselProps) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  
  // Filter products: exclude current product and optionally filter by productIds
  let relatedProducts = products.filter(p => {
    // Always exclude current product
    if (p.id.toString() === currentProductId || p.id === currentProductId) {
      return false
    }
    // If productIds provided, only include those
    if (productIds.length > 0) {
      return productIds.includes(p.id.toString()) || productIds.includes(p.id as string)
    }
    // Otherwise include all except current
    return true
  })
  
  // Limit to 10 products max
  relatedProducts = relatedProducts.slice(0, 10)
  
  // Get image URL for a product
  const getProductImage = (product: Product): string => {
    if (product.image) {
      return product.image
    }
    if (product.additional_images && product.additional_images.length > 0) {
      return product.additional_images[0]
    }
    return "/placeholder-product.jpg"
  }
  
  const handleImageError = (productId: string | number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  const title = productIds.length > 0 ? "Product Complements & Upsales" : "More Products"
  
  return (
    <Card className="p-4 min-w-0">
      <div className="flex items-center justify-between mb-4 min-w-0">
        <h3 className="font-semibold min-w-0 truncate">{title}</h3>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("left")}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("right")}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {relatedProducts.length > 0 ? (
          relatedProducts.map((product) => {
            const productImage = getProductImage(product)
            const imageError = imageErrors[product.id]
            
            return (
              <Card
                key={product.id}
                className="min-w-[200px] overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/product-hunt/${product.id}`)}
              >
                <div className="relative aspect-square w-full bg-muted">
                  {imageError ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  ) : (
                    <Image
                      src={productImage}
                      alt={product.title}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(product.id)}
                      sizes="(max-width: 768px) 50vw, 200px"
                    />
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <h4 className="font-semibold text-sm line-clamp-2">{product.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      ${(product.buy_price || 0).toFixed(2)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle AliExpress link
                      }}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      AliExpress
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          <div className="w-full py-8 text-center text-sm text-muted-foreground">
            No products available
          </div>
        )}
      </div>
    </Card>
  )
}

