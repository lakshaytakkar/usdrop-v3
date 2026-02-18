"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import {
  Users,
  Package,
  GraduationCap,
  Store,
  TrendingUp,
  Target,
  Building,
  ShoppingBag,
  ArrowRight,
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
  totalLeads: number
  totalSuppliers: number
  totalShopifyStores: number
}

function StatCard({
  label,
  value,
  icon: Icon,
  badge,
  description,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  badge?: string
  description: string
}) {
  return (
    <div className="bg-card border rounded-lg p-4 flex flex-col gap-2 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
      <div className="flex items-center justify-between w-full">
        <p className="text-muted-foreground text-[14px] font-medium tracking-[0.02em]">{label}</p>
        <div className="w-[36px] h-[36px] bg-card border rounded-lg flex items-center justify-center">
          <Icon className="h-[18px] w-[18px] text-primary" />
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <p className="text-foreground text-2xl font-semibold leading-[1.3] tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <div className="flex items-center gap-2">
          {badge && (
            <div className="bg-[#effefa] text-[#40c4aa] dark:bg-[#40c4aa]/10 dark:text-[#40c4aa] px-[6px] py-[2px] rounded-[50px] flex items-center justify-center">
              <p className="text-[12px] font-medium tracking-[0.02em]">{badge}</p>
            </div>
          )}
          <p className="text-muted-foreground text-[14px] font-medium tracking-[0.02em]">{description}</p>
        </div>
      </div>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="bg-card border rounded-lg p-4 flex flex-col gap-2 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
      <div className="flex items-center justify-between w-full">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="w-[36px] h-[36px] rounded-lg" />
      </div>
      <div className="flex flex-col gap-2 items-start">
        <Skeleton className="h-8 w-16" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-10 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}

function PlatformItem({
  href,
  icon: Icon,
  label,
  count,
}: {
  href: string
  icon: React.ElementType
  label: string
  count: number
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-2.5 px-2 rounded-md hover:bg-muted/50 transition-colors group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{count}</span>
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  )
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
  const conversionRate = totalUsers > 0 ? ((stats!.usersByAccountType.pro / totalUsers) * 100).toFixed(1) : "0.0"
  const proPercent = totalUsers > 0 ? Math.round((stats!.usersByAccountType.pro / totalUsers) * 100) : 0
  const freePercent = totalUsers > 0 ? 100 - proPercent : 0

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold leading-[1.35] tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Platform overview and key metrics</p>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-6 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold leading-[1.35] tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform overview and key metrics</p>
        </div>
        <Button variant="outline" size="sm" className="h-[36px]">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard
              label="Total Clients"
              value={stats.totalExternalUsers}
              icon={Users}
              badge={`+${stats.recentSignups}`}
              description="new this week"
            />
            <StatCard
              label="Active Leads"
              value={stats.totalLeads}
              icon={Target}
              description="in sales pipeline"
            />
            <StatCard
              label="Products"
              value={stats.totalProducts}
              icon={Package}
              description="across all categories"
            />
            <StatCard
              label="Conversion Rate"
              value={`${conversionRate}%`}
              icon={TrendingUp}
              badge={`+${stats.usersByAccountType.pro}`}
              description="pro users"
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {loading ? (
          <>
            <div className="lg:col-span-2 bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
              <div className="p-4 pb-3 border-b">
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="p-4 space-y-4">
                <Skeleton className="h-3 w-full rounded-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
              <div className="p-4 pb-3 border-b">
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="p-4 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-full rounded-md" />
                ))}
              </div>
            </div>
          </>
        ) : stats ? (
          <>
            <Card className="lg:col-span-2 bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">User Breakdown</CardTitle>
                <Link href="/admin/external-users">
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    View All
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                    {freePercent > 0 && (
                      <div
                        className="bg-gray-400 dark:bg-gray-500 transition-all duration-500"
                        style={{ width: `${freePercent}%` }}
                      />
                    )}
                    {proPercent > 0 && (
                      <div
                        className="bg-primary transition-all duration-500"
                        style={{ width: `${proPercent}%` }}
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-400 dark:bg-gray-500" />
                      <span className="text-muted-foreground text-[14px] font-medium tracking-[0.02em]">Free</span>
                      <span className="font-semibold text-foreground">{stats.usersByAccountType.free.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground text-[14px] font-medium tracking-[0.02em]">Pro</span>
                      <span className="font-semibold text-foreground">{stats.usersByAccountType.pro.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-[14px] font-medium tracking-[0.02em]">Conversion rate</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-[#effefa] text-[#40c4aa] dark:bg-[#40c4aa]/10 dark:text-[#40c4aa] px-[6px] py-[2px] rounded-[50px] flex items-center justify-center">
                          <p className="text-[12px] font-medium tracking-[0.02em]">{conversionRate}%</p>
                        </div>
                        <span className="text-sm font-semibold text-foreground">Pro</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Platform Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <PlatformItem href="/admin/courses" icon={GraduationCap} label="Courses" count={stats.totalCourses} />
                  <PlatformItem href="/admin/competitor-stores" icon={Store} label="Competitor Stores" count={stats.totalCompetitorStores} />
                  <PlatformItem href="/admin/suppliers" icon={Building} label="Suppliers" count={stats.totalSuppliers} />
                  <PlatformItem href="/admin/shopify-stores" icon={ShoppingBag} label="Shopify Stores" count={stats.totalShopifyStores} />
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  )
}
