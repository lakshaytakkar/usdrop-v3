"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef } from "react"
import productsData from "../data/products.json"

interface RelatedProductsCarouselProps {
  productIds: number[]
  currentProductId: number
}

export function RelatedProductsCarousel({ productIds, currentProductId }: RelatedProductsCarouselProps) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const products = productsData as any[]
  
  const relatedProducts = products.filter(p => 
    productIds.includes(p.id) && p.id !== currentProductId
  )

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  if (relatedProducts.length === 0) return null

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Product Complements & Upsales</h3>
        <div className="flex gap-2">
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
        className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {relatedProducts.map((product) => (
          <Card
            key={product.id}
            className="min-w-[200px] overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/product-hunt/${product.id}`)}
          >
            <div className="relative aspect-square w-full bg-muted">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 space-y-2">
              <h4 className="font-semibold text-sm line-clamp-2">{product.title}</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">${product.buyPrice.toFixed(2)}</span>
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
        ))}
      </div>
    </Card>
  )
}

