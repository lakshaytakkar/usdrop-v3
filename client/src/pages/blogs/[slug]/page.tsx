

import { useState, useEffect } from "react"
import { useParams, useRouter } from "@/hooks/use-router"
import { ExternalLayout } from "@/components/layout/external-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark,
  Calendar
} from "lucide-react"

import { Link } from "wouter"
import { Article, sampleArticles } from "../data/articles"

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find article by slug or id
    const foundArticle = slug 
      ? sampleArticles.find((a) => a.slug === slug || a.id === slug)
      : null

    // Find related articles (same category, excluding current)
    const related = foundArticle
      ? sampleArticles
          .filter(
            (a) =>
              a.id !== foundArticle.id &&
              (a.category === foundArticle.category ||
                a.tags.some((tag) => foundArticle.tags.includes(tag)))
          )
          .slice(0, 3)
      : []

    // Batch state updates
    setArticle(foundArticle || null)
    setRelatedArticles(related)
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <ExternalLayout>
          <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0">
            <div className="flex items-center justify-center h-96">
              <p className="text-muted-foreground">Loading article...</p>
            </div>
          </div>
      </ExternalLayout>
    )
  }

  if (!article) {
    return (
      <ExternalLayout>
          <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0">
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <h1 className="text-2xl font-bold">Article Not Found</h1>
              <p className="text-muted-foreground">
                The article you&apos;re looking for doesn&apos;t exist.
              </p>
              <Button onClick={() => router.push("/blogs")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Button>
            </div>
          </div>
      </ExternalLayout>
    )
  }

  return (
    <ExternalLayout>
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/blogs")}
            className="w-fit mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>

          {/* Article Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{article.category}</Badge>
              {article.featured && (
                <Badge className="bg-yellow-500 text-white">Featured</Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {article.excerpt}
            </p>

            {/* Author and Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={article.authorAvatar} alt={article.author} />
                  <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(article.publishedDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{numberFormatter.format(article.views)} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{numberFormatter.format(article.likes)} likes</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden mb-8 bg-slate-100">
            <img
              src={article.image}
              alt={article.title}
             
              className="object-cover"
             
            />
          </div>

          {/* Article Content */}
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardContent className="p-8 md:p-12">
                <div
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/blogs/${related.slug || related.id}`}
                      className="group"
                    >
                      <Card className="h-full">
                        <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                          <img
                            src={related.image}
                            alt={related.title}
                           
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <Badge variant="outline" className="mb-2 text-xs">
                            {related.category}
                          </Badge>
                          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                            {related.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {related.excerpt}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
    </ExternalLayout>
  )
}

