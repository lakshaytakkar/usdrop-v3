"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Check } from "lucide-react"
import { ShineBorder } from "@/components/ui/shine-border"
import { cn } from "@/lib/utils"
import { Product } from "@/types/products"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

interface ProductDisplay {
  id: string;
  name: string;
  profit: string;
  buyPrice: string;
  sellPrice: string;
  image: string;
}

export function ProductSwipe() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [products, setProducts] = useState<ProductDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const params = new URLSearchParams({
          page: '1',
          pageSize: '20',
          sortBy: 'created_at',
          sortOrder: 'desc',
        })
        
        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        
        // Map database products to display format
        const mappedProducts: ProductDisplay[] = data.products.map((product: Product) => ({
          id: product.id,
          name: product.title,
          profit: currencyFormatter.format(product.profit_per_order),
          buyPrice: currencyFormatter.format(product.buy_price),
          sellPrice: currencyFormatter.format(product.sell_price),
          image: product.image || '/images/landing/product-moon-lamp.png', // fallback image
        }))
        
        setProducts(mappedProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleSwipe = (dir: 'left' | 'right') => {
    if (products.length === 0) return
    
    setDirection(dir)
    setTimeout(() => {
      if (currentIndex < products.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else {
        setCurrentIndex(0)
      }
      setDirection(null)
    }, 300)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative flex justify-center items-center perspective-1000">
        <div className="relative w-[340px] bg-white rounded-t-[24px] rounded-b-[24px] shadow-[4px_4px_40px_0px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex gap-2 items-center px-5 py-4 border-b border-slate-200">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
          <div className="p-10">
            <h3 className="text-[22px] font-semibold text-slate-900 mb-8 tracking-[-0.66px]">
              Product Discovery
            </h3>
            <div className="flex justify-center items-center h-[500px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading products...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || products.length === 0) {
    return (
      <div className="relative flex justify-center items-center perspective-1000">
        <div className="relative w-[340px] bg-white rounded-t-[24px] rounded-b-[24px] shadow-[4px_4px_40px_0px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex gap-2 items-center px-5 py-4 border-b border-slate-200">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
          <div className="p-10">
            <h3 className="text-[22px] font-semibold text-slate-900 mb-8 tracking-[-0.66px]">
              Product Discovery
            </h3>
            <div className="flex justify-center items-center h-[500px]">
              <div className="text-center">
                <p className="text-red-600 mb-2">Failed to load products</p>
                <p className="text-slate-600 text-sm">{error || 'No products available'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const product = products[currentIndex]

  return (
    <div className="relative flex justify-center items-center perspective-1000">
      {/* Card Container with macOS-style header */}
      <div className="relative w-[340px] bg-white rounded-t-[24px] rounded-b-[24px] shadow-[4px_4px_40px_0px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* macOS-style Header Dots */}
        <div className="flex gap-2 items-center px-5 py-4 border-b border-slate-200">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
        
        {/* Card Content */}
        <div className="p-10">
          <h3 className="text-[22px] font-semibold text-slate-900 mb-8 tracking-[-0.66px]">
            Product Discovery
          </h3>
          
          {/* ProductSwipe Card */}
          <div className="relative flex justify-center items-center h-[500px]">
            <ShineBorder
              shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
              borderWidth={2}
              duration={8}
              className="rounded-2xl w-full h-full"
            >
              <div 
                className={cn(
                  "bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-[300ms] w-full h-full relative",
                  direction === 'left' ? '-translate-x-24 -rotate-12 opacity-0' : 
                  direction === 'right' ? 'translate-x-24 rotate-12 opacity-0' : ''
                )}
              >
                <div className="h-3/5 bg-slate-50 relative">
                  <div className="w-full h-full relative">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 80vw, 300px"
                      quality={65}
                      className="object-cover"
                    />
                  </div>
                  {/* Floating Metrics */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-blue-600 border border-blue-100 shadow-sm whitespace-nowrap">
                      Buy Price: {product.buyPrice}
                    </div>
                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-purple-600 border border-purple-100 shadow-sm whitespace-nowrap">
                      Sell Price: {product.sellPrice}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-green-600 border border-green-100 shadow-sm whitespace-nowrap">
                      Est. Profit: {product.profit}
                    </div>
                  </div>
                </div>
                <div className="h-2/5 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h3>
                    <div className="flex gap-2 mb-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Trending</span>
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">US Stock</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleSwipe('left')}
                      className="h-12 rounded-xl border-2 border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleSwipe('right')}
                      className="h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center justify-center transition-all"
                    >
                      <Check className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                {/* Stamp Overlay */}
                {direction === 'right' && (
                  <div className="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-black text-2xl uppercase tracking-widest px-4 py-2 rounded -rotate-12 bg-white/50 backdrop-blur">
                    IMPORTED
                  </div>
                )}
                {direction === 'left' && (
                  <div className="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-black text-2xl uppercase tracking-widest px-4 py-2 rounded rotate-12 bg-white/50 backdrop-blur">
                    PASS
                  </div>
                )}
              </div>
            </ShineBorder>
          </div>
        </div>
      </div>
    </div>
  )
}


