"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Newspaper, Search, Book } from "lucide-react"
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

  const featuredArticles = filteredArticles.filter((a) => a.featured)
  const otherArticles = filteredArticles.filter((a) => !a.featured)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Intelligence</h1>
            </div>
            <p className="text-muted-foreground">
              Stay ahead with dropshipping insights, trends, and expert strategies
            </p>
          </div>

          {/* Hero Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardContent className="p-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold mb-3">Stay Ahead with Dropshipping Insights</h2>
                <p className="text-muted-foreground">
                  Get the latest trends, strategies, and tips from industry experts. Learn from real
                  case studies and actionable guides to grow your business.
                </p>
              </div>
            </CardContent>
          </Card>

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

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} featured={article.featured} />
                ))}
              </div>
            </div>
          )}

          {/* Other Articles */}
          {otherArticles.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Book className="h-5 w-5" />
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {otherArticles.map((article) => (
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

