"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Users,
  Package,
  GraduationCap,
  Store,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  Building,
  ShoppingBag,
  ArrowRight,
  UserPlus,
  Download,
} from "lucide-react"

interface DashboardStats {
  totalExternalUsers: number
  totalProducts: number
  totalCourses: number
  totalCompetitorStores: number
  activeSubscriptionPlans: number
  recentSignups: number
  usersByAccountType: {
    free: number
    pro: number
  }
  totalOrders: number
  totalSuppliers: number
  totalShopifyStores: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/dashboard")
        if (!res.ok) throw new Error("Failed to fetch dashboard stats")
        const data = await res.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const totalUsers = stats ? stats.usersByAccountType.free + stats.usersByAccountType.pro : 0
  const proPercent = totalUsers > 0 ? Math.round((stats!.usersByAccountType.pro / totalUsers) * 100) : 0
  const freePercent = totalUsers > 0 ? 100 - proPercent : 0

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-foreground leading-[1.35]">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Platform overview and key metrics</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-foreground leading-[1.35]">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform overview and key metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-[36px]">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-7 w-12" />
                    </div>
                    <Skeleton className="h-9 w-9 rounded-lg" />
                  </div>
                  <Skeleton className="h-3 w-28 mt-3" />
                </CardContent>
              </Card>
            ))
          : stats && (
              <>
                <Card className="border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Total Clients</span>
                      <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className="text-2xl font-semibold">{stats.totalExternalUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-0 text-xs px-1.5 py-0">
                        +{stats.recentSignups}
                      </Badge>
                      <span className="text-xs text-muted-foreground">new this week</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Products</span>
                      <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className="text-2xl font-semibold">{stats.totalProducts.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Across all categories</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Courses</span>
                      <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className="text-2xl font-semibold">{stats.totalCourses.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Published courses</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Active Plans</span>
                      <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className="text-2xl font-semibold">{stats.activeSubscriptionPlans.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Subscription tiers</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <>
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full rounded-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : stats && (
          <>
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">User Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
                    {freePercent > 0 && (
                      <div
                        className="bg-gray-400 transition-all"
                        style={{ width: `${freePercent}%` }}
                      />
                    )}
                    {proPercent > 0 && (
                      <div
                        className="bg-blue-600 transition-all"
                        style={{ width: `${proPercent}%` }}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full bg-gray-400" />
                      <span className="text-muted-foreground">Free</span>
                      <span className="font-medium">{stats.usersByAccountType.free.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
                      <span className="text-muted-foreground">Pro</span>
                      <span className="font-medium">{stats.usersByAccountType.pro.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Conversion rate</span>
                      <span className="text-sm font-medium">{proPercent}% Pro</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Platform Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <Link href="/admin/competitor-stores" className="flex items-center justify-between py-2.5 px-2 rounded-md hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Store className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm">Competitor Stores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stats.totalCompetitorStores}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                  <Link href="/admin/suppliers" className="flex items-center justify-between py-2.5 px-2 rounded-md hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Building className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm">Suppliers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stats.totalSuppliers}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                  <Link href="/admin/orders" className="flex items-center justify-between py-2.5 px-2 rounded-md hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm">Orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stats.totalOrders}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                  <Link href="/admin/shopify-stores" className="flex items-center justify-between py-2.5 px-2 rounded-md hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm">Shopify Stores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stats.totalShopifyStores}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
