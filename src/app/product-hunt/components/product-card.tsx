"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Star, 
  Bookmark,
  Eye,
  Flame,
  Lock
} from "lucide-react"
import { Area, AreaChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

interface ProductCardProps {
  product: {
    id: number | string
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
  isLocked?: boolean
  onLockedClick?: () => void
}

export function ProductCard({ product, isLocked = false, onLockedClick }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const profitMargin = product.sellPrice > 0 
    ? ((product.profitPerOrder / product.sellPrice) * 100).toFixed(1)
    : "0.0"

  // Calculate trend direction
  const trendDirection = product.trendData.length >= 2
    ? product.trendData[product.trendData.length - 1] > product.trendData[0] ? "up" : "down"
    : "neutral"

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 p-0">
      {/* Image Section */}
      <div 
        className="relative aspect-square overflow-hidden bg-muted cursor-pointer"
        onClick={() => {
          // Navigate to product details page
          window.location.href = `/product-hunt/${product.id}`
        }}
      >
        {imageError ? (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <Image
              src="/placeholder.svg"
              alt="Placeholder"
              width={300}
              height={300}
              className="object-cover opacity-30"
            />
          </div>
        ) : (
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className={`object-cover transition-all duration-300 ${isLocked ? "blur-md" : ""}`}
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {product.trending && (
            <Badge className="bg-orange-500/90 text-white border-0 text-xs px-2 py-0.5">
              <Flame className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {product.category}
          </Badge>
        </div>

        {/* Save Button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-all shadow-sm"
        >
          <Bookmark 
            className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : "text-muted-foreground"}`} 
          />
        </button>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200" />
        
        {/* Locked Overlay - Only on Image */}
        {isLocked && (
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 z-20 flex items-center justify-center cursor-pointer transition-all duration-300 hover:from-black/50 hover:via-black/70 hover:to-black/90 group/lock"
            onClick={(e) => {
              e.stopPropagation()
              onLockedClick?.()
            }}
          >
            <div className="text-center space-y-3 transform transition-all duration-300 group-hover/lock:scale-105">
              {/* Enhanced Lock Icon */}
              <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl border-4 border-white/20 backdrop-blur-sm relative overflow-hidden">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover/lock:translate-x-full transition-transform duration-700" />
                <Lock className="h-9 w-9 text-white relative z-10 drop-shadow-lg" strokeWidth={2.5} />
              </div>
              
              {/* Text */}
              <div className="space-y-1">
                <p className="text-white text-base font-bold drop-shadow-lg">Premium Content</p>
                <p className="text-white/90 text-sm font-medium drop-shadow">Click to Upgrade</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`px-2.5 pt-1 pb-2.5 space-y-2 relative ${isLocked ? "pointer-events-none" : ""}`}>
        {/* Title */}
        <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] text-foreground leading-tight">
          {product.title}
        </h3>

        {/* Mini Area Chart */}
        <div className="h-12 w-full">
          <ChartContainer 
            config={{
              value: {
                label: "Trend",
                color: trendDirection === "up" ? "hsl(142.1 76.2% 36.3%)" : "hsl(0 84.2% 60.2%)",
              },
            } satisfies ChartConfig}
            className="h-full w-full"
          >
            <AreaChart
              data={product.trendData.map((value, index) => ({
                index,
                value,
              }))}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={`gradient-${product.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={trendDirection === "up" ? "hsl(142.1 76.2% 36.3%)" : "hsl(0 84.2% 60.2%)"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor={trendDirection === "up" ? "hsl(142.1 76.2% 36.3%)" : "hsl(0 84.2% 60.2%)"}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="value"
                type="monotone"
                fill={`url(#gradient-${product.id})`}
                fillOpacity={1}
                stroke={trendDirection === "up" ? "hsl(142.1 76.2% 36.3%)" : "hsl(0 84.2% 60.2%)"}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-0.5">
            <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Buy Price</p>
            <p className="font-semibold text-foreground">${product.buyPrice.toFixed(2)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Sell Price</p>
            <p className="font-semibold text-primary">${product.sellPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Profit Section */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Profit/Order</p>
            <p className="font-bold text-emerald-600 text-base">
              ${product.profitPerOrder.toFixed(2)}
            </p>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {profitMargin}% margin
          </Badge>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            onClick={() => window.location.href = `/product-hunt/${product.id}`}
          >
            <Eye className="h-3 w-3 mr-1" />
            Details
          </Button>
          <Button size="sm" className="flex-1 h-8 text-xs">
            <Bookmark className="h-3 w-3 mr-1" />
            Save
          </Button>
        </div>

        {/* Skeleton Overlay for Locked State */}
        {isLocked && (
          <div className="absolute inset-0 bg-background z-10 rounded-b-lg">
            <div className="p-2.5 space-y-2">
              {/* Title skeleton */}
              <div className="space-y-1.5 animate-pulse">
                <div className="h-3 bg-muted/80 rounded-md w-3/4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <div className="h-3 bg-muted/80 rounded-md w-1/2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              
              {/* Chart skeleton */}
              <div className="h-12 bg-muted/80 rounded-lg animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
              
              {/* Pricing skeleton */}
              <div className="grid grid-cols-2 gap-2 animate-pulse">
                <div className="space-y-1">
                  <div className="h-2 bg-muted/80 rounded w-2/3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                  <div className="h-3 bg-muted/80 rounded-md w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-2 bg-muted/80 rounded w-2/3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                  <div className="h-3 bg-muted/80 rounded-md w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
              
              {/* Profit skeleton */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50 animate-pulse">
                <div className="space-y-1">
                  <div className="h-2 bg-muted/80 rounded w-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                  <div className="h-4 bg-muted/80 rounded-md w-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <div className="h-6 bg-muted/80 rounded-md w-20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              
              {/* Rating skeleton */}
              <div className="flex items-center gap-1.5 animate-pulse">
                <div className="h-3 w-3 bg-muted/80 rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <div className="h-3 bg-muted/80 rounded w-16 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              
              {/* Buttons skeleton */}
              <div className="flex gap-2 pt-1 animate-pulse">
                <div className="h-8 bg-muted/80 rounded-md flex-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <div className="h-8 bg-muted/80 rounded-md flex-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

