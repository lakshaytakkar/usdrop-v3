"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Edit, MoreVertical, Eye, Pin, Star, Calendar } from "lucide-react"
import { Article } from "../data/articles"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

interface AdminArticleCardProps {
  article: Article
  onEdit?: (article: Article) => void
  onViewDetails?: (article: Article) => void
  onDelete?: (article: Article) => void
  onPublish?: (article: Article) => void
  onDuplicate?: (article: Article) => void
  canEdit?: boolean
  canDelete?: boolean
  canPublish?: boolean
}

export function AdminArticleCard({
  article,
  onEdit,
  onViewDetails,
  onDelete,
  onPublish,
  onDuplicate,
  canEdit = true,
  canDelete = true,
  canPublish = true,
}: AdminArticleCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
        {article.featured_image ? (
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(article)}>
                  View Details
                </DropdownMenuItem>
              )}
              {canEdit && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(article)}>
                  Edit
                </DropdownMenuItem>
              )}
              {canPublish && onPublish && (
                <DropdownMenuItem onClick={() => onPublish(article)}>
                  {article.status === "published" ? "Unpublish" : "Publish"}
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(article)}>
                  Duplicate
                </DropdownMenuItem>
              )}
              {canDelete && onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(article)} className="text-destructive">
                    <FileText className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute top-2 left-2 flex gap-1.5">
          {article.is_featured && (
            <Badge className="bg-primary">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {article.is_pinned && (
            <Badge variant="secondary">
              <Pin className="h-3 w-3 mr-1" />
              Pinned
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold mb-1 line-clamp-2">{article.title}</h3>
          {article.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={article.status === "published" ? "default" : "secondary"}>
            {article.status}
          </Badge>
          {article.category && (
            <Badge variant="outline">{article.category}</Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{article.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{format(new Date(article.created_at), "MMM d, yyyy")}</span>
          </div>
          <div className="text-muted-foreground">
            {article.reading_time} min read
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        {canPublish && onPublish && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onPublish(article)}
          >
            {article.status === "published" ? "Unpublish" : "Publish"}
          </Button>
        )}
        {canEdit && onEdit && (
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onEdit(article)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}











