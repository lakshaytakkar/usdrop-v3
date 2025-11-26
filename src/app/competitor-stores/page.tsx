"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { competitorStores } from "./data/stores"
import { 
  Store, 
  Filter,
  TrendingUp,
  Star,
  CheckCircle2,
  ExternalLink,
  Package,
  BarChart3
} from "lucide-react"

type SortOption = "revenue" | "traffic" | "growth" | "rating"

const categories = ["All Categories", "Electronics", "Fashion", "Beauty & Health", "Sports & Fitness", "Home & Living", "Pets"]

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
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState<SortOption>("revenue")

  const filteredAndSortedStores = useMemo(() => {
    let filtered = [...competitorStores]

    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(store => store.category === selectedCategory)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "revenue":
          return b.monthlyRevenue - a.monthlyRevenue
        case "traffic":
          return b.monthlyTraffic - a.monthlyTraffic
        case "growth":
          return b.growth - a.growth
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

    return filtered
  }, [selectedCategory, sortBy])

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Store className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold">Competitor Stores</h1>
              </div>
              <p className="text-muted-foreground">
                Discover and analyze top-performing Shopify stores
              </p>
            </div>

            {/* Filters - All in one line */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="revenue">Revenue (High to Low)</option>
                  <option value="traffic">Traffic (High to Low)</option>
                  <option value="growth">Growth (High to Low)</option>
                  <option value="rating">Rating (High to Low)</option>
                </select>
              </div>

              {/* Category Filters */}
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Stores Table */}
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedStores.map((store) => (
                      <TableRow key={store.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-border">
                              <AvatarImage src={store.logo} alt={store.name} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                {store.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
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
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              <BarChart3 className="h-3.5 w-3.5 mr-1" />
                              Research
                            </Button>
                            <Button size="sm" className="h-8 text-xs">
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Empty State */}
            {filteredAndSortedStores.length === 0 && (
              <Card className="p-12">
                <div className="text-center">
                  <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No stores found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
