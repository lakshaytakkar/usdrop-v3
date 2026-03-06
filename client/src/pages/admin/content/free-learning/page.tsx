import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import {
  BookOpen,
  Video,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  EmptyState,
  FormDialog,
} from "@/components/admin-shared"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface OnboardingVideo {
  id: string
  title: string
  description: string | null
  video_url: string | null
  video_duration: string | null
  module_id: string
  order_index: number
  thumbnail: string | null
}

interface OnboardingModule {
  id: string
  title: string
  description: string | null
  order_index: number
  thumbnail: string | null
  videos: OnboardingVideo[]
}

export default function AdminFreeLearning() {
  const { showSuccess, showError } = useToast()
  const [modules, setModules] = useState<OnboardingModule[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const [moduleDialogOpen, setModuleDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<OnboardingModule | null>(null)
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" })
  const [submittingModule, setSubmittingModule] = useState(false)

  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<OnboardingVideo | null>(null)
  const [videoParentModuleId, setVideoParentModuleId] = useState("")
  const [videoForm, setVideoForm] = useState({ title: "", description: "", video_url: "", video_duration: "" })
  const [submittingVideo, setSubmittingVideo] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "module" | "video"; id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/api/admin/free-learning/modules")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setModules(data.modules || [])
    } catch {
      showError("Failed to load free learning content")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openAddModule = () => {
    setEditingModule(null)
    setModuleForm({ title: "", description: "" })
    setModuleDialogOpen(true)
  }

  const openEditModule = (mod: OnboardingModule) => {
    setEditingModule(mod)
    setModuleForm({ title: mod.title, description: mod.description || "" })
    setModuleDialogOpen(true)
  }

  const handleSubmitModule = async () => {
    if (!moduleForm.title.trim()) {
      showError("Title is required")
      return
    }
    try {
      setSubmittingModule(true)
      if (editingModule) {
        const res = await apiFetch(`/api/admin/free-learning/modules/${editingModule.id}`, {
          method: "PATCH",
          body: JSON.stringify({ title: moduleForm.title, description: moduleForm.description || null }),
        })
        if (!res.ok) throw new Error("Failed to update")
        showSuccess("Module updated")
      } else {
        const res = await apiFetch("/api/admin/free-learning/modules", {
          method: "POST",
          body: JSON.stringify({
            title: moduleForm.title,
            description: moduleForm.description || null,
            order_index: modules.length,
          }),
        })
        if (!res.ok) throw new Error("Failed to create")
        showSuccess("Module created")
      }
      setModuleDialogOpen(false)
      fetchModules()
    } catch {
      showError(editingModule ? "Failed to update module" : "Failed to create module")
    } finally {
      setSubmittingModule(false)
    }
  }

  const openAddVideo = (moduleId: string) => {
    setEditingVideo(null)
    setVideoParentModuleId(moduleId)
    setVideoForm({ title: "", description: "", video_url: "", video_duration: "" })
    setVideoDialogOpen(true)
  }

  const openEditVideo = (video: OnboardingVideo) => {
    setEditingVideo(video)
    setVideoParentModuleId(video.module_id)
    setVideoForm({
      title: video.title,
      description: video.description || "",
      video_url: video.video_url || "",
      video_duration: video.video_duration || "",
    })
    setVideoDialogOpen(true)
  }

  const handleSubmitVideo = async () => {
    if (!videoForm.title.trim()) {
      showError("Title is required")
      return
    }
    try {
      setSubmittingVideo(true)
      const parentModule = modules.find((m) => m.id === videoParentModuleId)
      if (editingVideo) {
        const res = await apiFetch(`/api/admin/free-learning/videos/${editingVideo.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: videoForm.title,
            description: videoForm.description || null,
            video_url: videoForm.video_url || null,
            video_duration: videoForm.video_duration || null,
          }),
        })
        if (!res.ok) throw new Error("Failed to update")
        showSuccess("Video updated")
      } else {
        const res = await apiFetch("/api/admin/free-learning/videos", {
          method: "POST",
          body: JSON.stringify({
            title: videoForm.title,
            description: videoForm.description || null,
            video_url: videoForm.video_url || null,
            video_duration: videoForm.video_duration || null,
            module_id: videoParentModuleId,
            order_index: parentModule?.videos.length ?? 0,
          }),
        })
        if (!res.ok) throw new Error("Failed to create")
        showSuccess("Video added")
      }
      setVideoDialogOpen(false)
      fetchModules()
    } catch {
      showError(editingVideo ? "Failed to update video" : "Failed to create video")
    } finally {
      setSubmittingVideo(false)
    }
  }

  const confirmDelete = (type: "module" | "video", id: string, title: string) => {
    setDeleteTarget({ type, id, title })
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      const endpoint =
        deleteTarget.type === "module"
          ? `/api/admin/free-learning/modules/${deleteTarget.id}`
          : `/api/admin/free-learning/videos/${deleteTarget.id}`
      const res = await apiFetch(endpoint, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      showSuccess(`${deleteTarget.type === "module" ? "Module" : "Video"} deleted`)
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      fetchModules()
    } catch {
      showError(`Failed to delete ${deleteTarget.type}`)
    } finally {
      setDeleting(false)
    }
  }

  const moveModule = async (index: number, direction: "up" | "down") => {
    const newModules = [...modules]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newModules.length) return

    const temp = newModules[index]
    newModules[index] = newModules[targetIndex]
    newModules[targetIndex] = temp

    const reordered = newModules.map((m, i) => ({ ...m, order_index: i }))
    setModules(reordered)

    try {
      await apiFetch("/api/admin/free-learning/reorder", {
        method: "PATCH",
        body: JSON.stringify({
          modules: reordered.map((m) => ({ id: m.id, order_index: m.order_index })),
        }),
      })
    } catch {
      showError("Failed to reorder")
      fetchModules()
    }
  }

  const moveVideo = async (moduleId: string, videoIndex: number, direction: "up" | "down") => {
    const mod = modules.find((m) => m.id === moduleId)
    if (!mod) return
    const newVideos = [...mod.videos]
    const targetIndex = direction === "up" ? videoIndex - 1 : videoIndex + 1
    if (targetIndex < 0 || targetIndex >= newVideos.length) return

    const temp = newVideos[videoIndex]
    newVideos[videoIndex] = newVideos[targetIndex]
    newVideos[targetIndex] = temp

    const reordered = newVideos.map((v, i) => ({ ...v, order_index: i }))
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, videos: reordered } : m))
    )

    try {
      await apiFetch("/api/admin/free-learning/reorder", {
        method: "PATCH",
        body: JSON.stringify({
          videos: reordered.map((v) => ({ id: v.id, order_index: v.order_index, module_id: v.module_id })),
        }),
      })
    } catch {
      showError("Failed to reorder")
      fetchModules()
    }
  }

  const totalVideos = modules.reduce((sum, m) => sum + m.videos.length, 0)

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Free Learning" subtitle="Manage onboarding modules and free learning content" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHeader
        title="Free Learning"
        subtitle="Manage onboarding modules and free learning content"
        actions={
          <Button onClick={openAddModule} data-testid="button-add-module">
            <Plus className="size-4 mr-1.5" />
            Add Module
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Modules" value={modules.length} icon={BookOpen} />
        <StatCard
          label="Total Videos"
          value={totalVideos}
          icon={Video}
          iconBg="rgba(139, 92, 246, 0.1)"
          iconColor="#8b5cf6"
        />
      </StatGrid>

      {modules.length === 0 ? (
        <EmptyState
          title="No modules yet"
          description="Create your first onboarding module to get started."
          actionLabel="Add Module"
          onAction={openAddModule}
        />
      ) : (
        <div className="space-y-3">
          {modules.map((mod, modIndex) => {
            const isExpanded = expandedModules.has(mod.id)
            return (
              <div key={mod.id} className="rounded-xl border bg-card overflow-hidden" data-testid={`module-${mod.id}`}>
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => toggleModule(mod.id)}
                  data-testid={`button-toggle-module-${mod.id}`}
                >
                  <GripVertical className="size-4 text-muted-foreground shrink-0" />
                  {isExpanded ? (
                    <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" data-testid={`text-module-title-${mod.id}`}>
                      {mod.title}
                    </p>
                    {mod.description && (
                      <p className="text-xs text-muted-foreground truncate">{mod.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0" data-testid={`text-video-count-${mod.id}`}>
                    {mod.videos.length} video{mod.videos.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={modIndex === 0}
                      onClick={() => moveModule(modIndex, "up")}
                      data-testid={`button-move-up-module-${mod.id}`}
                    >
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={modIndex === modules.length - 1}
                      onClick={() => moveModule(modIndex, "down")}
                      data-testid={`button-move-down-module-${mod.id}`}
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditModule(mod)}
                      data-testid={`button-edit-module-${mod.id}`}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => confirmDelete("module", mod.id, mod.title)}
                      data-testid={`button-delete-module-${mod.id}`}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t">
                    {mod.videos.length === 0 ? (
                      <div className="px-6 py-6 text-center text-sm text-muted-foreground">
                        No videos in this module yet
                      </div>
                    ) : (
                      <div className="divide-y">
                        {mod.videos.map((video, vidIndex) => (
                          <div
                            key={video.id}
                            className="flex items-center gap-3 px-6 py-2.5 hover:bg-muted/10 transition-colors"
                            data-testid={`video-${video.id}`}
                          >
                            <GripVertical className="size-3.5 text-muted-foreground shrink-0" />
                            <Video className="size-3.5 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate" data-testid={`text-video-title-${video.id}`}>
                                {video.title}
                              </p>
                            </div>
                            {video.video_duration && (
                              <span className="text-xs text-muted-foreground shrink-0">
                                {video.video_duration}
                              </span>
                            )}
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                disabled={vidIndex === 0}
                                onClick={() => moveVideo(mod.id, vidIndex, "up")}
                                data-testid={`button-move-up-video-${video.id}`}
                              >
                                <ArrowUp className="size-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                disabled={vidIndex === mod.videos.length - 1}
                                onClick={() => moveVideo(mod.id, vidIndex, "down")}
                                data-testid={`button-move-down-video-${video.id}`}
                              >
                                <ArrowDown className="size-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openEditVideo(video)}
                                data-testid={`button-edit-video-${video.id}`}
                              >
                                <Pencil className="size-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => confirmDelete("video", video.id, video.title)}
                                data-testid={`button-delete-video-${video.id}`}
                              >
                                <Trash2 className="size-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="px-6 py-2.5 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openAddVideo(mod.id)}
                        data-testid={`button-add-video-${mod.id}`}
                      >
                        <Plus className="size-3.5 mr-1.5" />
                        Add Video
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <FormDialog
        open={moduleDialogOpen}
        onOpenChange={(open) => {
          setModuleDialogOpen(open)
          if (!open) setEditingModule(null)
        }}
        title={editingModule ? "Edit Module" : "Add Module"}
        onSubmit={handleSubmitModule}
        submitLabel={editingModule ? "Update" : "Create"}
        isSubmitting={submittingModule}
      >
        <div className="space-y-1.5">
          <Label htmlFor="module-title">Title</Label>
          <Input
            id="module-title"
            placeholder="e.g. Getting Started"
            value={moduleForm.title}
            onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
            data-testid="input-module-title"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="module-description">Description</Label>
          <Textarea
            id="module-description"
            placeholder="Module description..."
            value={moduleForm.description}
            onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
            className="resize-none"
            data-testid="input-module-description"
          />
        </div>
      </FormDialog>

      <FormDialog
        open={videoDialogOpen}
        onOpenChange={(open) => {
          setVideoDialogOpen(open)
          if (!open) setEditingVideo(null)
        }}
        title={editingVideo ? "Edit Video" : "Add Video"}
        onSubmit={handleSubmitVideo}
        submitLabel={editingVideo ? "Update" : "Add"}
        isSubmitting={submittingVideo}
      >
        <div className="space-y-1.5">
          <Label htmlFor="video-title">Title</Label>
          <Input
            id="video-title"
            placeholder="e.g. Introduction to Dropshipping"
            value={videoForm.title}
            onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
            data-testid="input-video-title"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="video-url">Video URL</Label>
          <Input
            id="video-url"
            placeholder="https://..."
            value={videoForm.video_url}
            onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
            data-testid="input-video-url"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="video-duration">Duration</Label>
          <Input
            id="video-duration"
            placeholder="e.g. 12:30"
            value={videoForm.video_duration}
            onChange={(e) => setVideoForm({ ...videoForm, video_duration: e.target.value })}
            data-testid="input-video-duration"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="video-description">Description</Label>
          <Textarea
            id="video-description"
            placeholder="Video description..."
            value={videoForm.description}
            onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
            className="resize-none"
            data-testid="input-video-description"
          />
        </div>
      </FormDialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget?.type === "module" ? "Module" : "Video"}</DialogTitle>
            <DialogDescription>
              {deleteTarget?.type === "module"
                ? "This will permanently delete this module and all its videos. This action cannot be undone."
                : "This will permanently delete this video. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="py-2">
              <p className="text-sm">
                <span className="font-medium">{deleteTarget.type === "module" ? "Module" : "Video"}:</span>{" "}
                {deleteTarget.title}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
              data-testid="button-cancel-delete"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              data-testid="button-confirm-delete"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
