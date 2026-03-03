import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useRouter } from "@/hooks/use-router"
import { apiFetch } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Video,
  FileText,
  Upload,
  Youtube,
  X,
  Loader2,
  BookOpen,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Course, Module, Chapter, ChapterContentType } from "../../data/courses"
import { useToast } from "@/hooks/use-toast"
import {
  fetchCourseFromAPI,
  saveCourseToAPI,
  saveModuleToAPI,
  deleteModuleFromAPI,
  saveChapterToAPI,
  deleteChapterFromAPI,
} from "../../utils/api-helpers"

type VideoSource = "youtube" | "upload"

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function CourseBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const courseId = params?.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [selectedItem, setSelectedItem] = useState<{
    type: "course" | "module" | "chapter"
    moduleId?: string
    chapterId?: string
  }>({ type: "course" })

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true)
        if (courseId && courseId !== "new") {
          const fetchedCourse = await fetchCourseFromAPI(courseId)
          setCourse(fetchedCourse)
          const moduleIds = new Set(fetchedCourse.modules?.map(m => m.id) || [])
          setExpandedModules(moduleIds)
        } else if (courseId === "new") {
          setCourse({
            id: "",
            title: "Untitled Course",
            slug: "",
            description: "",
            instructor_id: null,
            instructor_name: "",
            instructor_avatar: null,
            thumbnail: null,
            duration: null,
            lessons_count: 0,
            students_count: 0,
            rating: null,
            price: 0,
            category: null,
            level: null,
            featured: false,
            published: false,
            published_at: null,
            modules: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }
      } catch (err) {
        showError(err instanceof Error ? err.message : "Failed to load course")
      } finally {
        setLoading(false)
      }
    }
    loadCourse()
  }, [courseId, showError])

  const ensureCourseIsSaved = useCallback(async (): Promise<string | null> => {
    if (!course) return null
    if (courseId !== "new") return courseId

    try {
      const savedCourse = await saveCourseToAPI("new", course)
      setCourse(savedCourse)
      router.replace(`/admin/courses/${savedCourse.id}/builder`)
      return savedCourse.id
    } catch (err) {
      showError("Please save the course first")
      return null
    }
  }, [course, courseId, router, showError])

  const handleSaveCourse = useCallback(async () => {
    if (!course) return
    setSaving(true)
    try {
      const savedCourse = await saveCourseToAPI(courseId, course)
      setCourse(savedCourse)
      showSuccess("Course saved")
      if (courseId === "new" && savedCourse.id) {
        router.replace(`/admin/courses/${savedCourse.id}/builder`)
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to save course")
    } finally {
      setSaving(false)
    }
  }, [course, courseId, showSuccess, showError, router])

  const handleAddModule = useCallback(async () => {
    const realCourseId = await ensureCourseIsSaved()
    if (!realCourseId || !course) return

    try {
      const newModule: Module = {
        id: "",
        course_id: realCourseId,
        title: "New Module",
        order_index: course.modules?.length || 0,
        chapters: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      await saveModuleToAPI(realCourseId, newModule, true)
      const updatedCourse = await fetchCourseFromAPI(realCourseId)
      setCourse(updatedCourse)
      const lastModule = updatedCourse.modules?.[updatedCourse.modules.length - 1]
      if (lastModule) {
        setExpandedModules(prev => new Set([...prev, lastModule.id]))
        setSelectedItem({ type: "module", moduleId: lastModule.id })
      }
      showSuccess("Module added")
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to add module")
    }
  }, [course, ensureCourseIsSaved, showSuccess, showError])

  const handleAddChapter = useCallback(async (moduleId: string) => {
    const realCourseId = await ensureCourseIsSaved()
    if (!realCourseId) return

    try {
      const module = course?.modules?.find(m => m.id === moduleId)
      const newChapter: Chapter = {
        id: "",
        module_id: moduleId,
        title: "New Lesson",
        content_type: "video",
        content: {},
        order_index: module?.chapters?.length || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      await saveChapterToAPI(realCourseId, moduleId, newChapter, true)
      const updatedCourse = await fetchCourseFromAPI(realCourseId)
      setCourse(updatedCourse)
      const updatedModule = updatedCourse.modules?.find(m => m.id === moduleId)
      const lastChapter = updatedModule?.chapters?.[updatedModule.chapters.length - 1]
      if (lastChapter) {
        setSelectedItem({ type: "chapter", moduleId, chapterId: lastChapter.id })
      }
      showSuccess("Lesson added")
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to add lesson")
    }
  }, [course, ensureCourseIsSaved, showSuccess, showError])

  const handleDeleteModule = useCallback(async (moduleId: string) => {
    if (!courseId || courseId === "new") return
    if (!window.confirm("Delete this module and all its lessons?")) return

    try {
      await deleteModuleFromAPI(courseId, moduleId)
      const updatedCourse = await fetchCourseFromAPI(courseId)
      setCourse(updatedCourse)
      if (selectedItem.moduleId === moduleId) {
        setSelectedItem({ type: "course" })
      }
      showSuccess("Module deleted")
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete module")
    }
  }, [courseId, selectedItem, showSuccess, showError])

  const handleDeleteChapter = useCallback(async (moduleId: string, chapterId: string) => {
    if (!courseId || courseId === "new") return
    if (!window.confirm("Delete this lesson?")) return

    try {
      await deleteChapterFromAPI(courseId, moduleId, chapterId)
      const updatedCourse = await fetchCourseFromAPI(courseId)
      setCourse(updatedCourse)
      if (selectedItem.chapterId === chapterId) {
        setSelectedItem({ type: "module", moduleId })
      }
      showSuccess("Lesson deleted")
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete lesson")
    }
  }, [courseId, selectedItem, showSuccess, showError])

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(moduleId)) next.delete(moduleId)
      else next.add(moduleId)
      return next
    })
  }

  const getSelectedModule = (): Module | undefined => {
    if (!course?.modules || !selectedItem.moduleId) return undefined
    return course.modules.find(m => m.id === selectedItem.moduleId)
  }

  const getSelectedChapter = (): Chapter | undefined => {
    const module = getSelectedModule()
    if (!module?.chapters || !selectedItem.chapterId) return undefined
    return module.chapters.find(c => c.id === selectedItem.chapterId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 h-[calc(100vh-80px)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/courses")}
            className="cursor-pointer"
            data-testid="button-back-courses"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Courses
          </Button>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-sm font-semibold truncate max-w-[300px]" data-testid="text-course-title">
            {course.title || "Untitled Course"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-3">
            <Label htmlFor="publish-toggle" className="text-xs text-muted-foreground">Published</Label>
            <Switch
              id="publish-toggle"
              checked={course.published}
              onCheckedChange={(checked) => setCourse({ ...course, published: checked })}
              data-testid="switch-published"
            />
          </div>
          <Button
            size="sm"
            onClick={handleSaveCourse}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
            data-testid="button-save-course"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className="w-72 border-r bg-white flex flex-col flex-shrink-0">
          <div className="p-3 border-b flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Structure</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddModule}
              className="h-7 px-2 text-xs cursor-pointer"
              data-testid="button-add-module"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Module
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            <button
              onClick={() => setSelectedItem({ type: "course" })}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                selectedItem.type === "course" && !selectedItem.moduleId
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              )}
              data-testid="button-select-course"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Course Settings</span>
              </div>
            </button>

            {course.modules?.map((module, moduleIndex) => (
              <div key={module.id} className="mt-1">
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors group",
                    selectedItem.type === "module" && selectedItem.moduleId === module.id && !selectedItem.chapterId
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  )}
                >
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="p-0.5 hover:bg-gray-200 rounded cursor-pointer flex-shrink-0"
                    data-testid={`button-toggle-module-${module.id}`}
                  >
                    {expandedModules.has(module.id) ? (
                      <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedItem({ type: "module", moduleId: module.id })}
                    className={cn(
                      "flex-1 text-left text-sm font-medium truncate cursor-pointer",
                      selectedItem.type === "module" && selectedItem.moduleId === module.id && !selectedItem.chapterId
                        ? "text-blue-700"
                        : "text-gray-700"
                    )}
                    data-testid={`button-select-module-${module.id}`}
                  >
                    {module.title}
                  </button>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleAddChapter(module.id)}
                      className="p-1 hover:bg-blue-100 rounded text-blue-600 cursor-pointer"
                      title="Add lesson"
                      data-testid={`button-add-chapter-${module.id}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-500 cursor-pointer"
                      title="Delete module"
                      data-testid={`button-delete-module-${module.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {expandedModules.has(module.id) && (
                  <div className="ml-5 mt-0.5 space-y-0.5">
                    {module.chapters?.map((chapter, chapterIndex) => (
                      <div
                        key={chapter.id}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors group/chapter",
                          selectedItem.chapterId === chapter.id
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        )}
                      >
                        <span className="flex-shrink-0">
                          {chapter.content_type === "video" ? (
                            <Video className="h-3.5 w-3.5 text-gray-400" />
                          ) : (
                            <FileText className="h-3.5 w-3.5 text-gray-400" />
                          )}
                        </span>
                        <button
                          onClick={() => setSelectedItem({ type: "chapter", moduleId: module.id, chapterId: chapter.id })}
                          className={cn(
                            "flex-1 text-left text-[13px] truncate cursor-pointer",
                            selectedItem.chapterId === chapter.id
                              ? "text-blue-700 font-medium"
                              : "text-gray-600"
                          )}
                          data-testid={`button-select-chapter-${chapter.id}`}
                        >
                          {chapter.title}
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(module.id, chapter.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-400 opacity-0 group-hover/chapter:opacity-100 cursor-pointer"
                          title="Delete lesson"
                          data-testid={`button-delete-chapter-${chapter.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {(!module.chapters || module.chapters.length === 0) && (
                      <button
                        onClick={() => handleAddChapter(module.id)}
                        className="w-full text-left px-2 py-1.5 text-xs text-muted-foreground hover:text-blue-600 cursor-pointer"
                        data-testid={`button-add-first-chapter-${module.id}`}
                      >
                        + Add first lesson
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {(!course.modules || course.modules.length === 0) && (
              <div className="px-3 py-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">No modules yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddModule}
                  className="cursor-pointer"
                  data-testid="button-add-first-module"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Module
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#F5F5F7]">
          <div className="max-w-3xl mx-auto p-6">
            {selectedItem.type === "course" && (
              <CourseSettingsEditor
                course={course}
                onChange={(updated) => setCourse(updated)}
              />
            )}
            {selectedItem.type === "module" && getSelectedModule() && (
              <ModuleEditor
                module={getSelectedModule()!}
                courseId={courseId}
                onSave={async (updated) => {
                  if (!courseId || courseId === "new") return
                  try {
                    await saveModuleToAPI(courseId, updated, false)
                    const refreshed = await fetchCourseFromAPI(courseId)
                    setCourse(refreshed)
                    showSuccess("Module updated")
                  } catch (err) {
                    showError(err instanceof Error ? err.message : "Failed to save module")
                  }
                }}
              />
            )}
            {selectedItem.type === "chapter" && getSelectedChapter() && getSelectedModule() && (
              <ChapterEditor
                chapter={getSelectedChapter()!}
                module={getSelectedModule()!}
                courseId={courseId}
                onSave={async (updated) => {
                  if (!courseId || courseId === "new") return
                  const moduleId = selectedItem.moduleId!
                  try {
                    await saveChapterToAPI(courseId, moduleId, updated, false)
                    const refreshed = await fetchCourseFromAPI(courseId)
                    setCourse(refreshed)
                    showSuccess("Lesson saved")
                  } catch (err) {
                    showError(err instanceof Error ? err.message : "Failed to save lesson")
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseSettingsEditor({
  course,
  onChange,
}: {
  course: Course
  onChange: (course: Course) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4" data-testid="text-settings-heading">Course Settings</h2>
      </div>

      <div className="bg-white rounded-xl border p-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="course-title">Course Title</Label>
          <Input
            id="course-title"
            value={course.title}
            onChange={(e) => onChange({ ...course, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
            placeholder="Enter course title"
            data-testid="input-course-title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course-description">Description</Label>
          <textarea
            id="course-description"
            value={course.description || ""}
            onChange={(e) => onChange({ ...course, description: e.target.value })}
            placeholder="What will students learn in this course?"
            className="w-full px-3 py-2 border rounded-lg min-h-[100px] resize-none text-sm"
            data-testid="textarea-course-description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="course-category">Category</Label>
            <Input
              id="course-category"
              value={course.category || ""}
              onChange={(e) => onChange({ ...course, category: e.target.value })}
              placeholder="e.g., Dropshipping"
              data-testid="input-course-category"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course-level">Level</Label>
            <select
              id="course-level"
              value={course.level || ""}
              onChange={(e) => onChange({ ...course, level: (e.target.value || null) as Course["level"] })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              data-testid="select-course-level"
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="course-price">Price ($)</Label>
            <Input
              id="course-price"
              type="number"
              min="0"
              step="0.01"
              value={course.price}
              onChange={(e) => onChange({ ...course, price: parseFloat(e.target.value) || 0 })}
              data-testid="input-course-price"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course-thumbnail">Thumbnail URL</Label>
            <Input
              id="course-thumbnail"
              value={course.thumbnail || ""}
              onChange={(e) => onChange({ ...course, thumbnail: e.target.value || null })}
              placeholder="https://..."
              data-testid="input-course-thumbnail"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ModuleEditor({
  module,
  courseId,
  onSave,
}: {
  module: Module
  courseId: string
  onSave: (module: Module) => void
}) {
  const [title, setTitle] = useState(module.title)
  const [description, setDescription] = useState(module.description || "")

  useEffect(() => {
    setTitle(module.title)
    setDescription(module.description || "")
  }, [module.id])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" data-testid="text-module-heading">Edit Module</h2>
        <Button
          size="sm"
          onClick={() => onSave({ ...module, title, description })}
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
          data-testid="button-save-module"
        >
          <Save className="h-4 w-4 mr-1" />
          Save Module
        </Button>
      </div>

      <div className="bg-white rounded-xl border p-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="module-title">Module Title</Label>
          <Input
            id="module-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter module title"
            data-testid="input-module-title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="module-description">Description</Label>
          <textarea
            id="module-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Module description (optional)"
            className="w-full px-3 py-2 border rounded-lg min-h-[80px] resize-none text-sm"
            data-testid="textarea-module-description"
          />
        </div>
        <div className="pt-2 text-xs text-muted-foreground">
          {module.chapters?.length || 0} lesson(s) in this module
        </div>
      </div>
    </div>
  )
}

function ChapterEditor({
  chapter,
  module,
  courseId,
  onSave,
}: {
  chapter: Chapter
  module: Module
  courseId: string
  onSave: (chapter: Chapter) => void
}) {
  const { showError } = useToast()
  const [title, setTitle] = useState(chapter.title)
  const [description, setDescription] = useState(chapter.description || "")
  const [contentType, setContentType] = useState<ChapterContentType>(chapter.content_type)
  const [videoSource, setVideoSource] = useState<VideoSource>(
    chapter.content?.video_url && extractYouTubeId(chapter.content.video_url) ? "youtube" : "upload"
  )
  const [youtubeUrl, setYoutubeUrl] = useState(
    chapter.content?.video_url && extractYouTubeId(chapter.content.video_url) ? chapter.content.video_url : ""
  )
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(
    chapter.content?.video_url && !extractYouTubeId(chapter.content.video_url || "") ? chapter.content.video_url : ""
  )
  const [uploadedVideoPath, setUploadedVideoPath] = useState(chapter.content?.video_storage_path || "")
  const [textContent, setTextContent] = useState(chapter.content?.text_content || "")
  const [duration, setDuration] = useState(chapter.duration || "")
  const [isPreview, setIsPreview] = useState(chapter.is_preview || false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTitle(chapter.title)
    setDescription(chapter.description || "")
    setContentType(chapter.content_type)
    setTextContent(chapter.content?.text_content || "")
    setDuration(chapter.duration || "")
    setIsPreview(chapter.is_preview || false)

    const videoUrl = chapter.content?.video_url || ""
    const ytId = extractYouTubeId(videoUrl)
    if (ytId) {
      setVideoSource("youtube")
      setYoutubeUrl(videoUrl)
      setUploadedVideoUrl("")
      setUploadedVideoPath("")
    } else if (videoUrl) {
      setVideoSource("upload")
      setUploadedVideoUrl(videoUrl)
      setUploadedVideoPath(chapter.content?.video_storage_path || "")
      setYoutubeUrl("")
    } else {
      setVideoSource("youtube")
      setYoutubeUrl("")
      setUploadedVideoUrl("")
      setUploadedVideoPath("")
    }
  }, [chapter.id])

  const handleFileUpload = async (file: File) => {
    if (!courseId || courseId === "new") {
      showError("Save the course before uploading videos")
      return
    }

    const allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"]
    if (!allowedTypes.includes(file.type)) {
      showError("Only MP4, WebM, OGG, and QuickTime videos are allowed")
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      showError("File size must be under 500MB")
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const xhr = new XMLHttpRequest()

      const result = await new Promise<{ url: string; path: string }>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100))
          }
        })

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText)
            resolve({
              url: data.video?.signedUrl || data.video?.url || "",
              path: data.video?.path || "",
            })
          } else {
            try {
              const errData = JSON.parse(xhr.responseText)
              reject(new Error(errData.error || "Upload failed"))
            } catch {
              reject(new Error("Upload failed"))
            }
          }
        })

        xhr.addEventListener("error", () => reject(new Error("Upload failed")))

        const token = localStorage.getItem("auth_token")
        xhr.open("POST", `/api/admin/courses/${courseId}/upload-video`)
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`)
        xhr.send(formData)
      })

      setUploadedVideoUrl(result.url)
      setUploadedVideoPath(result.path)
      setUploadProgress(100)
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to upload video")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = () => {
    const content: Record<string, any> = {}
    if (contentType === "video") {
      if (videoSource === "youtube" && youtubeUrl) {
        content.video_url = youtubeUrl
      } else if (videoSource === "upload" && uploadedVideoUrl) {
        content.video_url = uploadedVideoUrl
        content.video_storage_path = uploadedVideoPath
      }
    } else if (contentType === "text") {
      content.text_content = textContent
    }

    onSave({
      ...chapter,
      title,
      description: description || undefined,
      content_type: contentType,
      content,
      duration: duration || undefined,
      is_preview: isPreview,
      updated_at: new Date().toISOString(),
    })
  }

  const youtubeId = videoSource === "youtube" ? extractYouTubeId(youtubeUrl) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" data-testid="text-chapter-heading">Edit Lesson</h2>
        <Button
          size="sm"
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
          data-testid="button-save-chapter"
        >
          <Save className="h-4 w-4 mr-1" />
          Save Lesson
        </Button>
      </div>

      <div className="bg-white rounded-xl border p-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="chapter-title">Lesson Title</Label>
          <Input
            id="chapter-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter lesson title"
            data-testid="input-chapter-title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chapter-description">Description</Label>
          <textarea
            id="chapter-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description (optional)"
            className="w-full px-3 py-2 border rounded-lg min-h-[60px] resize-none text-sm"
            data-testid="textarea-chapter-description"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="space-y-2 flex-1">
            <Label>Content Type</Label>
            <div className="flex gap-2">
              <Button
                variant={contentType === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => setContentType("video")}
                className={cn("cursor-pointer", contentType === "video" && "bg-blue-500 hover:bg-blue-600")}
                data-testid="button-type-video"
              >
                <Video className="h-4 w-4 mr-1" />
                Video
              </Button>
              <Button
                variant={contentType === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setContentType("text")}
                className={cn("cursor-pointer", contentType === "text" && "bg-blue-500 hover:bg-blue-600")}
                data-testid="button-type-text"
              >
                <FileText className="h-4 w-4 mr-1" />
                Text
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="chapter-duration">Duration</Label>
            <Input
              id="chapter-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 15:30"
              className="w-24"
              data-testid="input-chapter-duration"
            />
          </div>
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="pt-1">
              <Switch
                checked={isPreview}
                onCheckedChange={setIsPreview}
                data-testid="switch-chapter-preview"
              />
            </div>
          </div>
        </div>
      </div>

      {contentType === "video" && (
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <div className="flex gap-2 mb-2">
            <Button
              variant={videoSource === "youtube" ? "default" : "outline"}
              size="sm"
              onClick={() => setVideoSource("youtube")}
              className={cn("cursor-pointer", videoSource === "youtube" && "bg-blue-500 hover:bg-blue-600")}
              data-testid="button-source-youtube"
            >
              <Youtube className="h-4 w-4 mr-1" />
              YouTube URL
            </Button>
            <Button
              variant={videoSource === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setVideoSource("upload")}
              className={cn("cursor-pointer", videoSource === "upload" && "bg-blue-500 hover:bg-blue-600")}
              data-testid="button-source-upload"
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload Video
            </Button>
          </div>

          {videoSource === "youtube" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube Video URL</Label>
                <Input
                  id="youtube-url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  data-testid="input-youtube-url"
                />
              </div>
              {youtubeId && (
                <div className="rounded-lg overflow-hidden border aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video preview"
                    data-testid="iframe-youtube-preview"
                  />
                </div>
              )}
            </div>
          )}

          {videoSource === "upload" && (
            <div className="space-y-3">
              {uploadedVideoUrl && !uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">Video uploaded</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUploadedVideoUrl("")
                        setUploadedVideoPath("")
                      }}
                      className="h-7 px-2 text-red-500 hover:text-red-600 cursor-pointer"
                      data-testid="button-remove-video"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Remove
                    </Button>
                  </div>
                  <video
                    src={uploadedVideoUrl}
                    controls
                    className="w-full rounded-lg border aspect-video bg-black"
                    data-testid="video-preview"
                  />
                </div>
              )}

              {uploading && (
                <div className="space-y-2 p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm font-medium text-blue-700">Uploading... {uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {!uploadedVideoUrl && !uploading && (
                <div
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const file = e.dataTransfer.files[0]
                    if (file) handleFileUpload(file)
                  }}
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="dropzone-video-upload"
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Drop video here or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">MP4, WebM, OGG, QuickTime — up to 500MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                  e.target.value = ""
                }}
                data-testid="input-file-upload"
              />
            </div>
          )}
        </div>
      )}

      {contentType === "text" && (
        <div className="bg-white rounded-xl border p-5 space-y-2">
          <Label htmlFor="text-content">Lesson Content</Label>
          <textarea
            id="text-content"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Write the lesson content here..."
            className="w-full px-3 py-2 border rounded-lg min-h-[300px] resize-y text-sm"
            data-testid="textarea-lesson-content"
          />
        </div>
      )}
    </div>
  )
}
