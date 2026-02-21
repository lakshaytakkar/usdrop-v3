

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
import { Search, Book } from "lucide-react"
import { ArticleCard } from "./components/article-card"
import { Article, sampleArticles } from "./data/articles"
import { useOnboarding } from "@/contexts/onboarding-context"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { getTeaserLockState } from "@/hooks/use-teaser-lock"
import { EmptyState } from "@/components/ui/empty-state"

export default function IntelligencePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

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
    <>
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 min-h-0">

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
          {filteredArticles.length > 0 ? (
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
