"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Filter,
  TrendingUp,
  Star,
  CheckCircle2,
  ExternalLink,
  Package,
  BarChart3,
  Loader2,
  X,
  Check,
  ChevronsUpDown
} from "lucide-react"
import { CompetitorStore, CompetitorStoreExternal } from "@/types/competitor-stores"
import { Category } from "@/types/categories"
import { cn } from "@/lib/utils"
import Loader from "@/components/kokonutui/loader"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"
import { useOnboarding } from "@/contexts/onboarding-context"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { LockOverlay } from "@/components/ui/lock-overlay"

type SortOption = "revenue" | "traffic" | "growth" | "rating"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(num)
}

export default function CompetitorStoresPage() {
  const [stores, setStores] = useState<CompetitorStoreExternal[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<SortOption>("revenue")
  const [minRevenue, setMinRevenue] = useState<string>("")
  const [maxRevenue, setMaxRevenue] = useState<string>("")
  const [minTraffic, setMinTraffic] = useState<string>("")
  const [maxTraffic, setMaxTraffic] = useState<string>("")
  const [minGrowth, setMinGrowth] = useState<string>("")
  const [maxGrowth, setMaxGrowth] = useState<string>("")
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set())
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false)
  const [countryFilterOpen, setCountryFilterOpen] = useState(false)
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

  // Fetch categories for filter
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories", {
        credentials: 'include'
      })
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }, [])

  // Fetch competitor stores
  const fetchStores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      params.append("verified", "true") // Only show verified stores for public
      params.append("pageSize", "1000") // Get all stores

      // Map sortBy to API sortBy
      const apiSortBy = sortBy === "revenue" ? "monthly_revenue" :
                       sortBy === "traffic" ? "monthly_traffic" :
                       sortBy === "growth" ? "growth" :
                       sortBy === "rating" ? "rating" : "monthly_revenue"
      params.append("sortBy", apiSortBy)
      params.append("sortOrder", "desc")

      const response = await fetch(`/api/competitor-stores?${params.toString()}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch stores")
      }

      const data = await response.json()
      
      // Transform API response to match UI format
      const transformedStores: CompetitorStoreExternal[] = (data.stores || []).map((store: CompetitorStore) => ({
        id: store.id,
        name: store.name,
        url: store.url,
        logo: store.logo || undefined,
        category: store.category?.name || "Uncategorized",
        monthlyRevenue: store.monthly_revenue || 0,
        monthlyTraffic: store.monthly_traffic,
        growth: store.growth,
        country: store.country || "Unknown",
        products: store.products_count || 0,
        rating: store.rating || 0,
        verified: store.verified,
      }))

      setStores(transformedStores)
    } catch (err: any) {
      console.error("Error fetching stores:", err)
      setError(err.message || "Failed to load competitor stores")
    } finally {
      setLoading(false)
    }
  }, [sortBy])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  // Get unique countries from stores
  const uniqueCountries = useMemo(() => {
    const countries = new Set<string>()
    stores.forEach(store => {
      if (store.country && store.country !== "Unknown") {
        countries.add(store.country)
      }
    })
    return Array.from(countries).sort()
  }, [stores])

  // Client-side filtering for revenue, traffic, growth, and country
  const filteredAndSortedStores = useMemo(() => {
    let filtered = stores

    // Filter by revenue range
    if (minRevenue) {
      const min = parseFloat(minRevenue)
      if (!isNaN(min)) {
        filtered = filtered.filter(store => store.monthlyRevenue >= min)
      }
    }
    if (maxRevenue) {
      const max = parseFloat(maxRevenue)
      if (!isNaN(max)) {
        filtered = filtered.filter(store => store.monthlyRevenue <= max)
      }
    }

    // Filter by traffic range
    if (minTraffic) {
      const min = parseFloat(minTraffic)
      if (!isNaN(min)) {
        filtered = filtered.filter(store => store.monthlyTraffic >= min)
      }
    }
    if (maxTraffic) {
      const max = parseFloat(maxTraffic)
      if (!isNaN(max)) {
        filtered = filtered.filter(store => store.monthlyTraffic <= max)
      }
    }

    // Filter by growth range
    if (minGrowth) {
      const min = parseFloat(minGrowth)
      if (!isNaN(min)) {
        filtered = filtered.filter(store => store.growth >= min)
      }
    }
    if (maxGrowth) {
      const max = parseFloat(maxGrowth)
      if (!isNaN(max)) {
        filtered = filtered.filter(store => store.growth <= max)
      }
    }

    // Filter by countries
    if (selectedCountries.size > 0) {
      filtered = filtered.filter(store => 
        store.country && selectedCountries.has(store.country)
      )
    }

    // Filter by categories (client-side if multiple selected)
    if (selectedCategories.size > 0) {
      filtered = filtered.filter(store => {
        const category = categories.find(c => c.name === store.category)
        return category && selectedCategories.has(category.id)
      })
    }

    return filtered
  }, [stores, minRevenue, maxRevenue, minTraffic, maxTraffic, minGrowth, maxGrowth, selectedCountries, selectedCategories, categories])

  const hasActiveFilters = useMemo(() => {
    return selectedCategories.size > 0 ||
           minRevenue !== "" ||
           maxRevenue !== "" ||
           minTraffic !== "" ||
           maxTraffic !== "" ||
           minGrowth !== "" ||
           maxGrowth !== "" ||
           selectedCountries.size > 0
  }, [selectedCategories, minRevenue, maxRevenue, minTraffic, maxTraffic, minGrowth, maxGrowth, selectedCountries])

  const clearAllFilters = () => {
    setSelectedCategories(new Set())
    setMinRevenue("")
    setMaxRevenue("")
    setMinTraffic("")
    setMaxTraffic("")
    setMinGrowth("")
    setMaxGrowth("")
    setSelectedCountries(new Set())
  }

  const handleStoreRowClick = (url: string) => {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`
    window.open(fullUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
            {/* Premium Banner with grainy gradient */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-900 via-red-950 to-orange-800 p-3 text-white h-[154px] flex-shrink-0">
              {/* Enhanced grainy texture layers */}
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  opacity: 0.5,
                  mixBlendMode: 'overlay'
                }}
              ></div>
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
                  opacity: 0.4,
                  mixBlendMode: 'multiply'
                }}
              ></div>
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise3)'/%3E%3C/svg%3E")`,
                  opacity: 0.3,
                  mixBlendMode: 'screen'
                }}
              ></div>
              <div 
                className="absolute inset-0 z-0"
                style={{
                  background: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px),
                                repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)`,
                  opacity: 0.6
                }}
              ></div>

              {/* Content */}
              <div className="relative z-10 flex items-center gap-4 h-full">
                {/* 3D Thumbnail */}
                <img
                  src="/3d-characters-ecom/chatting-with-seller.png"
                  alt="Competitor Stores"
                  width={110}
                  height={110}
                  className="w-[5.5rem] h-[5.5rem] md:w-[6.6rem] md:h-[6.6rem] flex-shrink-0 object-contain"
                />

                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">USDrop Competitor Stores</h2>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    Discover and analyze top-performing Shopify stores to understand market trends and opportunities.
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Filters and Sorting */}
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue (High to Low)</SelectItem>
                      <SelectItem value="traffic">Traffic (High to Low)</SelectItem>
                      <SelectItem value="growth">Growth (High to Low)</SelectItem>
                      <SelectItem value="rating">Rating (High to Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <Popover open={categoryFilterOpen} onOpenChange={setCategoryFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      role="combobox"
                      className={cn(
                        "h-8 w-[180px] justify-between",
                        selectedCategories.size > 0 && "border-primary bg-primary/5"
                      )}
                    >
                      Categories
                      {selectedCategories.size > 0 && (
                        <Badge variant="secondary" className="ml-1.5 rounded-sm px-1 font-normal text-[10px]">
                          {selectedCategories.size}
                        </Badge>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search categories..." />
                      <CommandList>
                        <CommandEmpty>No categories found.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((category) => {
                            const isSelected = selectedCategories.has(category.id)
                            return (
                              <CommandItem
                                key={category.id}
                                onSelect={() => {
                                  const newSelected = new Set(selectedCategories)
                                  if (isSelected) {
                                    newSelected.delete(category.id)
                                  } else {
                                    newSelected.add(category.id)
                                  }
                                  setSelectedCategories(newSelected)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {category.name}
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Country Filter */}
                <Popover open={countryFilterOpen} onOpenChange={setCountryFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      role="combobox"
                      className={cn(
                        "h-8 w-[150px] justify-between",
                        selectedCountries.size > 0 && "border-primary bg-primary/5"
                      )}
                    >
                      Country
                      {selectedCountries.size > 0 && (
                        <Badge variant="secondary" className="ml-1.5 rounded-sm px-1 font-normal text-[10px]">
                          {selectedCountries.size}
                        </Badge>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search countries..." />
                      <CommandList>
                        <CommandEmpty>No countries found.</CommandEmpty>
                        <CommandGroup>
                          {uniqueCountries.map((country) => {
                            const isSelected = selectedCountries.has(country)
                            return (
                              <CommandItem
                                key={country}
                                onSelect={() => {
                                  const newSelected = new Set(selectedCountries)
                                  if (isSelected) {
                                    newSelected.delete(country)
                                  } else {
                                    newSelected.add(country)
                                  }
                                  setSelectedCountries(newSelected)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {country}
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Revenue Range */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-8",
                        (minRevenue || maxRevenue) && "border-primary bg-primary/5"
                      )}
                    >
                      Revenue Range
                      {(minRevenue || maxRevenue) && (
                        <Badge variant="secondary" className="ml-1.5 rounded-sm px-1 font-normal text-[10px]">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px]" align="start">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Min Revenue ($)</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 1000"
                          value={minRevenue}
                          onChange={(e) => setMinRevenue(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Revenue ($)</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 100000"
                          value={maxRevenue}
                          onChange={(e) => setMaxRevenue(e.target.value)}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Traffic Range */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-8",
                        (minTraffic || maxTraffic) && "border-primary bg-primary/5"
                      )}
                    >
                      Traffic Range
                      {(minTraffic || maxTraffic) && (
                        <Badge variant="secondary" className="ml-1.5 rounded-sm px-1 font-normal text-[10px]">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px]" align="start">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Min Traffic</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 1000"
                          value={minTraffic}
                          onChange={(e) => setMinTraffic(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Traffic</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 100000"
                          value={maxTraffic}
                          onChange={(e) => setMaxTraffic(e.target.value)}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Growth Range */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-8",
                        (minGrowth || maxGrowth) && "border-primary bg-primary/5"
                      )}
                    >
                      Growth Range (%)
                      {(minGrowth || maxGrowth) && (
                        <Badge variant="secondary" className="ml-1.5 rounded-sm px-1 font-normal text-[10px]">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px]" align="start">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Min Growth (%)</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 0"
                          value={minGrowth}
                          onChange={(e) => setMinGrowth(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Growth (%)</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 100"
                          value={maxGrowth}
                          onChange={(e) => setMaxGrowth(e.target.value)}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
                <Loader 
                  title="Loading competitor stores..." 
                  subtitle="Analyzing store data and metrics"
                  size="md"
                />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <Card className="p-12">
                <div className="text-center">
                  <Image
                    src="/images/3d-icons/folder-icon.png"
                    alt="Error"
                    width={48}
                    height={48}
                    className="mx-auto mb-4 opacity-50"
                  />
                  <h3 className="text-lg font-semibold mb-2">Error loading stores</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={fetchStores} variant="outline">
                    Try Again
                  </Button>
                </div>
              </Card>
            )}

            {/* Stores Table */}
            {!loading && !error && (
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Store</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Monthly Revenue</TableHead>
                        <TableHead className="text-right">Monthly Traffic</TableHead>
                        <TableHead className="text-right">Growth</TableHead>
                        <TableHead className="text-right">Products</TableHead>
                        <TableHead className="text-right">Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedStores.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12">
                            <Image
                              src="/images/3d-icons/folder-icon.png"
                              alt="No stores"
                              width={48}
                              height={48}
                              className="mx-auto mb-4 opacity-50"
                            />
                            <h3 className="text-lg font-semibold mb-2">No stores found</h3>
                            <p className="text-muted-foreground">
                              Try adjusting your filters.
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAndSortedStores.map((store, index) => {
                          const isLocked = isFree && index >= 6
                          return (
                      <TableRow 
                        key={store.id} 
                        className={cn(
                          "hover:bg-muted/50 cursor-pointer relative",
                          isLocked && "pointer-events-none"
                        )}
                        onClick={() => !isLocked && handleStoreRowClick(store.url)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 flex-shrink-0 border-2 border-border rounded-full overflow-hidden bg-background">
                              <Image
                                src="/shopify_glyph.svg"
                                alt="Shopify"
                                fill
                                className="object-contain p-1.5"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold truncate">{store.name}</p>
                                {store.verified && (
                                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                {store.url}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {store.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {store.country}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-emerald-600">
                            {formatCurrency(store.monthlyRevenue)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold">
                            {formatNumber(store.monthlyTraffic)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 text-emerald-600">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-semibold">+{store.growth.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{formatNumber(store.products)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{store.rating}</span>
                          </div>
                        </TableCell>
                        {isLocked && (
                          <LockOverlay onClick={() => setIsUpsellOpen(true)} />
                        )}
                        </TableRow>
                      )
                      })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </div>

          {/* Onboarding Progress Overlay */}
          <OnboardingProgressOverlay pageName="Competitor Stores" />
        </SidebarInset>
      </SidebarProvider>

      {/* Upsell Dialog */}
      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </>
  )
}
