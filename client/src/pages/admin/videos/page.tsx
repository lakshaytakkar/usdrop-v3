import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Film, Upload, Eye, EyeOff, Plus, FileVideo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  StatusBadge,
  FormDialog,
  type Column,
  type RowAction,
} from "@/components/admin-shared"

interface AdVideo {
  id: string
  title: string
  video_url: string
  thumbnail_url: string
  category: string
  views: number
  likes: number
  is_published: boolean
  order_index: number
  date_added: string
  created_at: string
  updated_at: string
}

const VIDEO_CATEGORIES = [
  "Home Decor",
  "Kitchen",
  "Gadgets",
  "Electronics",
  "Health & Wellness",
  "Beauty",
  "Sports & Fitness",
  "Pets",
  "Travel",
]

export default function AdminVideosPage() {
  const { showSuccess, showError } = useToast()
  const [videos, setVideos] = useState<AdVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingVideo, setEditingVideo] = useState<AdVideo | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formViews, setFormViews] = useState("")
  const [formLikes, setFormLikes] = useState("")
  const [formPublished, setFormPublished] = useState(true)
  const [formFile, setFormFile] = useState<File | null>(null)
  const [formFileName, setFormFileName] = useState("")

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/api/admin/videos")
      if (res.ok) {
        const data = await res.json()
        setVideos(data)
      }
    } catch {
      showError("Failed to load videos")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const stats = useMemo(() => {
    const published = videos.filter((v) => v.is_published).length
    const unpublished = videos.length - published
    const byCat: Record<string, number> = {}
    videos.forEach((v) => {
      byCat[v.category] = (byCat[v.category] || 0) + 1
    })
    const topCategory = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]
    return { total: videos.length, published, unpublished, topCategory: topCategory?.[0] || "—" }
  }, [videos])

  const resetForm = () => {
    setFormTitle("")
    setFormCategory("")
    setFormViews("")
    setFormLikes("")
    setFormPublished(true)
    setFormFile(null)
    setFormFileName("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const openCreate = () => {
    setEditingVideo(null)
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (video: AdVideo) => {
    setEditingVideo(video)
    setFormTitle(video.title)
    setFormCategory(video.category)
    setFormViews(String(video.views))
    setFormLikes(String(video.likes))
    setFormPublished(video.is_published)
    setFormFile(null)
    setFormFileName("")
    if (fileInputRef.current) fileInputRef.current.value = ""
    setDialogOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("video/")) {
        showError("Please select a video file")
        return
      }
      if (file.size > 50 * 1024 * 1024) {
        showError("File must be under 50MB")
        return
      }
      setFormFile(file)
      setFormFileName(file.name)
    }
  }

  const handleSubmit = async () => {
    if (!formTitle.trim() || !formCategory) {
      showError("Title and category are required")
      return
    }
    if (!editingVideo && !formFile) {
      showError("Please select a video file to upload")
      return
    }

    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append("title", formTitle.trim())
      formData.append("category", formCategory)
      formData.append("views", formViews || "0")
      formData.append("likes", formLikes || "0")
      formData.append("is_published", String(formPublished))
      formData.append("order_index", String(editingVideo?.order_index || videos.length))

      if (formFile) {
        formData.append("video", formFile)
      }

      const url = editingVideo
        ? `/api/admin/videos/${editingVideo.id}`
        : "/api/admin/videos"
      const method = editingVideo ? "PATCH" : "POST"

      const res = await apiFetch(url, {
        method,
        body: formData,
      })

      if (res.ok) {
        showSuccess(editingVideo ? "Video updated" : "Video uploaded")
        setDialogOpen(false)
        resetForm()
        fetchVideos()
      } else {
        const err = await res.json()
        showError(err.error || "Failed to save video")
      }
    } catch {
      showError("Failed to save video")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (video: AdVideo) => {
    if (!confirm(`Delete "${video.title}"? This will also remove the video file.`)) return

    try {
      const res = await apiFetch(`/api/admin/videos/${video.id}`, { method: "DELETE" })
      if (res.ok) {
        showSuccess("Video deleted")
        fetchVideos()
      } else {
        showError("Failed to delete video")
      }
    } catch {
      showError("Failed to delete video")
    }
  }

  const handleTogglePublish = async (video: AdVideo) => {
    try {
      const formData = new FormData()
      formData.append("is_published", String(!video.is_published))

      const res = await apiFetch(`/api/admin/videos/${video.id}`, {
        method: "PATCH",
        body: formData,
      })
      if (res.ok) {
        showSuccess(video.is_published ? "Video hidden" : "Video published")
        fetchVideos()
      }
    } catch {
      showError("Failed to update video")
    }
  }

  const columns: Column<AdVideo>[] = [
    {
      key: "title",
      header: "Video",
      render: (v) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Film className="h-4 w-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate" data-testid={`text-video-title-${v.id}`}>
              {v.title}
            </p>
            <p className="text-xs text-gray-500">{v.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "views",
      header: "Views",
      render: (v) => (
        <span className="text-sm text-gray-700" data-testid={`text-video-views-${v.id}`}>
          {v.views.toLocaleString()}
        </span>
      ),
    },
    {
      key: "likes",
      header: "Likes",
      render: (v) => (
        <span className="text-sm text-gray-700" data-testid={`text-video-likes-${v.id}`}>
          {v.likes.toLocaleString()}
        </span>
      ),
    },
    {
      key: "is_published",
      header: "Status",
      render: (v) => (
        <StatusBadge
          status={v.is_published ? "active" : "inactive"}
          label={v.is_published ? "Published" : "Hidden"}
        />
      ),
    },
    {
      key: "date_added",
      header: "Added",
      render: (v) => (
        <span className="text-sm text-gray-500">
          {v.date_added}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<AdVideo>[] = [
    {
      label: "Edit",
      onClick: openEdit,
    },
    {
      label: "Toggle Publish",
      onClick: handleTogglePublish,
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive" as const,
      separator: true,
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Ad Videos"
        subtitle="Upload and manage product ad videos for the videos library"
        action={
          <Button size="sm" onClick={openCreate} data-testid="button-add-video">
            <Plus className="h-4 w-4 mr-1.5" />
            Upload Video
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Videos" value={stats.total} icon={Film} />
        <StatCard label="Published" value={stats.published} icon={Eye} />
        <StatCard label="Hidden" value={stats.unpublished} icon={EyeOff} />
        <StatCard label="Top Category" value={stats.topCategory} icon={FileVideo} />
      </StatGrid>

      <DataTable
        data={videos}
        columns={columns}
        rowActions={rowActions}
        isLoading={loading}
        searchKey="title"
        searchPlaceholder="Search videos..."
        emptyTitle="No Videos Yet"
        emptyDescription="Upload your first product ad video to get started"
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingVideo ? "Edit Video" : "Upload Video"}
        onSubmit={handleSubmit}
        submitLabel={editingVideo ? "Save Changes" : "Upload"}
        isSubmitting={submitting}
      >
        <div className="space-y-1">
          <Label>Title</Label>
          <Input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="e.g. LED Sunset Lamp"
            data-testid="input-video-title"
          />
        </div>

        <div className="space-y-1">
          <Label>Category</Label>
          <Select value={formCategory} onValueChange={setFormCategory}>
            <SelectTrigger data-testid="select-video-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {VIDEO_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>{editingVideo ? "Replace Video (optional)" : "Video File"}</Label>
          <div
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-testid="dropzone-video"
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            {formFileName ? (
              <p className="text-sm font-medium text-gray-700">{formFileName}</p>
            ) : (
              <>
                <p className="text-sm text-gray-600">Click to select a video file</p>
                <p className="text-xs text-gray-400 mt-1">MP4, MOV, WebM — max 50MB</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            data-testid="input-video-file"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Views</Label>
            <Input
              type="number"
              value={formViews}
              onChange={(e) => setFormViews(e.target.value)}
              placeholder="0"
              data-testid="input-video-views"
            />
          </div>
          <div className="space-y-1">
            <Label>Likes</Label>
            <Input
              type="number"
              value={formLikes}
              onChange={(e) => setFormLikes(e.target.value)}
              placeholder="0"
              data-testid="input-video-likes"
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-1">
          <Label>Published</Label>
          <Switch
            checked={formPublished}
            onCheckedChange={setFormPublished}
            data-testid="switch-video-published"
          />
        </div>
      </FormDialog>
    </PageShell>
  )
}
