"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package,
  Flame,
  TrendingUp,
  ChevronDown,
  Box,
  DollarSign,
  BarChart3
} from "lucide-react"
import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
} from "@/components/ui/expandable"
import { cn } from "@/lib/utils"

// Local Category type for the card component
export interface Category {
  id: string | number;
  name: string;
  description: string;
  image: string;
  productCount: number;
  avgProfitMargin: number;
  growth: number;
  trending: boolean;
  subcategories: string[];
}

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Expandable
      expandDirection="both"
      expandBehavior="replace"
      initialDelay={0.2}
    >
      {({ isExpanded }) => (
        <ExpandableCard
          className="w-full relative bg-card border rounded-xl shadow-sm flex flex-col overflow-hidden"
          collapsedSize={{ width: "100%", height: "auto" }}
          expandedSize={{ width: "100%", height: "auto" }}
          hoverToExpand={false}
          expandDelay={300}
          collapseDelay={300}
        >
            <ExpandableCardHeader className="p-0 overflow-hidden rounded-t-xl">
              {/* Image Section - Fully visible, no overlay */}
              <div className="relative h-40 sm:h-48 overflow-hidden bg-muted">
                {imageError ? (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <Package className="h-16 w-16 text-primary/30" />
                  </div>
                ) : (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                )}
                
                {/* Trending Badge */}
                {category.trending && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-orange-500/90 text-white border-0 backdrop-blur-sm">
                      <Flame className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                )}
              </div>
            </ExpandableCardHeader>

            <ExpandableCardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4 flex-1 min-h-0 overflow-visible">
              {/* Category Title */}
              <div>
                <h3 className="text-foreground font-bold text-lg sm:text-xl">
                  {category.name}
                </h3>
              </div>

              {/* Quick Takeaways Tiles - Always visible */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {/* Products Tile */}
                <div className="bg-muted/50 rounded-lg p-2 sm:p-3 border border-border/50">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                    <Box className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Products</p>
                  </div>
                  <p className="text-sm sm:text-lg font-bold text-foreground truncate">
                    {category.productCount.toLocaleString()}
                  </p>
                </div>

                {/* Profit Tile */}
                <div className="bg-muted/50 rounded-lg p-2 sm:p-3 border border-border/50">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                    <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Profit</p>
                  </div>
                  <p className="text-sm sm:text-lg font-bold text-foreground truncate">
                    {category.avgProfitMargin.toFixed(1)}%
                  </p>
                </div>

                {/* Growth Tile */}
                <div className="bg-muted/50 rounded-lg p-2 sm:p-3 border border-border/50">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                    <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Growth</p>
                  </div>
                  <p className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400 truncate">
                    +{category.growth.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Description - Collapsed state */}
              {!isExpanded && (
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              )}

              {/* Expanded Content with animations */}
              <ExpandableContent
                preset="fade"
                keepMounted={false}
                animateIn={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
              >
                <div className="space-y-3 sm:space-y-4 pt-2 border-t">
                  {/* Description Tile */}
                  <div className="bg-muted/30 rounded-lg p-3 sm:p-4 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-[10px] sm:text-xs font-semibold text-foreground uppercase tracking-wide">
                        Description
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Detailed Metrics Tiles */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {/* Total Products Tile */}
                    <div className="bg-muted/30 rounded-lg p-2 sm:p-3 border border-border/50">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-1.5 font-medium">Total Products</p>
                      <p className="text-base sm:text-xl font-bold text-foreground truncate">
                        {category.productCount.toLocaleString()}
                      </p>
                    </div>

                    {/* Profit Margin Tile */}
                    <div className="bg-muted/30 rounded-lg p-2 sm:p-3 border border-border/50">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-1.5 font-medium">Avg Profit Margin</p>
                      <p className="text-base sm:text-xl font-bold text-foreground truncate">
                        {category.avgProfitMargin.toFixed(1)}%
                      </p>
                    </div>

                    {/* Growth Rate Tile */}
                    <div className="bg-muted/30 rounded-lg p-2 sm:p-3 border border-border/50">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-1.5 font-medium">Growth Rate</p>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <p className="text-base sm:text-xl font-bold text-green-600 dark:text-green-400 truncate">
                          +{category.growth.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Status Tile */}
                    <div className="bg-muted/30 rounded-lg p-2 sm:p-3 border border-border/50">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-1.5 font-medium">Status</p>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {category.trending ? (
                          <>
                            <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
                            <p className="text-base sm:text-xl font-bold text-foreground truncate">Trending</p>
                          </>
                        ) : (
                          <p className="text-base sm:text-xl font-bold text-foreground truncate">Active</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ExpandableContent>
            </ExpandableCardContent>

            {/* Footer with Expand Button - Always visible */}
            <ExpandableCardFooter className="!p-3 sm:!p-4 !pt-2 sm:!pt-3 border-t mt-auto shrink-0 bg-card z-10 relative rounded-b-xl flex-shrink-0">
              <ExpandableTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className={cn(
                    "w-full font-mono text-[10px] sm:text-xs transition-all duration-300 hover:opacity-90 h-8 sm:h-9",
                    isExpanded ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                  )}
                >
                  {isExpanded ? "COLLAPSE" : "EXPAND"}
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 sm:h-3.5 sm:w-3.5 ml-1.5 sm:ml-2 transition-transform duration-300 flex-shrink-0",
                      isExpanded && "rotate-180"
                    )}
                  />
                </Button>
              </ExpandableTrigger>
            </ExpandableCardFooter>
          </ExpandableCard>
      )}
    </Expandable>
  )
}

