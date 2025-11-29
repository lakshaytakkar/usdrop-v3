"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Eye, Plus, X } from "lucide-react"
import { Course, Module, Chapter, ChapterContentType } from "../../data/courses"
import { sampleCourses } from "../../data/courses"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"
import { CourseStructureTree } from "../../components/course-structure-tree"
import { CourseContentEditor } from "../../components/course-content-editor"
import { CourseSettingsPanel } from "../../components/course-settings-panel"

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
    if (courseId && courseId !== "new") {
      const foundCourse = sampleCourses.find(c => c.id === courseId)
      if (foundCourse) {
        setCourse({ ...foundCourse, modules: foundCourse.modules || [] })
      }
      setLoading(false)
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
      setLoading(false)
    }
  }, [courseId])

  const handleSaveCourse = useCallback(async () => {
    if (!course) return
    setSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      showSuccess("Course saved successfully")
    } catch (err) {
      showError("Failed to save course")
    } finally {
      setSaving(false)
    }
  }, [course, showSuccess, showError])

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

  const handleDeleteModule = useCallback((module: Module) => {
    if (!course) return
    setCourse({
      ...course,
      modules: course.modules?.filter(m => m.id !== module.id) || [],
    })
    if (selectedModuleId === module.id) {
      setSelectedModuleId(null)
      setSelectedModule(null)
    }
  }, [course, selectedModuleId])

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

  const handleDeleteChapter = useCallback((chapter: Chapter, module: Module) => {
    if (!course) return
    setCourse({
      ...course,
      modules: course.modules?.map(m =>
        m.id === module.id
          ? { ...m, chapters: m.chapters?.filter(ch => ch.id !== chapter.id) || [] }
          : m
      ) || [],
    })
    if (selectedChapterId === chapter.id) {
      setSelectedChapterId(null)
      setSelectedChapter(null)
    }
  }, [course, selectedChapterId])

  const handleSaveModule = useCallback((moduleData: Module) => {
    if (!course) return
    if (editingModule) {
      // Update existing module
      setCourse({
        ...course,
        modules: course.modules?.map(m =>
          m.id === editingModule.id ? { ...moduleData, course_id: course.id } : m
        ) || [],
      })
    } else {
      // Add new module
      const newModule: Module = {
        ...moduleData,
        id: `module_${Date.now()}`,
        course_id: course.id,
        order_index: (course.modules?.length || 0),
        chapters: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setCourse({
        ...course,
        modules: [...(course.modules || []), newModule],
      })
    }
    setModuleFormOpen(false)
    setEditingModule(null)
  }, [course, editingModule])

  const handleSaveChapter = useCallback((chapterData: Chapter) => {
    if (!course || !moduleForChapter) return
    if (editingChapter) {
      // Update existing chapter
      setCourse({
        ...course,
        modules: course.modules?.map(m =>
          m.id === moduleForChapter.id
            ? {
                ...m,
                chapters: m.chapters?.map(ch =>
                  ch.id === editingChapter.id
                    ? { ...chapterData, module_id: m.id }
                    : ch
                ) || [],
              }
            : m
        ) || [],
      })
    } else {
      // Add new chapter
      const newChapter: Chapter = {
        ...chapterData,
        id: `chapter_${Date.now()}`,
        module_id: moduleForChapter.id,
        order_index: (moduleForChapter.chapters?.length || 0),
        content: {
          video_url: chapterData.content.video_url || undefined,
          text_content: chapterData.content.text_content || undefined,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setCourse({
        ...course,
        modules: course.modules?.map(m =>
          m.id === moduleForChapter.id
            ? { ...m, chapters: [...(m.chapters || []), newChapter] }
            : m
        ) || [],
      })
    }
    setChapterFormOpen(false)
    setEditingChapter(null)
    setModuleForChapter(null)
  }, [course, moduleForChapter, editingChapter])

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
  onSave,
  onCancel,
}: {
  chapter: Chapter | null
  onSave: (chapter: Chapter) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(chapter?.title || "")
  const [description, setDescription] = useState(chapter?.description || "")
  const [contentType, setContentType] = useState<ChapterContentType>(chapter?.content_type || "video")
  const [videoUrl, setVideoUrl] = useState(chapter?.content.video_url || "")
  const [textContent, setTextContent] = useState(chapter?.content.text_content || "")
  const [duration, setDuration] = useState(chapter?.duration || "")
  const [isPreview, setIsPreview] = useState(chapter?.is_preview || false)

  const handleSubmit = () => {
    if (!title.trim()) return
    onSave({
      id: chapter?.id || "",
      module_id: chapter?.module_id || "",
      title,
      description: description || undefined,
      content_type: contentType,
      content: {
        video_url: contentType === "video" ? videoUrl : undefined,
        text_content: contentType === "text" ? textContent : undefined,
      },
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
              <Label htmlFor="chapter-video-url">Video URL</Label>
              <Input
                id="chapter-video-url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/video.mp4"
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
