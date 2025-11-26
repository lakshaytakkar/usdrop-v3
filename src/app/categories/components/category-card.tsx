"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Package,
  Flame,
  ChevronRight
} from "lucide-react"
import { Category } from "../data/categories"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
      {/* Image Section */}
      <div className="relative h-32 overflow-hidden bg-muted">
        {imageError ? (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Package className="h-16 w-16 text-primary/30" />
          </div>
        ) : (
          <>
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
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

        {/* Category Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-lg drop-shadow-lg">
            {category.name}
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 space-y-2">
        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
          {category.description}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Products</p>
            <p className="font-bold text-sm">{category.productCount.toLocaleString()}</p>
          </div>
          <div className="text-center border-x">
            <p className="text-xs text-muted-foreground mb-0.5">Avg Profit</p>
            <p className="font-bold text-sm">{category.avgProfitMargin.toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Growth</p>
            <p className="font-bold text-sm">+{category.growth.toFixed(1)}%</p>
          </div>
        </div>

        {/* Subcategories */}
        {category.subcategories.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-1">
              {category.subcategories.slice(0, 3).map((sub) => (
                <Badge key={sub} variant="secondary" className="text-xs">
                  {sub}
                </Badge>
              ))}
              {category.subcategories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{category.subcategories.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
          size="sm"
        >
          Explore
          <ChevronRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  )
}

