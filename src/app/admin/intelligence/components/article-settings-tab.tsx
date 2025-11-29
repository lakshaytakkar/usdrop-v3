"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ArticleSettingsTabProps {
  status: "draft" | "published" | "archived" | "scheduled"
  scheduledPublishAt: string | null
  seoTitle: string | null
  seoDescription: string | null
  authorId: string
  onStatusChange: (status: "draft" | "published" | "archived" | "scheduled") => void
  onScheduledPublishAtChange: (date: string | null) => void
  onSeoTitleChange: (title: string | null) => void
  onSeoDescriptionChange: (description: string | null) => void
}

export function ArticleSettingsTab({
  status,
  scheduledPublishAt,
  seoTitle,
  seoDescription,
  authorId,
  onStatusChange,
  onScheduledPublishAtChange,
  onSeoTitleChange,
  onSeoDescriptionChange,
}: ArticleSettingsTabProps) {
  return (
    <div className="space-y-4">
      {/* Publishing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Publishing Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => onStatusChange(v as typeof status)}>
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

          <div className="space-y-2">
            <Label htmlFor="scheduled-publish">Scheduled Publish Date</Label>
            <Input
              id="scheduled-publish"
              type="datetime-local"
              value={
                scheduledPublishAt
                  ? new Date(scheduledPublishAt).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value
                onScheduledPublishAtChange(value ? new Date(value).toISOString() : null)
              }}
            />
            <p className="text-xs text-muted-foreground">
              Set a date and time to automatically publish this article
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={authorId}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Author assignment will be implemented
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo-title">SEO Title</Label>
            <Input
              id="seo-title"
              value={seoTitle || ""}
              onChange={(e) => onSeoTitleChange(e.target.value || null)}
              placeholder="Custom title for search engines"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">
              {seoTitle?.length || 0}/60 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-description">SEO Description</Label>
            <Textarea
              id="seo-description"
              value={seoDescription || ""}
              onChange={(e) => onSeoDescriptionChange(e.target.value || null)}
              placeholder="Meta description for search engines"
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">
              {seoDescription?.length || 0}/160 characters
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

