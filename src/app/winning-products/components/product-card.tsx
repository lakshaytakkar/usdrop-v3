"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  DollarSign,
  Lock,
  Eye
} from "lucide-react"
// Local WinningProduct type (matches the transformed type from the page)
export interface WinningProduct {
  id: number;
  image: string;
  title: string;
  profitMargin: number;
  potRevenue: number;
  category: string;
  isLocked: boolean;
  foundDate: string;
  revenueGrowthRate: number;
  itemsSold: number;
  avgUnitPrice: number;
  revenueTrend: number[];
  price: number;
}

interface ProductCardProps {
  product: WinningProduct
  onLockedClick?: () => void
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

export function WinningProductCard({ product, onLockedClick }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 p-0">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {imageError ? (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <Image
              src="/demo-products/Screenshot 2024-07-24 185228.png"
              alt="Placeholder"
              width={300}
              height={300}
              className="object-cover opacity-30"
            />
          </div>
        ) : (
          <Image
            src={product.image || "/demo-products/Screenshot 2024-07-24 185228.png"}
            alt={product.title}
            fill
            className={`object-cover transition-all duration-300 ${product.isLocked ? "blur-md" : ""}`}
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Date Badge */}
        {!product.isLocked && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary/90 text-white border-0 text-xs backdrop-blur-sm">
              {formatDate(product.foundDate)}
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs capitalize">
            {product.category.replace("-", " ")}
          </Badge>
        </div>

        {/* Locked Overlay - Only on Image */}
        {product.isLocked && (
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 z-20 flex items-center justify-center cursor-pointer transition-all duration-300 hover:from-black/50 hover:via-black/70 hover:to-black/90 group/lock"
            onClick={(e) => {
              e.stopPropagation()
              onLockedClick?.()
            }}
          >
            <div className="text-center space-y-3 transform transition-all duration-300 group-hover/lock:scale-105">
              {/* Enhanced Lock Icon */}
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl border-4 border-white/20 backdrop-blur-sm relative overflow-hidden">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover/lock:translate-x-full transition-transform duration-700" />
                <Lock className="h-7 w-7 text-white relative z-10 drop-shadow-lg" strokeWidth={2.5} />
              </div>
              
              {/* Text */}
              <div className="space-y-1">
                <p className="text-white text-sm font-bold drop-shadow-lg">Premium Product</p>
                <p className="text-white/90 text-xs font-medium drop-shadow">Click to Upgrade</p>
              </div>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200" />
      </div>

      {/* Content Section */}
      <div className={`px-3 pt-2 pb-3 space-y-2 relative ${product.isLocked ? "pointer-events-none" : ""}`}>
        {/* Title */}
        <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] text-foreground leading-tight">
          {product.title}
        </h3>

        {/* Metrics */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Profit Margin
            </span>
            <span className="font-bold text-emerald-600">
              ${product.profitMargin.toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              POT Revenue
            </span>
            <span className="font-semibold text-foreground">
              {formatCurrency(product.potRevenue)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {!product.isLocked && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full h-8 text-xs mt-2"
          >
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
        )}

        {/* Skeleton Overlay for Locked State */}
        {product.isLocked && (
          <div className="absolute inset-0 bg-background z-10 rounded-b-lg">
            <div className="p-3 space-y-2">
              {/* Title skeleton */}
              <div className="space-y-1.5 animate-pulse">
                <div className="h-3 bg-muted/80 rounded-md w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <div className="h-3 bg-muted/80 rounded-md w-2/3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              
              {/* Metrics skeleton */}
              <div className="space-y-1.5 animate-pulse pt-1">
                <div className="flex items-center justify-between">
                  <div className="h-2.5 bg-muted/80 rounded w-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                  <div className="h-3 bg-muted/80 rounded w-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-2.5 bg-muted/80 rounded w-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                  <div className="h-3 bg-muted/80 rounded w-14 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
              
              {/* Button skeleton */}
              <div className="h-8 bg-muted/80 rounded-md w-full mt-2 relative overflow-hidden animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

