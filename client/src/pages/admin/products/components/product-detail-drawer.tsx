


import { DetailDrawer } from "@/components/ui/detail-drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ShoppingCart, 
  Package, 
  Star, 
  Building, 
  Lock, 
  CheckCircle2,
  AlertCircle,
  BarChart3
} from "lucide-react"
import { HandPickedProduct, ProductPick } from "@/types/admin/products"
import { cn } from "@/lib/utils"
import GradientButton from "@/components/kokonutui/gradient-button"

type ProductUnion = HandPickedProduct | ProductPick

interface ProductDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductUnion | null
  productType: "hand-picked" | "product-picks"
  onImportToShopify?: (product: ProductUnion) => void
  onEdit?: (product: ProductUnion) => void
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function ProductDetailDrawer({
  open,
  onOpenChange,
  product,
  productType,
  onImportToShopify,
  onEdit,
}: ProductDetailDrawerProps) {
  if (!product) return null

  const isHandPicked = productType === "hand-picked"
  const handPicked = product as HandPickedProduct
  const productPick = product as ProductPick

  const handleImportToShopify = () => {
    if (onImportToShopify) {
      onImportToShopify(product)
    }
  }

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      content: (
        <div className="space-y-6">
          {/* Product Image */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
            {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
              <img
                src={product.image}
                alt={product.title}
               
                className="object-cover"
               
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Title & Category */}
          <div>
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{product.category.replace(/-/g, " ")}</Badge>
              {isHandPicked && handPicked.is_locked && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Locked
                </Badge>
              )}
              {!isHandPicked && productPick.rating && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {productPick.rating.toFixed(1)}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Pricing Card */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold mb-3">Pricing Information</h3>
              {isHandPicked ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Profit Margin</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {handPicked.profit_margin}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Potential Revenue</span>
                    <span className="text-sm font-semibold">
                      {currencyFormatter.format(handPicked.pot_revenue)}
                    </span>
                  </div>
                  {handPicked.unlock_price && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Unlock Price</span>
                      <span className="text-sm font-semibold">
                        {currencyFormatter.format(handPicked.unlock_price)}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Buy Price</span>
                    <span className="text-sm font-semibold">
                      {currencyFormatter.format(productPick.buy_price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sell Price</span>
                    <span className="text-sm font-semibold">
                      {currencyFormatter.format(productPick.sell_price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Profit per Order</span>
                    <span className="text-base font-bold text-emerald-600">
                      {currencyFormatter.format(productPick.profit_per_order)}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Supplier Information */}
          {(isHandPicked ? handPicked.supplier_info : productPick.supplier) && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Supplier Information</h3>
                </div>
                {isHandPicked && handPicked.supplier_info ? (
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Name</span>
                      <p className="text-sm font-medium">{handPicked.supplier_info.name}</p>
                    </div>
                    {handPicked.supplier_info.company_name && (
                      <div>
                        <span className="text-xs text-muted-foreground">Company</span>
                        <p className="text-sm font-medium">{handPicked.supplier_info.company_name}</p>
                      </div>
                    )}
                  </div>
                ) : productPick.supplier ? (
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Name</span>
                      <p className="text-sm font-medium">{productPick.supplier.name}</p>
                    </div>
                    {productPick.supplier.company_name && (
                      <div>
                        <span className="text-xs text-muted-foreground">Company</span>
                        <p className="text-sm font-medium">{productPick.supplier.company_name}</p>
                      </div>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Additional Images */}
          {!isHandPicked && productPick.additional_images && productPick.additional_images.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Additional Images</h3>
              <div className="grid grid-cols-2 gap-2">
                {productPick.additional_images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                     
                      className="object-cover"
                     
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      value: "details",
      label: "Details",
      content: (
        <div className="space-y-6">
          {/* Specifications */}
          {!isHandPicked && productPick.specifications && Object.keys(productPick.specifications).length > 0 && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold mb-3">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(productPick.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start py-2 border-b last:border-0">
                      <span className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-sm font-medium text-right ml-4">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hand-picked Specific Details */}
          {isHandPicked && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold mb-3">Product Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Found Date</span>
                    <span className="text-sm font-medium">
                      {new Date(handPicked.found_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {handPicked.filters && handPicked.filters.length > 0 && (
                    <div className="py-2 border-b">
                      <span className="text-sm text-muted-foreground block mb-2">Filters</span>
                      <div className="flex flex-wrap gap-2">
                        {handPicked.filters.map((filter, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {filter}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Pick Specific Details */}
          {!isHandPicked && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold mb-3">Product Information</h3>
                <div className="space-y-2">
                  {productPick.rating && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {productPick.rating.toFixed(1)} / 5.0
                        </span>
                        {productPick.reviews_count > 0 && (
                          <span className="text-sm text-muted-foreground">
                            ({productPick.reviews_count} reviews)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {productPick.trend_data && productPick.trend_data.length > 0 && (
                    <div className="py-2 border-b">
                      <span className="text-sm text-muted-foreground block mb-2">Trend Data</span>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {productPick.trend_data.length} data points available
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm font-medium">
                      {new Date(productPick.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ),
    },
    {
      value: "import",
      label: "Import",
      content: (
        <div className="space-y-6">
          {/* Import Checklist */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-sm font-semibold mb-3">Pre-Import Checklist</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={cn(
                    "h-5 w-5 shrink-0 mt-0.5",
                    product.title ? "text-emerald-600" : "text-muted-foreground"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Product Title</p>
                    <p className="text-xs text-muted-foreground">
                      {product.title ? "Ready to import" : "Missing product title"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={cn(
                    "h-5 w-5 shrink-0 mt-0.5",
                    product.image ? "text-emerald-600" : "text-muted-foreground"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Product Image</p>
                    <p className="text-xs text-muted-foreground">
                      {product.image ? "Ready to import" : "Missing product image"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={cn(
                    "h-5 w-5 shrink-0 mt-0.5",
                    isHandPicked ? handPicked.profit_margin > 0 : productPick.profit_per_order > 0
                      ? "text-emerald-600" 
                      : "text-muted-foreground"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pricing Information</p>
                    <p className="text-xs text-muted-foreground">
                      {isHandPicked 
                        ? handPicked.profit_margin > 0 
                          ? "Profit margin calculated" 
                          : "Missing profit margin"
                        : productPick.profit_per_order > 0
                          ? "Profit calculated"
                          : "Missing profit information"
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={cn(
                    "h-5 w-5 shrink-0 mt-0.5",
                    product.description ? "text-emerald-600" : "text-amber-600"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Product Description</p>
                    <p className="text-xs text-muted-foreground">
                      {product.description 
                        ? "Description available" 
                        : "Description recommended for better SEO"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Import Actions */}
          <div className="space-y-3">
            <GradientButton
              variant="purple"
              onClick={handleImportToShopify}
              className="w-full"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Import to Shopify
            </GradientButton>
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => {
                  onEdit(product)
                  onOpenChange(false)
                }}
                className="w-full"
              >
                Edit Product Details
              </Button>
            )}
          </div>

          {/* Import Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Import Information</p>
                  <p className="text-xs text-muted-foreground">
                    This will create a new product in your Shopify store with the current product details. 
                    You can edit the product in Shopify after import.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ]

  const headerActions = (
    <>
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onEdit(product)
            onOpenChange(false)
          }}
        >
          Edit
        </Button>
      )}
    </>
  )

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={product.title}
      tabs={tabs}
      defaultTab="overview"
      headerActions={headerActions}
    />
  )
}

