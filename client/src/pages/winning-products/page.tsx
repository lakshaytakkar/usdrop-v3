
import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, useCallback } from "react"
import { ModuleAccessGuard } from "@/components/auth/module-access-guard"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { WinningProductsTable } from "./components/winning-products-table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, DollarSign, Star, SlidersHorizontal, ArrowUpDown, X, TrendingDown, Lock, Unlock, Search, ExternalLink, Flame, ShoppingBag } from "lucide-react"
import { useOnboarding } from "@/contexts/onboarding-context"
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

type TabId = 'hot-products' | 'bestsellers' | 'trending'

interface TradelleBestseller {
  id: number
  name: string
  url: string | null
  image: string | null
  variants: any
  date: string | null
  price: number | null
  store_url: string | null
  scraped_at: string | null
  created_at: string | null
}

interface TradelleTrend {
  id: number
  name: string
  url: string | null
  image: string | null
  buy_price: number | null
  sell_price: number | null
  scraped_at: string | null
  created_at: string | null
}

function BestsellersTab() {
  const [bestsellers, setBestsellers] = useState<TradelleBestseller[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const pageSize = 24

  const fetchBestsellers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      if (search) params.set('search', search)
      const response = await apiFetch(`/api/tradelle/bestsellers?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch bestsellers')
      const data = await response.json()
      setBestsellers(data.products || data.bestsellers || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bestsellers')
    } finally {
      setIsLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchBestsellers()
  }, [fetchBestsellers])

  const handleSearch = () => {
    setPage(1)
    setSearch(searchInput)
  }

  if (error) {
    return <SectionError description={error} onRetry={fetchBestsellers} className="max-w-2xl" />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-testid="input-bestsellers-search"
            placeholder="Search bestsellers..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button data-testid="button-bestsellers-search" onClick={handleSearch} variant="secondary">
          Search
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-visible p-0">
              <Skeleton className="h-48 w-full rounded-t-md rounded-b-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : bestsellers.length === 0 ? (
        <EmptyState
          title="No bestsellers found"
          description="Try a different search or check back later."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestsellers.map((item) => (
              <Card key={item.id} data-testid={`card-bestseller-${item.id}`} className="overflow-visible p-0 hover-elevate">
                <div className="aspect-square bg-muted rounded-t-md overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ShoppingBag className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <p data-testid={`text-bestseller-name-${item.id}`} className="font-medium text-sm line-clamp-2">{item.name}</p>
                  {item.price != null && (
                    <p data-testid={`text-bestseller-price-${item.id}`} className="text-sm text-muted-foreground font-medium">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  )}
                  {item.store_url && (
                    <a
                      href={item.store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`link-bestseller-store-${item.id}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Store
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 py-4">
            <Button
              data-testid="button-bestsellers-prev"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              data-testid="button-bestsellers-next"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function TrendingTab() {
  const [trends, setTrends] = useState<TradelleTrend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 24

  const fetchTrends = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      const response = await apiFetch(`/api/tradelle/trends?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch trending products')
      const data = await response.json()
      setTrends(data.products || data.trends || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trending products')
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchTrends()
  }, [fetchTrends])

  if (error) {
    return <SectionError description={error} onRetry={fetchTrends} className="max-w-2xl" />
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-visible p-0">
              <Skeleton className="h-48 w-full rounded-t-md rounded-b-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      ) : trends.length === 0 ? (
        <EmptyState
          title="No trending products found"
          description="Check back later for trending products."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trends.map((item) => (
              <Card key={item.id} data-testid={`card-trend-${item.id}`} className="overflow-visible p-0 hover-elevate">
                <div className="aspect-square bg-muted rounded-t-md overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Flame className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <p data-testid={`text-trend-name-${item.id}`} className="font-medium text-sm line-clamp-2">{item.name}</p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`link-trend-url-${item.id}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Product
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 py-4">
            <Button
              data-testid="button-trends-prev"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              data-testid="button-trends-next"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default function WinningProductsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('hot-products')
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isFree } = useOnboarding()
  
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

  const tabs: { id: TabId; label: string; icon: typeof Flame }[] = [
    { id: 'hot-products', label: 'Hot Products', icon: Flame },
    { id: 'bestsellers', label: 'Bestsellers', icon: ShoppingBag },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
  ]

  return (
    <ModuleAccessGuard moduleId="winning-products">
    <>
      <>
          <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0 relative">

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  data-testid={`button-tab-${tab.id}`}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab.id)}
                  className="gap-2"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              ))}
            </div>

            {activeTab === 'hot-products' && (
              <>
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
                  <WinningProductsTable
                    products={filteredProducts.map((product, index) => ({
                      ...product,
                      isLocked: product.isLocked || (isFree && index >= 6)
                    }))}
                    onProductClick={(product) => {
                      console.log("View product:", product.id)
                    }}
                    onLockedClick={() => setIsUpsellOpen(true)}
                  />
                )}
              </>
            )}

            {activeTab === 'bestsellers' && <BestsellersTab />}
            {activeTab === 'trending' && <TrendingTab />}
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

