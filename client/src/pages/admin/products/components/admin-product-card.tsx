


import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Lock, LockOpen, Edit, MoreVertical, TrendingUp, DollarSign, Star, Building } from "lucide-react"
import { HandPickedProduct, ProductPick } from "@/types/admin/products"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ProductUnion = HandPickedProduct | ProductPick

interface AdminProductCardProps {
  product: ProductUnion
  productType: "hand-picked" | "product-picks"
  onEdit?: (product: ProductUnion) => void
  onViewDetails?: (product: ProductUnion) => void
  onDelete?: (product: ProductUnion) => void
  onToggleLock?: (product: HandPickedProduct) => void
  onDuplicate?: (product: ProductUnion) => void
  onViewCategory?: (product: ProductUnion) => void
  onViewSupplier?: (product: ProductUnion) => void
  onOpenDrawer?: (product: ProductUnion) => void
  canEdit?: boolean
  canDelete?: boolean
  canLockUnlock?: boolean
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function AdminProductCard({
  product,
  productType,
  onEdit,
  onViewDetails,
  onDelete,
  onToggleLock,
  onDuplicate,
  onViewCategory,
  onViewSupplier,
  onOpenDrawer,
  canEdit = true,
  canDelete = true,
  canLockUnlock = true,
}: AdminProductCardProps) {
  const isHandPicked = productType === "hand-picked"
  const handPicked = product as HandPickedProduct
  const productPick = product as ProductPick

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons, dropdown, or interactive elements
    const target = e.target as HTMLElement
    if (
      target.closest('button') ||
      target.closest('[role="menuitem"]') ||
      target.closest('[role="button"]') ||
      target.closest('[data-dropdown]') ||
      target.closest('a')
    ) {
      return
    }
    if (onOpenDrawer) {
      onOpenDrawer(product)
    } else if (onViewDetails) {
      onViewDetails(product)
    }
  }

  return (
    <Card 
      className="flex h-full flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-t-xl">
        {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
          <img
            src={product.image}
            alt={product.title}
           
            className="object-cover"
           
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Package className="h-12 w-12 text-muted-foreground" />
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
                <DropdownMenuItem onClick={() => onViewDetails(product)}>
                  View Details
                </DropdownMenuItem>
              )}
              {canEdit && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  Edit
                </DropdownMenuItem>
              )}
              {isHandPicked && canLockUnlock && onToggleLock && (
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
              {onViewCategory && (
                <DropdownMenuItem onClick={() => onViewCategory(product)}>
                  View Category
                </DropdownMenuItem>
              )}
              {onViewSupplier && (
                <DropdownMenuItem onClick={() => onViewSupplier(product)}>
                  View Supplier
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(product)}>
                  Duplicate
                </DropdownMenuItem>
              )}
              {canDelete && onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(product)} className="text-destructive">
                    <Package className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isHandPicked && handPicked.is_locked && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-background/80">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold mb-1 line-clamp-2">{product.title}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{product.category.replace(/-/g, " ")}</Badge>
          {isHandPicked ? (
            <>
              <Badge variant="secondary">
                {handPicked.profit_margin}% Margin
              </Badge>
            </>
          ) : (
            <>
              {productPick.rating && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {productPick.rating.toFixed(1)}
                </Badge>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t">
          {isHandPicked ? (
            <>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Pot. Revenue</span>
                </div>
                <span className="font-semibold">{currencyFormatter.format(handPicked.pot_revenue)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Margin</span>
                </div>
                <span className="font-semibold">{handPicked.profit_margin}%</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Buy Price</span>
                <span className="font-semibold">{currencyFormatter.format(productPick.buy_price)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Sell Price</span>
                <span className="font-semibold">{currencyFormatter.format(productPick.sell_price)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Profit</span>
                <span className="font-semibold text-green-600">{currencyFormatter.format(productPick.profit_per_order)}</span>
              </div>
            </>
          )}
        </div>

        {!isHandPicked && productPick.supplier && (
          <div className="flex items-center gap-2 text-xs">
            <Building className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{productPick.supplier.name}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        {isHandPicked && canLockUnlock && onToggleLock && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onToggleLock(handPicked)}
          >
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
          </Button>
        )}
        {canEdit && onEdit && (
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}











