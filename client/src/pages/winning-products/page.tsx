
import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, useCallback } from "react"
import { ModuleAccessGuard } from "@/components/auth/module-access-guard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { WinningProductsTable } from "./components/winning-products-table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, DollarSign, Star, SlidersHorizontal, ArrowUpDown, X, TrendingDown, Lock, Unlock } from "lucide-react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { FreeLearningCutoff } from "@/components/ui/free-learning-cutoff"
import { SectionError } from "@/components/ui/section-error"
import { EmptyState } from "@/components/ui/empty-state"
// Local types
export type ProductCategory = 
  | "all"
  | "fashion"
  | "home-decor"
  | "beauty"
  | "sports-fitness"
  | "kitchen"
  | "home-garden"
  | "gadgets"
  | "pets"
  | "mother-kids"
  | "other";

export interface WinningProduct {
  id: number;
  image: string;
  title: string;
  profitMargin: number;
  potRevenue: number;
  category: ProductCategory;
  isLocked: boolean;
  foundDate: string;
  revenueGrowthRate: number;
  itemsSold: number;
  avgUnitPrice: number;
  revenueTrend: number[];
  price: number;
}
import { Product } from "@/types/products"
import { Loader2, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Grid3x3,
  Home,
  Sparkles,
  Heart,
  Zap,
  Box,
  Baby,
  Dog,
  Leaf
} from "lucide-react"

const categories = [
  { id: "all" as ProductCategory, label: "All Products", icon: Grid3x3 },
  { id: "fashion" as ProductCategory, label: "Fashion", icon: Sparkles },
  { id: "home-decor" as ProductCategory, label: "Home Decor", icon: Home },
  { id: "beauty" as ProductCategory, label: "Beauty", icon: Heart },
  { id: "sports-fitness" as ProductCategory, label: "Sports & Fitness", icon: Zap },
  { id: "kitchen" as ProductCategory, label: "Kitchen", icon: Box },
  { id: "home-garden" as ProductCategory, label: "Home & Garden", icon: Leaf },
  { id: "gadgets" as ProductCategory, label: "Gadgets", icon: Zap },
  { id: "pets" as ProductCategory, label: "Pets", icon: Dog },
  { id: "mother-kids" as ProductCategory, label: "Mother & Kids", icon: Baby },
  { id: "other" as ProductCategory, label: "Other", icon: Box },
]

interface FilterState {
  category: string
  minPrice: string
  maxPrice: string
  minProfitMargin: string
  maxProfitMargin: string
  minRevenue: string
  maxRevenue: string
  minGrowthRate: string
  minItemsSold: string
  isLocked: boolean | null
}


export default function WinningProductsPage() {
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isFree, hasCompletedFreeLearning } = useOnboarding()
  
  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    minPrice: "",
    maxPrice: "",
    minProfitMargin: "",
    maxProfitMargin: "",
    minRevenue: "",
    maxRevenue: "",
    minGrowthRate: "",
    minItemsSold: "",
    isLocked: null
  })
  
  // Quick filter states
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  
  // Sort state
  const [sortBy, setSortBy] = useState<string>("newest")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  // Advanced filters open state
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)

  useEffect(() => {
    const handleQuickFilter = (e: Event) => {
      const detail = (e as CustomEvent).detail
      const filter = detail?.filter as string | null
      if (filter) {
        if (filter === 'high-revenue' || filter === 'high-growth') {
          applyQuickFilter(filter)
        } else {
          setSortBy(filter)
          setQuickFilter(null)
        }
      } else {
        setSortBy("newest")
        setQuickFilter(null)
        setFilters(prev => ({
          ...prev,
          minProfitMargin: "",
          minRevenue: "",
          minGrowthRate: "",
          isLocked: null
        }))
      }
    }
    window.addEventListener('quick-filter-change', handleQuickFilter)
    return () => window.removeEventListener('quick-filter-change', handleQuickFilter)
  }, [quickFilter])

  // Fetch winning products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const params = new URLSearchParams({
          is_winning: 'true',
          page: '1',
          pageSize: '100', // Get all winning products
          sortBy: 'created_at',
          sortOrder: 'desc',
        })
        
        const response = await apiFetch(`/api/products?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch winning products')
        }
        
        const data = await response.json()
        setProducts(data.products || [])
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching winning products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load products')
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  // Transform API products to WinningProduct format
  const winningProducts: WinningProduct[] = useMemo(() => {
    return products
      .filter(p => p.metadata?.is_winning)
      .map((product, index) => {
        const metadata = product.metadata!
        const categorySlug = product.category?.slug || 'other'
        
        return {
          id: parseInt(product.id) || index + 1,
          image: product.image,
          title: product.title,
          profitMargin: metadata.profit_margin || 0,
          potRevenue: metadata.pot_revenue || 0,
          category: (categorySlug as ProductCategory) || 'other',
          isLocked: metadata.is_locked || false, // Will be set by teaser lock in table
          foundDate: metadata.found_date || product.created_at,
          revenueGrowthRate: metadata.revenue_growth_rate || 0,
          itemsSold: metadata.items_sold || 0,
          avgUnitPrice: metadata.avg_unit_price || product.sell_price,
          revenueTrend: Array.isArray(metadata.revenue_trend) ? metadata.revenue_trend : (typeof metadata.revenue_trend === 'string' ? JSON.parse(metadata.revenue_trend) : []),
          price: product.sell_price,
        }
      })
  }, [products])

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.category !== "all") count++
    if (filters.minPrice || filters.maxPrice) count++
    if (filters.minProfitMargin || filters.maxProfitMargin) count++
    if (filters.minRevenue || filters.maxRevenue) count++
    if (filters.minGrowthRate) count++
    if (filters.minItemsSold) count++
    if (filters.isLocked !== null) count++
    return count
  }, [filters])
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      category: "all",
      minPrice: "",
      maxPrice: "",
      minProfitMargin: "",
      maxProfitMargin: "",
      minRevenue: "",
      maxRevenue: "",
      minGrowthRate: "",
      minItemsSold: "",
      isLocked: null
    })
    setQuickFilter(null)
  }
  
  // Apply quick filters
  const applyQuickFilter = (filter: string) => {
    if (quickFilter === filter) {
      setQuickFilter(null)
      setFilters(prev => ({
        ...prev,
        minProfitMargin: "",
        minRevenue: "",
        minGrowthRate: "",
        isLocked: null
      }))
    } else {
      setQuickFilter(filter)
      if (filter === 'high-revenue') {
        setFilters(prev => ({ ...prev, minRevenue: "10000", minProfitMargin: "", minGrowthRate: "", isLocked: null }))
      } else if (filter === 'high-growth') {
        setFilters(prev => ({ ...prev, minGrowthRate: "20", minRevenue: "", minProfitMargin: "", isLocked: null }))
      } else if (filter === 'unlocked') {
        setFilters(prev => ({ ...prev, isLocked: false, minRevenue: "", minProfitMargin: "", minGrowthRate: "" }))
      }
    }
  }
  
  // Sort products
  const sortedProducts = useMemo(() => {
    let sorted = [...winningProducts]
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'profit-margin-low':
        sorted.sort((a, b) => a.profitMargin - b.profitMargin)
        break
      case 'profit-margin-high':
        sorted.sort((a, b) => b.profitMargin - a.profitMargin)
        break
      case 'revenue-low':
        sorted.sort((a, b) => a.potRevenue - b.potRevenue)
        break
      case 'revenue-high':
        sorted.sort((a, b) => b.potRevenue - a.potRevenue)
        break
      case 'growth-low':
        sorted.sort((a, b) => a.revenueGrowthRate - b.revenueGrowthRate)
        break
      case 'growth-high':
        sorted.sort((a, b) => b.revenueGrowthRate - a.revenueGrowthRate)
        break
      case 'items-sold-low':
        sorted.sort((a, b) => a.itemsSold - b.itemsSold)
        break
      case 'items-sold-high':
        sorted.sort((a, b) => b.itemsSold - a.itemsSold)
        break
      case 'newest':
        sorted.sort((a, b) => new Date(b.foundDate).getTime() - new Date(a.foundDate).getTime())
        break
      case 'oldest':
        sorted.sort((a, b) => new Date(a.foundDate).getTime() - new Date(b.foundDate).getTime())
        break
      default:
        sorted.sort((a, b) => new Date(b.foundDate).getTime() - new Date(a.foundDate).getTime())
    }
    
    return sorted
  }, [winningProducts, sortBy])
  
  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...sortedProducts]

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(p => p.category === filters.category)
    }
    
    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice))
    }
    
    // Profit margin filters
    if (filters.minProfitMargin) {
      filtered = filtered.filter(p => p.profitMargin >= parseFloat(filters.minProfitMargin))
    }
    if (filters.maxProfitMargin) {
      filtered = filtered.filter(p => p.profitMargin <= parseFloat(filters.maxProfitMargin))
    }
    
    // Revenue filters
    if (filters.minRevenue) {
      filtered = filtered.filter(p => p.potRevenue >= parseFloat(filters.minRevenue))
    }
    if (filters.maxRevenue) {
      filtered = filtered.filter(p => p.potRevenue <= parseFloat(filters.maxRevenue))
    }
    
    // Growth rate filter
    if (filters.minGrowthRate) {
      filtered = filtered.filter(p => p.revenueGrowthRate >= parseFloat(filters.minGrowthRate))
    }
    
    // Items sold filter
    if (filters.minItemsSold) {
      filtered = filtered.filter(p => p.itemsSold >= parseInt(filters.minItemsSold))
    }
    
    // Locked filter
    if (filters.isLocked !== null) {
      filtered = filtered.filter(p => p.isLocked === filters.isLocked)
    }

    return filtered
  }, [sortedProducts, filters])

  return (
    <ModuleAccessGuard moduleId="winning-products">
    <>
      <>
          <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">

            {error && (
              <SectionError
                className="max-w-2xl"
                description={error}
                onRetry={() => {
                  setError(null)
                  setIsLoading(true)
                  setProducts([])
                }}
              />
            )}

            {isLoading ? (
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
                    {Array.from({ length: 10 }).map((_, index) => (
                      <TableRow key={index} className="h-24">
                        <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-16 w-16 rounded" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-16 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                title="No winning products found"
                description="Try adjusting filters or refresh to fetch the latest products."
                action={{
                  label: "Refresh products",
                  onClick: () => {
                    setProducts([])
                    setError(null)
                    setIsLoading(true)
                  },
                }}
              />
            ) : (
              <div>
                <WinningProductsTable
                  products={filteredProducts.map((product, index) => ({
                    ...product,
                    isLocked: product.isLocked || (isFree && !hasCompletedFreeLearning && index >= 4)
                  }))}
                  onProductClick={(_product) => {
                  }}
                  onLockedClick={() => setIsUpsellOpen(true)}
                />
                {isFree && !hasCompletedFreeLearning && filteredProducts.length > 4 && (
                  <FreeLearningCutoff itemCount={4} contentType="products" />
                )}
              </div>
            )}
          </div>
      </>

      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </>
    </ModuleAccessGuard>
  )
}

