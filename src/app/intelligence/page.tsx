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
import { Search, Book, Play } from "lucide-react"
import { ArticleCard } from "./components/article-card"
import { Article, sampleArticles } from "./data/articles"

export default function IntelligencePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(sampleArticles.map((a) => a.category)))]
  }, [])

  const filteredArticles = useMemo(() => {
    return sampleArticles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0">
          {/* Premium Banner with grainy gradient */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-900 via-violet-950 to-purple-800 p-3 text-white h-[154px] flex-shrink-0">
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
                src="/3d-ecom-icons-blue/Open_Board.png"
                alt="Intelligence"
                width={110}
                height={110}
                className="w-[5.5rem] h-[5.5rem] md:w-[6.6rem] md:h-[6.6rem] flex-shrink-0 object-contain"
              />

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">USDrop Intelligence</h2>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                  Stay ahead with dropshipping insights, trends, and expert strategies from industry leaders.
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

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Articles */}
          {filteredArticles.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Book className="h-5 w-5" />
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {filteredArticles.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

