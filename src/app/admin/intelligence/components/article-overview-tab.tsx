"use client"

import { Article } from "../data/articles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Star, Pin, TrendingUp, Clock } from "lucide-react"
import Image from "next/image"

interface ArticleOverviewTabProps {
  article: Article | null
  title: string
  excerpt: string
  category: string | null
  tags: string[]
  featuredImage: string | null
  isFeatured: boolean
  isPinned: boolean
  status: "draft" | "published" | "archived" | "scheduled"
  views: number
  readingTime: number
  publishedAt: string | null
  createdAt: string | null
  onTitleChange: (title: string) => void
  onExcerptChange: (excerpt: string) => void
  onCategoryChange: (category: string | null) => void
  onTagsChange: (tags: string[]) => void
  onFeaturedImageChange: (image: string | null) => void
  onIsFeaturedChange: (featured: boolean) => void
  onIsPinnedChange: (pinned: boolean) => void
  tagInput: string
  onTagInputChange: (input: string) => void
  onAddTag: () => void
  onRemoveTag: (tag: string) => void
  categories: string[]
}

export function ArticleOverviewTab({
  article,
  title,
  excerpt,
  category,
  tags,
  featuredImage,
  isFeatured,
  isPinned,
  status,
  views,
  readingTime,
  publishedAt,
  createdAt,
  onTitleChange,
  onExcerptChange,
  onCategoryChange,
  onTagsChange,
  onFeaturedImageChange,
  onIsFeaturedChange,
  onIsPinnedChange,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  categories,
}: ArticleOverviewTabProps) {
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

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter article title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => onExcerptChange(e.target.value)}
              placeholder="Brief summary of the article"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category || ""} onValueChange={(v) => onCategoryChange(v || null)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => {
                  // Status is controlled by parent
                }}
                disabled
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Image */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Featured Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="featured-image">Image URL</Label>
            <Input
              id="featured-image"
              value={featuredImage || ""}
              onChange={(e) => onFeaturedImageChange(e.target.value || null)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          {featuredImage && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
              <Image
                src={featuredImage}
                alt="Featured"
                fill
                className="object-cover"
                onError={() => onFeaturedImageChange(null)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => onTagInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  onAddTag()
                }
              }}
              placeholder="Add a tag and press Enter"
            />
            <Button onClick={onAddTag} disabled={!tagInput.trim()}>
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1">
                  {tag}
                  <button
                    onClick={() => onRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={isFeatured}
              onCheckedChange={onIsFeaturedChange}
            />
            <Label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
              <Star className="h-4 w-4 text-yellow-500" />
              Featured Article
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pinned"
              checked={isPinned}
              onCheckedChange={onIsPinnedChange}
            />
            <Label htmlFor="pinned" className="flex items-center gap-2 cursor-pointer">
              <Pin className="h-4 w-4 text-blue-500" />
              Pinned Article
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {article && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Views</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg font-semibold">{formatNumber(views)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Reading Time</p>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg font-semibold">{readingTime} min</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="text-sm font-medium">{formatDate(createdAt)}</p>
              </div>
              {publishedAt && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Published</p>
                  <p className="text-sm font-medium">{formatDate(publishedAt)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

