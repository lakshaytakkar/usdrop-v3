"use client"

import { useState } from "react"
import { ProductCard } from "@/app/product-hunt/components/product-card"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import productsData from "@/app/product-hunt/data/products.json"

export default function KitPage() {
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)

  // Get first 4 products for demo
  const products = productsData.slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-3">
              UI Kit - Locked Product Cards
            </h1>
            <p className="text-muted-foreground text-lg">
              Playground for testing locked product card components with blur effects, 
              skeleton overlays, and upsell dialogs.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Product Cards Showcase</h2>
          <p className="text-muted-foreground">
            Mixed state: 2 unlocked cards and 2 locked cards requiring upgrade
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
          {/* Unlocked Card 1 */}
          <ProductCard 
            product={products[0]} 
            isLocked={false}
          />

          {/* Locked Card 1 */}
          <ProductCard 
            product={products[1]} 
            isLocked={true}
            onLockedClick={() => setIsUpsellOpen(true)}
          />

          {/* Unlocked Card 2 */}
          <ProductCard 
            product={products[2]} 
            isLocked={false}
          />

          {/* Locked Card 2 */}
          <ProductCard 
            product={products[3]} 
            isLocked={true}
            onLockedClick={() => setIsUpsellOpen(true)}
          />
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6">Locked Card Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2 text-lg">Blurred Image</h3>
              <p className="text-sm text-muted-foreground">
                Product images are blurred using CSS blur filter to create a teaser effect
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2 text-lg">Dark Overlay</h3>
              <p className="text-sm text-muted-foreground">
                Gradient overlay with lock icon indicates premium content
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2 text-lg">Skeleton Effect</h3>
              <p className="text-sm text-muted-foreground">
                Animated skeleton loader obscures pricing and analytics data
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2 text-lg">Upsell Dialog</h3>
              <p className="text-sm text-muted-foreground">
                Click locked cards to trigger pricing modal with upgrade options
              </p>
            </div>
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="mt-12 p-6 rounded-lg bg-muted max-w-4xl">
          <h3 className="font-semibold mb-3 text-lg">Implementation Notes</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <code className="px-1.5 py-0.5 rounded bg-background text-foreground">isLocked</code> prop 
                controls the locked state
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <code className="px-1.5 py-0.5 rounded bg-background text-foreground">onLockedClick</code> callback 
                triggers upsell dialog
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Locked cards have pointer-events disabled on content areas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Smooth transitions and hover effects enhance user experience</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Upsell Dialog */}
      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </div>
  )
}

