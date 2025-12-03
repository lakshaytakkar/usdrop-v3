"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart3, Search, TrendingUp, DollarSign, Sparkles, Play } from "lucide-react"
import { AdCard } from "./components/ad-card"
import { AdDetailSheet } from "./components/ad-detail-sheet"
import { MetaAd, sampleAds } from "./data/ads"

export default function MetaAdsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"roas" | "revenue" | "ctr">("roas")
  const [selectedAd, setSelectedAd] = useState<MetaAd | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredAndSortedAds = useMemo(() => {
    let filtered = sampleAds.filter((ad) => {
      const matchesSearch =
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.productName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPlatform = selectedPlatform === "all" || ad.platform === selectedPlatform
      const matchesStatus = selectedStatus === "all" || ad.status === selectedStatus
      return matchesSearch && matchesPlatform && matchesStatus
    })

    // Sort ads
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "roas":
          return b.roas - a.roas
        case "revenue":
          return b.revenue - a.revenue
        case "ctr":
          return b.ctr - a.ctr
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedPlatform, selectedStatus, sortBy])

  const stats = useMemo(() => {
    const totalRevenue = filteredAndSortedAds.reduce((sum, ad) => sum + ad.revenue, 0)
    const totalSpend = filteredAndSortedAds.reduce((sum, ad) => sum + ad.spend, 0)
    const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0
    return { totalRevenue, totalSpend, avgROAS }
  }, [filteredAndSortedAds])

  const handleAdClick = (ad: MetaAd) => {
    setSelectedAd(ad)
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
    setSelectedAd(null)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0">
          {/* Premium Banner with grainy gradient */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900 via-blue-950 to-indigo-800 p-3 text-white h-[77px] flex-shrink-0">
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
            <div className="relative z-10 flex items-center gap-3 h-full">
              {/* Icon/Mascot */}
              <div className="relative w-[60px] h-[60px] flex-shrink-0 bg-transparent flex items-center justify-center">
                <BarChart3 
                  className="h-12 w-12 text-white"
                  style={{
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))',
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold leading-tight">USDrop Meta Ads Research</h2>
                <p className="text-white/85 text-xs leading-tight mt-0.5">
                  Discover winning ads and analyze performance metrics to optimize your campaigns.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur-sm cursor-pointer"
                >
                  <Play className="h-3 w-3 mr-1" />
                  <span className="text-xs">Tutorial</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Spend</p>
                    <p className="text-2xl font-bold">${stats.totalSpend.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Average ROAS</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {stats.avgROAS.toFixed(2)}x
                    </p>
                  </div>
                  <Sparkles className="h-8 w-8 text-emerald-500/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search ads or products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roas">Sort by ROAS</SelectItem>
                    <SelectItem value="revenue">Sort by Revenue</SelectItem>
                    <SelectItem value="ctr">Sort by CTR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Ads Grid */}
          {filteredAndSortedAds.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No ads found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredAndSortedAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} onClick={handleAdClick} />
              ))}
            </div>
          )}

          {/* Detail Sidebar */}
          <AdDetailSheet
            ad={selectedAd}
            open={sidebarOpen}
            onClose={handleCloseSidebar}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

