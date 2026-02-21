

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart3, Search, TrendingUp, DollarSign, Sparkles } from "lucide-react"
import { AdCard } from "./components/ad-card"
import { AdDetailSheet } from "./components/ad-detail-sheet"
import { MetaAd, sampleAds } from "./data/ads"
import { ComingSoonOverlay } from "./components/coming-soon-overlay"
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
    <>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50 relative">

          {/* Blurred background content */}
          <div className="blur-md pointer-events-none select-none opacity-60">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold">Meta Ads Research</h1>
              </div>
              <p className="text-muted-foreground">
                Discover winning ads and analyze performance metrics
              </p>
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
          </div>

          {/* Coming Soon Overlay */}
          <ComingSoonOverlay />

          {/* Detail Sidebar */}
          <AdDetailSheet
            ad={selectedAd}
            open={sidebarOpen}
            onClose={handleCloseSidebar}
          />
        </div>
    </>
  )
}

