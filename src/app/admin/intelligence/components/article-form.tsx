"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Article } from "../data/articles"

interface ArticleFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<Article>) => void
  article?: Article | null
  mode?: "create" | "edit"
}

export function ArticleForm({
  open,
  onClose,
  onSubmit,
  article,
  mode = "create",
}: ArticleFormProps) {
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [category, setCategory] = useState<string | null>(null)
  const [status, setStatus] = useState<"draft" | "published" | "archived" | "scheduled">("draft")
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)

  useEffect(() => {
    if (article && mode === "edit") {
      setTitle(article.title)
      setExcerpt(article.excerpt)
      setCategory(article.category)
      setStatus(article.status)
      setFeaturedImage(article.featured_image)
    } else {
      setTitle("")
      setExcerpt("")
      setCategory(null)
      setStatus("draft")
      setFeaturedImage(null)
    }
  }, [article, mode, open])

  const handleSubmit = () => {
    if (!title.trim()) {
      return
    }
    onSubmit({
      title,
      excerpt,
      category,
      status,
      featured_image: featuredImage,
    })
    onClose()
  }

  const categories = [
    "E-commerce Tips",
    "Product Research",
    "Marketing",
    "Dropshipping",
    "Shopify",
    "SEO",
    "Social Media",
    "Business Growth",
    "Case Studies",
    "Tutorials",
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Article" : "Edit Article"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new article for USDrop Intelligence"
              : "Update article information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of the article"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category || ""} onValueChange={setCategory}>
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
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
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

          <div className="space-y-2">
            <Label htmlFor="featured-image">Featured Image URL</Label>
            <Input
              id="featured-image"
              value={featuredImage || ""}
              onChange={(e) => setFeaturedImage(e.target.value || null)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            {mode === "create" ? "Create" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

