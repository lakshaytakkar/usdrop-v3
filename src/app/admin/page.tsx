"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Package, GraduationCap, Store, CreditCard, TrendingUp } from "lucide-react"

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

  const statCards = stats
    ? [
        { label: "Total Users", value: stats.totalExternalUsers, icon: Users },
        { label: "Total Products", value: stats.totalProducts, icon: Package },
        { label: "Total Courses", value: stats.totalCourses, icon: GraduationCap },
        { label: "Competitor Stores", value: stats.totalCompetitorStores, icon: Store },
        { label: "Active Plans", value: stats.activeSubscriptionPlans, icon: CreditCard },
        { label: "Recent Signups", value: stats.recentSignups, icon: TrendingUp, subtitle: "Last 7 days" },
      ]
    : []

  const totalUsers = stats ? stats.usersByAccountType.free + stats.usersByAccountType.pro : 0
  const freePercent = totalUsers > 0 ? (stats!.usersByAccountType.free / totalUsers) * 100 : 0
  const proPercent = totalUsers > 0 ? (stats!.usersByAccountType.pro / totalUsers) * 100 : 0

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your platform</p>
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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-7 w-16" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))
          : statCards.map((card) => (
              <Card key={card.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
                      {card.subtitle && (
                        <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                      )}
                    </div>
                    <card.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : stats ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Users by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex h-6 w-full overflow-hidden rounded-full bg-gray-100">
                {freePercent > 0 && (
                  <div
                    className="flex items-center justify-center bg-gray-400 text-xs font-medium text-white"
                    style={{ width: `${freePercent}%` }}
                  >
                    {freePercent >= 10 ? `${Math.round(freePercent)}%` : ""}
                  </div>
                )}
                {proPercent > 0 && (
                  <div
                    className="flex items-center justify-center bg-blue-600 text-xs font-medium text-white"
                    style={{ width: `${proPercent}%` }}
                  >
                    {proPercent >= 10 ? `${Math.round(proPercent)}%` : ""}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-gray-400" />
                  <span className="text-muted-foreground">Free — {stats.usersByAccountType.free.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
                  <span className="text-muted-foreground">Pro — {stats.usersByAccountType.pro.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
