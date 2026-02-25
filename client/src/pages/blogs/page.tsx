

import { useState, useMemo, useEffect } from "react"
import { apiFetch } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Book } from "lucide-react"
import { ArticleCard } from "./components/article-card"
import { Article, sampleArticles } from "./data/articles"
import { useOnboarding } from "@/contexts/onboarding-context"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { getTeaserLockState } from "@/hooks/use-teaser-lock"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"

function transformArticle(a: any): Article {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt || "",
    content: a.content || "",
    author: a.author_name || a.author || "USDrop Team",
    authorAvatar: a.author_avatar || a.authorAvatar || "",
    image: a.featured_image || a.image || "",
    category: a.category || "General",
    tags: Array.isArray(a.tags) ? a.tags : [],
    publishedDate: a.published_date || a.publishedDate || "",
    readTime: a.read_time || a.readTime || 5,
    views: a.views || 0,
    likes: a.likes || 0,
    featured: a.featured || false,
  }
}

export default function IntelligencePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isFree } = useOnboarding()

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await apiFetch("/api/articles")
        if (res.ok) {
          const data = await res.json()
          const dbArticles = (data.articles || []).map(transformArticle)
          setArticles(dbArticles.length > 0 ? dbArticles : sampleArticles)
        } else {
          setArticles(sampleArticles)
        }
      } catch {
        setArticles(sampleArticles)
      } finally {
        setIsLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(articles.map((a) => a.category)))]
  }, [articles])

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, articles])

  return (
    <>
        <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0">

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
          {isLoading ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Book className="h-5 w-5" />
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <Card key={i} data-testid={`skeleton-article-${i}`}>
                    <Skeleton className="h-48 w-full rounded-b-none" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Book className="h-5 w-5" />
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredArticles.map((article, index) => {
                  // Use details-locked strategy: show all articles but lock "Read more" buttons
                  const { isLocked } = getTeaserLockState(index, isFree, {
                    freeVisibleCount: 3,
                    strategy: "first-n-items"
                  })
                  return (
                    <ArticleCard 
                      key={article.id} 
                      article={article}
                      isLocked={isLocked}
                      onLockedClick={() => setIsUpsellOpen(true)}
                    />
                  )
                })}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No articles found"
              description="Try adjusting your search or filters."
            />
          )}
        </div>
      {/* Upsell Dialog */}
      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </>
  )
}
