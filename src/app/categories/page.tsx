"use client"

import { useMemo, useEffect, useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { OnboardingProvider } from "@/contexts/onboarding-context"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"
import { CategoryCard } from "./components/category-card"
import { Category } from "@/types/categories"
import { Loader2, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Transform API category to local format
type LocalCategory = {
  id: string | number
  name: string
  description: string
  image: string
  productCount: number
  avgProfitMargin: number
  growth: number
  trending: boolean
  subcategories: string[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        
        const data = await response.json()
        setCategories(data.categories || [])
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err.message : 'Failed to load categories')
        setIsLoading(false)
      }
    }
    
    fetchCategories()
  }, [])

  // Transform API categories to local format
  const localCategories: LocalCategory[] = useMemo(() => {
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '/placeholder-category.png',
      productCount: cat.product_count || 0,
      avgProfitMargin: cat.avg_profit_margin || 0,
      growth: cat.growth_percentage || 0,
      trending: cat.trending || false,
      subcategories: cat.subcategories?.map(s => s.name) || [],
    }))
  }, [categories])

  // Sort all categories by growth
  const sortedCategories = useMemo(() => {
    return [...localCategories].sort((a, b) => b.growth - a.growth)
  }, [localCategories])

  return (
    <OnboardingProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-gray-50/50 relative">
            {/* Error State */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div>
                <Skeleton className="h-7 w-32 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="rounded-xl border bg-card p-6">
                      <Skeleton className="aspect-square w-full rounded-lg mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* All Categories Grid */}
                {sortedCategories.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">All Categories</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {sortedCategories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Onboarding Progress Overlay */}
            <OnboardingProgressOverlay pageName="Categories" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </OnboardingProvider>
  )
}
