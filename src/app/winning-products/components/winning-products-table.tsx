"use client"

import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, Eye } from "lucide-react"
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
import { RevenueTrendChart } from "./revenue-trend-chart"
import { cn } from "@/lib/utils"

interface WinningProductsTableProps {
  products: WinningProduct[]
  onProductClick?: (product: WinningProduct) => void
  onLockedClick?: () => void
}

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}m`
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`
  }
  return `$${amount.toFixed(0)}`
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

export function WinningProductsTable({ 
  products, 
  onProductClick,
  onLockedClick 
}: WinningProductsTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead className="min-w-[300px]">Product Info</TableHead>
            <TableHead className="w-32">Revenue</TableHead>
            <TableHead className="w-32">Revenue (10/29 ~ 11/27)</TableHead>
            <TableHead className="w-32">Revenue Growth Rate</TableHead>
            <TableHead className="w-28">Item Sold</TableHead>
            <TableHead className="w-32">Avg. Unit Price</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product, index) => {
              const isLocked = product.isLocked
              const rank = index + 1

              return (
                <TableRow
                  key={`${product.id}-${index}`}
                  className={cn(
                    "h-24 hover:bg-muted/50 transition-colors relative",
                    isLocked && "opacity-60"
                  )}
                >
                  {/* Rank */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold text-sm">
                        {rank}
                      </div>
                    </div>
                  </TableCell>

                  {/* Product Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className={cn(
                            "object-cover",
                            isLocked && "blur-sm"
                          )}
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "font-medium text-sm line-clamp-2 mb-1",
                          isLocked && "text-muted-foreground"
                        )}>
                          {product.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Revenue */}
                  <TableCell>
                    <span className={cn(
                      "font-semibold text-sm",
                      isLocked && "text-muted-foreground blur-[1px]"
                    )}>
                      {formatCurrency(product.potRevenue)}
                    </span>
                  </TableCell>

                  {/* Revenue Trend */}
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <div className={cn(isLocked && "blur-sm opacity-70")}>
                        <RevenueTrendChart 
                          data={product.revenueTrend} 
                          width={120} 
                          height={40}
                          className="text-blue-600"
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Revenue Growth Rate */}
                  <TableCell>
                    <Badge
                      variant={product.revenueGrowthRate > 100 ? "default" : "secondary"}
                      className={cn(
                        "text-xs font-semibold",
                        product.revenueGrowthRate > 999.9 && "bg-emerald-500 text-white",
                        isLocked && "blur-[1px] opacity-70"
                      )}
                    >
                      {product.revenueGrowthRate > 999.9 
                        ? ">999.9%" 
                        : `${product.revenueGrowthRate.toFixed(1)}%`}
                    </Badge>
                  </TableCell>

                  {/* Items Sold */}
                  <TableCell>
                    <span className={cn(
                      "text-sm font-medium",
                      isLocked && "text-muted-foreground blur-[1px]"
                    )}>
                      {formatNumber(product.itemsSold)}
                    </span>
                  </TableCell>

                  {/* Avg. Unit Price */}
                  <TableCell>
                    <span className={cn(
                      "text-sm font-medium",
                      isLocked && "text-muted-foreground blur-[1px]"
                    )}>
                      ${product.avgUnitPrice.toFixed(2)}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    {isLocked ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onLockedClick?.()
                        }}
                        className="h-8 text-xs cursor-pointer"
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        Unlock
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onProductClick?.(product)
                        }}
                        className="h-8 text-xs cursor-pointer"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

