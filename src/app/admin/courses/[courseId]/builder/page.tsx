"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Eye, Plus, X } from "lucide-react"
import { Course, Module, Chapter, ChapterContentType } from "../../data/courses"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"
import {
  fetchCourseFromAPI,
  saveCourseToAPI,
  saveModuleToAPI,
  deleteModuleFromAPI,
  saveChapterToAPI,
  deleteChapterFromAPI,
} from "../../utils/api-helpers"
import { CourseStructureTree } from "../../components/course-structure-tree"
import { CourseContentEditor } from "../../components/course-content-editor"
import { CourseSettingsPanel } from "../../components/course-settings-panel"
import { VideoUploader } from "@/components/courses/video-uploader"

export default function CourseBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const courseId = params?.courseId as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [moduleFormOpen, setModuleFormOpen] = useState(false)
  const [chapterFormOpen, setChapterFormOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [moduleForChapter, setModuleForChapter] = useState<Module | null>(null)

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true)
        if (courseId && courseId !== "new") {
          const fetchedCourse = await fetchCourseFromAPI(courseId)
          setCourse(fetchedCourse)
        } else if (courseId === "new") {
          const newCourse: Course = {
            id: `course_${Date.now()}`,
            title: "Untitled Course",
            slug: `untitled-course-${Date.now()}`,
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
          }
          setCourse(newCourse)
        }
      } catch (err) {
        console.error("Error loading course:", err)
        showError(err instanceof Error ? err.message : "Failed to load course")
      } finally {
        setLoading(false)
      }
    }
    
    loadCourse()
  }, [courseId, showError])

  const handleSaveCourse = useCallback(async () => {
    if (!course || !courseId) return
    setSaving(true)
    try {
      const savedCourse = await saveCourseToAPI(courseId, course)
      setCourse(savedCourse)
      showSuccess("Course saved successfully")
      
      // If it was a new course, update the URL with the new ID
      if (courseId === "new" && savedCourse.id) {
        router.replace(`/admin/courses/${savedCourse.id}/builder`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save course"
      showError(errorMessage)
    } finally {
      setSaving(false)
    }
  }, [course, courseId, showSuccess, showError, router])

  const handleModuleSelect = useCallback((module: Module) => {
    setSelectedModuleId(module.id)
    setSelectedModule(module)
    setSelectedChapterId(null)
    setSelectedChapter(null)
  }, [])

  const handleChapterSelect = useCallback((chapter: Chapter, module: Module) => {
    setSelectedChapterId(chapter.id)
    setSelectedChapter(chapter)
    setSelectedModuleId(module.id)
    setSelectedModule(module)
  }, [])

  const handleAddModule = useCallback(() => {
    setEditingModule(null)
    setModuleFormOpen(true)
  }, [])

  const handleEditModule = useCallback((module: Module) => {
    setEditingModule(module)
    setModuleFormOpen(true)
  }, [])

  const handleDeleteModule = useCallback(async (module: Module) => {
    if (!course || !courseId || courseId === "new") {
      showError("Please save the course before deleting modules")
      return
    }
    
    try {
      await deleteModuleFromAPI(courseId, module.id)
      const updatedCourse = await fetchCourseFromAPI(courseId)
      setCourse(updatedCourse)
      
      if (selectedModuleId === module.id) {
        setSelectedModuleId(null)
        setSelectedModule(null)
      }
      showSuccess("Module deleted successfully")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete module"
      showError(errorMessage)
    }
  }, [course, courseId, selectedModuleId, showSuccess, showError])

  const handleAddChapter = useCallback((moduleId: string) => {
    if (!course) return
    const module = course.modules?.find(m => m.id === moduleId)
    if (!module) return
    setModuleForChapter(module)
    setEditingChapter(null)
    setChapterFormOpen(true)
  }, [course])

  const handleEditChapter = useCallback((chapter: Chapter, module: Module) => {
    setModuleForChapter(module)
    setEditingChapter(chapter)
    setChapterFormOpen(true)
  }, [])

  const handleDeleteChapter = useCallback(async (chapter: Chapter, module: Module) => {
    if (!course || !courseId || courseId === "new") {
      showError("Please save the course before deleting chapters")
      return
    }
    
    try {
      await deleteChapterFromAPI(courseId, module.id, chapter.id)
      const updatedCourse = await fetchCourseFromAPI(courseId)
      setCourse(updatedCourse)
      
      if (selectedChapterId === chapter.id) {
        setSelectedChapterId(null)
        setSelectedChapter(null)
      }
      showSuccess("Chapter deleted successfully")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete chapter"
      showError(errorMessage)
    }
  }, [course, courseId, selectedChapterId, showSuccess, showError])

  const handleSaveModule = useCallback(async (moduleData: Module) => {
    if (!course || !courseId) return
    
    // For new courses, save the course first
    if (courseId === "new") {
      try {
        const savedCourse = await saveCourseToAPI(courseId, course)
        setCourse(savedCourse)
        router.replace(`/admin/courses/${savedCourse.id}/builder`)
        // Continue with module save after course is saved
        setTimeout(() => {
          handleSaveModule(moduleData)
        }, 100)
        return
      } catch (err) {
        showError("Please save the course before adding modules")
        return
      }
    }
    
    try {
      const isNew = !editingModule
      const moduleToSave: Module = {
        ...moduleData,
        course_id: course.id,
        order_index: editingModule?.order_index ?? (course.modules?.length || 0),
        chapters: editingModule?.chapters || [],
        created_at: editingModule?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      const savedModule = await saveModuleToAPI(courseId, moduleToSave, isNew)
      
      // Refetch course to get updated structure
      const updatedCourse = await fetchCourseFromAPI(courseId)
      setCourse(updatedCourse)
      
      setModuleFormOpen(false)
      setEditingModule(null)
      showSuccess(isNew ? "Module created successfully" : "Module updated successfully")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save module"
      showError(errorMessage)
    }
  }, [course, courseId, editingModule, showSuccess, showError, router])

  const handleSaveChapter = useCallback(async (chapterData: Chapter) => {
    if (!course || !moduleForChapter || !courseId) return
    
    // For new courses, save the course first
    if (courseId === "new") {
      try {
        const savedCourse = await saveCourseToAPI(courseId, course)
        setCourse(savedCourse)
        router.replace(`/admin/courses/${savedCourse.id}/builder`)
        // Continue with chapter save after course is saved
        setTimeout(() => {
          handleSaveChapter(chapterData)
        }, 100)
        return
      } catch (err) {
        showError("Please save the course before adding chapters")
        return
      }
    }
    
    try {
      const isNew = !editingChapter
      const chapterToSave: Chapter = {
        ...chapterData,
        module_id: moduleForChapter.id,
        order_index: editingChapter?.order_index ?? (moduleForChapter.chapters?.length || 0),
        created_at: editingChapter?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      const savedChapter = await saveChapterToAPI(courseId, moduleForChapter.id, chapterToSave, isNew)
      
      // Refetch course to get updated structure
      const updatedCourse = await fetchCourseFromAPI(courseId)
      setCourse(updatedCourse)
      
      setChapterFormOpen(false)
      setEditingChapter(null)
      setModuleForChapter(null)
      showSuccess(isNew ? "Chapter created successfully" : "Chapter updated successfully")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save chapter"
      showError(errorMessage)
    }
  }, [course, courseId, moduleForChapter, editingChapter, showSuccess, showError, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading course...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Course not found</div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/courses")}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{course.title || "Untitled Course"}</h1>
            <p className="text-xs text-muted-foreground">Course Builder</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveCourse}
            disabled={saving}
            className="cursor-pointer"
          >
            {saving ? (
              <>
                <Loader size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel: Course Structure Tree */}
        <div className="w-80 border-r flex flex-col">
          <CourseStructureTree
            course={course}
            onModuleSelect={handleModuleSelect}
            onChapterSelect={handleChapterSelect}
            onAddModule={handleAddModule}
            onAddChapter={handleAddChapter}
            onEditModule={handleEditModule}
            onEditChapter={handleEditChapter}
            onDeleteModule={handleDeleteModule}
            onDeleteChapter={handleDeleteChapter}
            selectedModuleId={selectedModuleId}
            selectedChapterId={selectedChapterId}
          />
        </div>

        {/* Center Panel: Content Editor */}
        <div className="flex-1 border-r flex flex-col">
          <CourseContentEditor
            course={selectedModuleId === null && selectedChapterId === null ? course : undefined}
            module={selectedModule || undefined}
            chapter={selectedChapter || undefined}
            onSave={(data) => {
              if (selectedChapter) {
                handleSaveChapter(data as Chapter)
              } else if (selectedModule) {
                handleSaveModule(data as Module)
              } else {
                setCourse(data as Course)
              }
            }}
          />
        </div>

        {/* Right Panel: Course Settings */}
        <div className="w-80 flex flex-col">
          <CourseSettingsPanel
            course={course}
            onSave={(updatedCourse) => {
              setCourse(updatedCourse)
            }}
          />
        </div>
      </div>

      {/* Module Form Modal */}
      <Dialog open={moduleFormOpen} onOpenChange={setModuleFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingModule ? "Edit Module" : "Add Module"}</DialogTitle>
            <DialogDescription>
              {editingModule
                ? "Update module information"
                : "Create a new module for this course"}
            </DialogDescription>
          </DialogHeader>
          <ModuleForm
            module={editingModule}
            onSave={handleSaveModule}
            onCancel={() => {
              setModuleFormOpen(false)
              setEditingModule(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Chapter Form Modal */}
      <Dialog open={chapterFormOpen} onOpenChange={setChapterFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingChapter ? "Edit Chapter" : "Add Chapter"}</DialogTitle>
            <DialogDescription>
              {editingChapter
                ? "Update chapter information"
                : "Create a new chapter for this module"}
            </DialogDescription>
          </DialogHeader>
          <ChapterForm
            chapter={editingChapter}
            courseId={courseId}
            moduleId={moduleForChapter?.id || editingChapter?.module_id || ""}
            onSave={handleSaveChapter}
            onCancel={() => {
              setChapterFormOpen(false)
              setEditingChapter(null)
              setModuleForChapter(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Module Form Component
function ModuleForm({
  module,
  onSave,
  onCancel,
}: {
  module: Module | null
  onSave: (module: Module) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(module?.title || "")
  const [description, setDescription] = useState(module?.description || "")
  const [thumbnail, setThumbnail] = useState(module?.thumbnail || "")
  const [isPreview, setIsPreview] = useState(module?.is_preview || false)

  const handleSubmit = () => {
    if (!title.trim()) return
    onSave({
      id: module?.id || "",
      course_id: module?.course_id || "",
      title,
      description: description || undefined,
      thumbnail: thumbnail || undefined,
      order_index: module?.order_index || 0,
      is_preview: isPreview,
      chapters: module?.chapters || [],
      created_at: module?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Module)
  }

  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="module-title">Title *</Label>
          <Input
            id="module-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter module title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="module-description">Description</Label>
          <textarea
            id="module-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter module description"
            className="w-full px-3 py-2 border rounded-md min-h-[80px] resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="module-thumbnail">Thumbnail URL</Label>
          <Input
            id="module-thumbnail"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="module-preview"
            checked={isPreview}
            onChange={(e) => setIsPreview(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="module-preview" className="cursor-pointer">
            Enable preview (free to view)
          </Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!title.trim()}>
          {module ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </>
  )
}

// Chapter Form Component
function ChapterForm({
  chapter,
  courseId,
  moduleId,
  onSave,
  onCancel,
}: {
  chapter: Chapter | null
  courseId: string
  moduleId: string
  onSave: (chapter: Chapter) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(chapter?.title || "")
  const [description, setDescription] = useState(chapter?.description || "")
  const [contentType, setContentType] = useState<ChapterContentType>(chapter?.content_type || "video")
  const [videoUrl, setVideoUrl] = useState(chapter?.content.video_url || "")
  const [videoStoragePath, setVideoStoragePath] = useState(chapter?.content.video_storage_path || "")
  const [textContent, setTextContent] = useState(chapter?.content.text_content || "")
  const [duration, setDuration] = useState(chapter?.duration || "")
  const [isPreview, setIsPreview] = useState(chapter?.is_preview || false)

  const handleSubmit = () => {
    if (!title.trim()) return
    
    // Build content object with video info (including storage path for temp uploads)
    const content: any = {}
    if (contentType === "video") {
      if (videoUrl) {
        content.video_url = videoUrl
      }
      // Include storage path if it exists (for temp uploads)
      if (videoStoragePath) {
        content.video_storage_path = videoStoragePath
      }
    } else if (contentType === "text") {
      content.text_content = textContent
    }
    
    onSave({
      id: chapter?.id || "",
      module_id: chapter?.module_id || "",
      title,
      description: description || undefined,
      content_type: contentType,
      content,
      order_index: chapter?.order_index || 0,
      duration: duration || undefined,
      is_preview: isPreview,
      created_at: chapter?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Chapter)
  }

  return (
    <>
      <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
        <div className="space-y-2">
          <Label htmlFor="chapter-title">Title *</Label>
          <Input
            id="chapter-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter chapter title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chapter-description">Description</Label>
          <textarea
            id="chapter-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter chapter description"
            className="w-full px-3 py-2 border rounded-md min-h-[80px] resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chapter-type">Content Type</Label>
          <select
            id="chapter-type"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ChapterContentType)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="video">Video</option>
            <option value="text">Text/Article</option>
            <option value="quiz">Quiz</option>
            <option value="assignment">Assignment</option>
            <option value="resource">Resource</option>
          </select>
        </div>
        {contentType === "video" && (
          <>
            <div className="space-y-2">
              <Label>Upload Video</Label>
              <VideoUploader
                courseId={courseId}
                moduleId={moduleId}
                chapterId={chapter?.id || "new"}
                existingVideoUrl={videoUrl || undefined}
                onUploadComplete={(url, path) => {
                  setVideoUrl(url)
                  setVideoStoragePath(path) // Store the storage path for temp uploads
                }}
                onUploadError={(error) => {
                  console.error("Video upload error:", error)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chapter-video-url">Or Enter Video URL (Alternative)</Label>
              <Input
                id="chapter-video-url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/video.mp4 or leave empty to use uploaded video"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chapter-duration">Duration</Label>
              <Input
                id="chapter-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 15:30"
              />
            </div>
          </>
        )}
        {contentType === "text" && (
          <div className="space-y-2">
            <Label htmlFor="chapter-text-content">Content</Label>
            <textarea
              id="chapter-text-content"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter text content"
              className="w-full px-3 py-2 border rounded-md min-h-[150px] resize-none"
            />
          </div>
        )}
        {(contentType === "quiz" || contentType === "assignment" || contentType === "resource") && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              {contentType.charAt(0).toUpperCase() + contentType.slice(1)} editor will be implemented in the next phase
            </p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="chapter-preview"
            checked={isPreview}
            onChange={(e) => setIsPreview(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="chapter-preview" className="cursor-pointer">
            Enable preview (free to view)
          </Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!title.trim()}>
          {chapter ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </>
  )
}
