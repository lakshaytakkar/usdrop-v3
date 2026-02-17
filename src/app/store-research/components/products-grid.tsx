"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { StoreProduct } from "../data/store-research-data"

interface ProductsGridProps {
  products: StoreProduct[]
}

export function ProductsGrid({ products }: ProductsGridProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Recently Added Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="h-full">
            <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>
            <CardContent className="p-4">
              <h4 className="text-sm font-semibold mb-2 line-clamp-2">{product.name}</h4>
              {product.price !== undefined && (
                <p className="text-base font-bold text-primary">{formatCurrency(product.price)}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

