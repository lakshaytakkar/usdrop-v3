

import { apiFetch } from '@/lib/supabase'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ShineBorder } from '@/components/ui/shine-border';
import { X, Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Product } from '@/types/products';

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

interface HotProductsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HotProductsModal({ open, onOpenChange }: HotProductsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          page: '1',
          pageSize: '20',
          sortBy: 'created_at',
          sortOrder: 'desc',
        });
        
        const response = await apiFetch(`/api/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        // Map database products to display format
        const mappedProducts: ProductDisplay[] = data.products.map((product: Product) => ({
          id: product.id,
          name: product.title,
          profit: currencyFormatter.format(product.profit_per_order),
          buyPrice: currencyFormatter.format(product.buy_price),
          sellPrice: currencyFormatter.format(product.sell_price),
          image: product.image || '/images/landing/product-moon-lamp.png', // fallback image
        }));
        
        setProducts(mappedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchProducts();
    }
  }, [open]);

  // Reset index when modal closes
  React.useEffect(() => {
    if (!open) {
      setCurrentIndex(0);
      setDirection(null);
    }
  }, [open]);

  const handleSwipe = (dir: 'left' | 'right') => {
    if (products.length === 0) return;
    
    setDirection(dir);
    setTimeout(() => {
      if (currentIndex < products.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Reset to beginning when all products are swiped
        setCurrentIndex(0);
      }
      setDirection(null);
    }, 300);
  };

  // Show loading or error state
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md w-full p-0 bg-transparent border-0 shadow-none" showCloseButton={false}>
          <DialogTitle className="sr-only">Hot products this week</DialogTitle>
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading products...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || products.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md w-full p-0 bg-transparent border-0 shadow-none" showCloseButton={false}>
          <DialogTitle className="sr-only">Hot products this week</DialogTitle>
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="text-center">
              <p className="text-red-600 mb-2">Failed to load products</p>
              <p className="text-slate-600 text-sm">{error || 'No products available'}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const product = products[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-md w-full p-0 bg-transparent border-0 shadow-none" 
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Hot products this week</DialogTitle>
        <div className="flex justify-center items-center min-h-[500px] perspective-1000 relative">
          {/* Background Cards for stack effect */}
          <div className="absolute top-4 w-[340px] h-[500px] bg-white border border-slate-200 rounded-3xl shadow-sm scale-95 opacity-50 z-0"></div>
          <div className="absolute top-2 w-[340px] h-[500px] bg-white border border-slate-200 rounded-3xl shadow-md scale-[0.98] opacity-80 z-10"></div>
          
          {/* Active Card with ShineBorder */}
          <div className="relative w-[340px] h-[500px] z-20 rounded-3xl overflow-hidden isolate">
            <ShineBorder
              shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
              borderWidth={2}
              duration={8}
              className="rounded-3xl"
            />
            <div 
              className={cn(
                "absolute inset-[2px] bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-[300ms]",
                direction === 'left' ? '-translate-x-24 -rotate-12 opacity-0' : 
                direction === 'right' ? 'translate-x-24 rotate-12 opacity-0' : ''
              )}
            >
                <div className="h-3/5 bg-slate-50 relative">
                  <div className="w-full h-full relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                     
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

