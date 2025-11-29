"use client"

import Image from "next/image"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Lock, LockOpen, Trash2, Star } from "lucide-react"
import { HandPickedProduct, ProductPick } from "@/types/admin/products"

type ProductType = HandPickedProduct | ProductPick

interface ProductsTableProps {
  products: ProductType[]
  productType: "hand-picked" | "product-picks"
  selectedProducts: ProductType[]
  onSelectProduct: (product: ProductType, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onViewDetails: (product: ProductType) => void
  onToggleLock?: (product: HandPickedProduct) => void
  onDelete: (product: ProductType) => void
}

export function ProductsTable({
  products,
  productType,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onViewDetails,
  onToggleLock,
  onDelete,
}: ProductsTableProps) {
  const allSelected = products.length > 0 && selectedProducts.length === products.length
  const someSelected = selectedProducts.length > 0 && selectedProducts.length < products.length

  const isHandPicked = productType === "hand-picked"

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
            />
          </TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          {isHandPicked ? (
            <>
              <TableHead>Category</TableHead>
              <TableHead>Profit Margin</TableHead>
              <TableHead>Pot Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Found Date</TableHead>
            </>
          ) : (
            <>
              <TableHead>Buy Price</TableHead>
              <TableHead>Sell Price</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Supplier</TableHead>
            </>
          )}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={isHandPicked ? 9 : 10}
              className="text-center py-8 text-muted-foreground"
            >
              No products found
            </TableCell>
          </TableRow>
        ) : (
          products.map((product) => {
            const isSelected = selectedProducts.some((p) => p.id === product.id)
            const handPicked = product as HandPickedProduct
            const productPick = product as ProductPick

            return (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectProduct(product, checked as boolean)}
                    aria-label={`Select product ${product.id}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{product.title}</span>
                </TableCell>
                {isHandPicked ? (
                  <>
                    <TableCell>
                      <Badge variant="outline">{handPicked.category.replace(/-/g, " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-emerald-600 font-medium">{handPicked.profit_margin}%</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${handPicked.pot_revenue.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={handPicked.is_locked ? "destructive" : "default"}>
                        {handPicked.is_locked ? "Locked" : "Unlocked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(handPicked.found_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>
                      <span>${productPick.buy_price.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${productPick.sell_price.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-emerald-600 font-medium">
                        ${productPick.profit_per_order.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{productPick.category.replace(/-/g, " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      {productPick.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{productPick.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">
                            ({productPick.reviews_count})
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {productPick.supplier ? (
                        <span className="text-sm">{productPick.supplier.name}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                  </>
                )}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(product)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {isHandPicked && onToggleLock && (
                        <DropdownMenuItem onClick={() => onToggleLock(handPicked)}>
                          {handPicked.is_locked ? (
                            <>
                              <LockOpen className="h-4 w-4 mr-2" />
                              Unlock
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Lock
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete(product)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}







