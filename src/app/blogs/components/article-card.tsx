"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Eye, Heart } from "lucide-react"
import { Article } from "../data/articles"
import { LockOverlay } from "@/components/ui/lock-overlay"
import { cn } from "@/lib/utils"

interface ArticleCardProps {
  article: Article
  featured?: boolean
  isLocked?: boolean
  onLockedClick?: () => void
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function ArticleCard({ article, featured = false, isLocked = false, onLockedClick }: ArticleCardProps) {
  return (
    <Card
      className={`flex h-full flex-col ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <div className={`relative w-full overflow-hidden rounded-t-xl ${featured ? "h-64" : "h-48"}`}>
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{article.category}</Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(article.publishedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <h3 className={`font-semibold line-clamp-2 ${featured ? "text-xl" : "text-base"}`}>
          {article.title}
        </h3>

        <p className={`text-muted-foreground line-clamp-2 ${featured ? "text-base" : "text-sm"}`}>
          {article.excerpt}
        </p>

        <div className="flex items-center gap-3 mt-auto pt-2 border-t">
          <Avatar className="h-8 w-8">
            <AvatarImage src={article.authorAvatar} alt={article.author} />
            <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{article.author}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {numberFormatter.format(article.views)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {numberFormatter.format(article.likes)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="relative">
          {isLocked ? (
            <span className="text-sm font-medium text-muted-foreground cursor-not-allowed">
              Read more →
            </span>
          ) : (
            <a
              href={`/blogs/${article.slug || article.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Read more →
            </a>
          )}
          {isLocked && (
            <LockOverlay 
              onClick={onLockedClick}
              variant="button"
              size="sm"
              className="rounded-md"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

