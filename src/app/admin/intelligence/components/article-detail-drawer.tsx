"use client"

import { DetailDrawer } from "@/components/ui/detail-drawer"
import { Article } from "../data/articles"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  FileText,
  Copy,
  ExternalLink,
  Star,
  Pin,
  TrendingUp,
  Clock,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ArticleDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  article: Article
  onEdit?: (article: Article) => void
  onPublish?: (article: Article) => void
  onUnpublish?: (article: Article) => void
  onDelete?: (article: Article) => void
  onCopyLink?: (article: Article) => void
}

export function ArticleDetailDrawer({
  open,
  onOpenChange,
  article,
  onEdit,
  onPublish,
  onUnpublish,
  onDelete,
  onCopyLink,
}: ArticleDetailDrawerProps) {
  const formatDate = (date: string | null) => {
    if (!date) return "Never"
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const statusConfig = {
    published: { icon: CheckCircle2, label: "Published", variant: "default" as const },
    draft: { icon: FileText, label: "Draft", variant: "secondary" as const },
    scheduled: { icon: Calendar, label: "Scheduled", variant: "outline" as const },
    archived: { icon: XCircle, label: "Archived", variant: "secondary" as const },
  }

  const StatusIcon = statusConfig[article.status].icon

  const headerActions = (
    <div className="flex items-center gap-2">
      {onEdit && (
        <Button variant="outline" size="sm" onClick={() => onEdit(article)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      )}
      {article.status === "published" ? (
        onUnpublish && (
          <Button variant="outline" size="sm" onClick={() => onUnpublish(article)}>
            <XCircle className="h-4 w-4 mr-2" />
            Unpublish
          </Button>
        )
      ) : (
        onPublish && (
          <Button variant="outline" size="sm" onClick={() => onPublish(article)}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Publish
          </Button>
        )
      )}
      {onCopyLink && (
        <Button variant="outline" size="sm" onClick={() => onCopyLink(article)}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(`/intelligence/${article.slug}`, "_blank")}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        View on Site
      </Button>
    </div>
  )

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      content: (
        <div className="space-y-4">
          {/* Featured Image */}
          {article.featured_image && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
              <Image
                src={article.featured_image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Article Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Article Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Title</p>
                <p className="text-sm font-medium">{article.title}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Excerpt</p>
                <p className="text-sm">{article.excerpt}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge
                    variant={statusConfig[article.status].variant}
                    className="gap-1"
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[article.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  {article.category ? (
                    <Badge variant="outline">{article.category}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
              </div>
              {article.tags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Views</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg font-semibold">{formatNumber(article.views)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reading Time</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg font-semibold">{article.reading_time} min</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Flags</p>
                  <div className="flex items-center gap-2">
                    {article.is_featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                    {article.is_pinned && (
                      <Pin className="h-4 w-4 text-blue-500 fill-blue-500" />
                    )}
                    {!article.is_featured && !article.is_pinned && (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Author */}
          {article.author && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Author</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/admin/internal-users?userId=${article.author.id}`}
                  className="flex items-center gap-3 hover:text-primary transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={article.author.avatar} />
                    <AvatarFallback>
                      {article.author.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{article.author.name}</p>
                    <p className="text-xs text-muted-foreground">{article.author.email}</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="text-sm font-medium">{formatDate(article.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Updated</p>
                <p className="text-sm font-medium">{formatDate(article.updated_at)}</p>
              </div>
              {article.published_at && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Published</p>
                  <p className="text-sm font-medium">{formatDate(article.published_at)}</p>
                </div>
              )}
              {article.scheduled_publish_at && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Scheduled</p>
                  <p className="text-sm font-medium">{formatDate(article.scheduled_publish_at)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      value: "content",
      label: "Content Preview",
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Article Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      value: "activity",
      label: "Activity",
      content: (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                Activity log will appear here as the article is used and updated.
              </p>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ]

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={article.title}
      tabs={tabs}
      defaultTab="overview"
      headerActions={headerActions}
    />
  )
}

