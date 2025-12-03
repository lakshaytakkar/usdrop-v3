"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderTree, Edit, MoreVertical, TrendingUp, Package, DollarSign } from "lucide-react"
import { ProductCategory } from "@/types/admin/categories"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminCategoryCardProps {
  category: ProductCategory
  onEdit?: (category: ProductCategory) => void
  onViewDetails?: (category: ProductCategory) => void
  onDelete?: (category: ProductCategory) => void
  onViewProducts?: (category: ProductCategory) => void
  onDuplicate?: (category: ProductCategory) => void
  canEdit?: boolean
  canDelete?: boolean
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function AdminCategoryCard({
  category,
  onEdit,
  onViewDetails,
  onDelete,
  onViewProducts,
  onDuplicate,
  canEdit = true,
  canDelete = true,
}: AdminCategoryCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <FolderTree className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(category)}>
                  View Details
                </DropdownMenuItem>
              )}
              {onViewProducts && (
                <DropdownMenuItem onClick={() => onViewProducts(category)}>
                  View Products
                </DropdownMenuItem>
              )}
              {canEdit && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(category)}>
                  Edit
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(category)}>
                  Duplicate
                </DropdownMenuItem>
              )}
              {canDelete && onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(category)} className="text-destructive">
                    <FolderTree className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {category.trending && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold mb-1 line-clamp-2">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Products</span>
            </div>
            <span className="font-semibold">{category.product_count}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Avg Margin</span>
            </div>
            <span className="font-semibold">{category.avg_profit_margin !== null ? `${category.avg_profit_margin.toFixed(1)}%` : 'N/A'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Growth</span>
            </div>
            <span className="font-semibold text-green-600">{category.growth_percentage !== null ? `${category.growth_percentage.toFixed(1)}%` : 'N/A'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        {onViewProducts && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewProducts(category)}
          >
            <Package className="h-4 w-4 mr-2" />
            View Products
          </Button>
        )}
        {canEdit && onEdit && (
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onEdit(category)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

