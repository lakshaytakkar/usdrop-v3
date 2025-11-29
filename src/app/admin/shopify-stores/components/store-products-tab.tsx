"use client"

import { ShopifyStore, StoreProduct } from "@/app/shopify-stores/data/stores"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, RefreshCw } from "lucide-react"

interface StoreProductsTabProps {
  store: ShopifyStore
  products: StoreProduct[]
  onAddProducts?: (store: ShopifyStore) => void
}

export function StoreProductsTab({
  store,
  products,
  onAddProducts,
}: StoreProductsTabProps) {
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Products ({products.length})</h3>
          <p className="text-xs text-muted-foreground">
            Manage products for {store.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Products
          </Button>
          {onAddProducts && (
            <Button
              size="sm"
              onClick={() => onAddProducts(store)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-1">No products found</p>
            <p className="text-xs text-muted-foreground mb-4">
              Start by adding products to this store
            </p>
            {onAddProducts && (
              <Button
                size="sm"
                onClick={() => onAddProducts(store)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative w-full h-48 bg-muted flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={
                      product.status === "active"
                        ? "default"
                        : product.status === "draft"
                        ? "secondary"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {product.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-1 line-clamp-2">{product.title}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold">
                    {formatCurrency(product.price, "USD")}
                  </span>
                  {product.compare_at_price && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(product.compare_at_price, "USD")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Stock: {product.inventory_count}</span>
                  {product.vendor && <span>• {product.vendor}</span>}
                </div>
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

