"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  ChevronLeft,
  Save,
  Eye,
  Trash2,
  Calendar,
  CheckCircle2,
  FileText,
  Settings,
  Image as ImageIcon,
} from "lucide-react"
import { Article } from "../data/articles"
import { sampleArticles } from "../data/articles"
import { ArticleEditor } from "../components/article-editor"
import { ArticleOverviewTab } from "../components/article-overview-tab"
import { ArticleContentTab } from "../components/article-content-tab"
import { ArticleSettingsTab } from "../components/article-settings-tab"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { format } from "date-fns"

export default function ArticleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params?.id as string
  const isNew = articleId === "new"
  const { showSuccess, showError, showInfo } = useToast()

  // Permission checks
  const { hasPermission: canEdit } = useHasPermission("usdropintelligence.edit")
  const { hasPermission: canDelete } = useHasPermission("usdropintelligence.delete")
  const { hasPermission: canPublish } = useHasPermission("usdropintelligence.edit") // Use edit for publish

  const [article, setArticle] = useState<Article | null>(null)
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [status, setStatus] = useState<"draft" | "published" | "archived" | "scheduled">("draft")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [scheduledPublishAt, setScheduledPublishAt] = useState<string | null>(null)
  const [seoTitle, setSeoTitle] = useState<string | null>(null)
  const [seoDescription, setSeoDescription] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (isNew) {
      // Initialize new article
      setTitle("")
      setExcerpt("")
      setContent("")
      setCategory(null)
      setTags([])
      setStatus("draft")
      setIsFeatured(false)
      setIsPinned(false)
      setFeaturedImage(null)
      setScheduledPublishAt(null)
      setSeoTitle(null)
      setSeoDescription(null)
    } else {
      // Load existing article
      const foundArticle = sampleArticles.find((a) => a.id === articleId)
      if (foundArticle) {
        setArticle(foundArticle)
        setTitle(foundArticle.title)
        setExcerpt(foundArticle.excerpt)
        setContent(foundArticle.content)
        setCategory(foundArticle.category)
        setTags(foundArticle.tags)
        setStatus(foundArticle.status)
        setIsFeatured(foundArticle.is_featured)
        setIsPinned(foundArticle.is_pinned)
        setFeaturedImage(foundArticle.featured_image)
        setScheduledPublishAt(foundArticle.scheduled_publish_at)
        setSeoTitle(foundArticle.seo_title)
        setSeoDescription(foundArticle.seo_description)
      }
    }
  }, [articleId, isNew])

  const handleSaveDraft = async () => {
    if (!canEdit) {
      showError("You don't have permission to edit articles")
      return
    }
    setLoading(true)
    showInfo("Saving draft...")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    showSuccess("Draft saved successfully")
  }

  const handlePublish = async () => {
    if (!canPublish) {
      showError("You don't have permission to publish articles")
      return
    }
    if (!title.trim()) {
      showError("Please enter a title")
      return
    }
    if (!content.trim()) {
      showError("Please add content to the article")
      return
    }
    setLoading(true)
    showInfo("Publishing article...")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus("published")
    setLoading(false)
    showSuccess("Article published successfully")
  }

  const handleSchedule = async () => {
    if (!canPublish) {
      showError("You don't have permission to schedule articles")
      return
    }
    if (!scheduledPublishAt) {
      showError("Please select a publish date")
      return
    }
    setLoading(true)
    showInfo("Scheduling article...")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus("scheduled")
    setLoading(false)
    showSuccess("Article scheduled successfully")
  }

  const handleDelete = async () => {
    if (!canDelete) {
      showError("You don't have permission to delete articles")
      return
    }
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return
    }
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    showSuccess("Article deleted successfully")
    router.push("/admin/intelligence")
  }

  const handlePreview = () => {
    window.open(`/intelligence/${article?.slug || "preview"}`, "_blank")
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
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

  if (!isNew && !article) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Article not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/intelligence")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              {isNew ? "New Article" : article?.title || "Edit Article"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isNew ? "Create a new article" : "Edit article details and content"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            disabled={!article && isNew}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          {status !== "published" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSchedule}
              disabled={loading || !scheduledPublishAt}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          )}
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={loading || status === "published"}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {status === "published" ? "Published" : "Publish"}
          </Button>
          {!isNew && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col">
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="overview">
            <FileText className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto mt-4">
          <TabsContent value="overview" className="mt-0">
            <ArticleOverviewTab
              article={article}
              title={title}
              excerpt={excerpt}
              category={category}
              tags={tags}
              featuredImage={featuredImage}
              isFeatured={isFeatured}
              isPinned={isPinned}
              status={status}
              views={article?.views || 0}
              readingTime={article?.reading_time || 0}
              publishedAt={article?.published_at ?? null}
              createdAt={article?.created_at ?? null}
              onTitleChange={setTitle}
              onExcerptChange={setExcerpt}
              onCategoryChange={setCategory}
              onTagsChange={setTags}
              onFeaturedImageChange={setFeaturedImage}
              onIsFeaturedChange={setIsFeatured}
              onIsPinnedChange={setIsPinned}
              tagInput={tagInput}
              onTagInputChange={setTagInput}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              categories={categories}
            />
          </TabsContent>

          <TabsContent value="content" className="mt-0">
            <ArticleContentTab
              content={content}
              onContentChange={setContent}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <ArticleSettingsTab
              status={status}
              scheduledPublishAt={scheduledPublishAt}
              seoTitle={seoTitle}
              seoDescription={seoDescription}
              authorId={article?.author_id || ""}
              onStatusChange={setStatus}
              onScheduledPublishAtChange={setScheduledPublishAt}
              onSeoTitleChange={setSeoTitle}
              onSeoDescriptionChange={setSeoDescription}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

