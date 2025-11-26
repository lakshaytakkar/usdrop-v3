"use client"

import { useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import Image from "next/image"
import { categories } from "./data/categories"
import { CategoryCard } from "./components/category-card"

export default function CategoriesPage() {
  // Get top 3 categories by growth
  const topCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 3)
  }, [])

  // Get remaining categories
  const otherCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) => b.growth - a.growth)
      .slice(3)
  }, [])

  // Dark 2-color gradient pairs for each tile
  const gradients = [
    "from-purple-900 to-pink-800",
    "from-blue-900 to-cyan-800",
    "from-orange-900 to-red-800"
  ]

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-gray-50/50">
            {/* Top 3 Categories */}
            <div className="flex flex-col gap-4">
              {topCategories.map((category, index) => {
                const gradient = gradients[index]
                return (
                  <div 
                    key={category.id} 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 relative rounded-xl"
                  >
                    <div className={`relative bg-gradient-to-r ${gradient} rounded-xl`}>
                      {/* Grainy texture overlay - more pronounced */}
                      <div 
                        className="absolute inset-0 opacity-50"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                          mixBlendMode: "overlay"
                        }}
                      />

                      {/* Content */}
                      <div className="relative py-4 px-5 md:px-6">
                        <div className="flex flex-col lg:flex-row gap-5 items-center">
                          {/* Left Side - Image */}
                          <div className="flex-shrink-0">
                            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white/40 shadow-lg bg-white/10 backdrop-blur-sm">
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>

                          {/* Middle - Category Info */}
                          <div className="flex-1 min-w-0">
                            <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-md mb-2">
                              {category.name}
                            </h2>
                            
                            <p className="text-white/90 text-sm max-w-2xl">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Other Categories Grid */}
            {otherCategories.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">All Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {otherCategories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
