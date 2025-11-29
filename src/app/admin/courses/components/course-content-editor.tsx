"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FileVideo, FileText, HelpCircle, FileDown, Save } from "lucide-react"
import { Course, Module, Chapter, ChapterContentType } from "../data/courses"

interface CourseContentEditorProps {
  course?: Course | null
  module?: Module | null
  chapter?: Chapter | null
  onSave?: (data: Course | Module | Chapter) => void
}

export function CourseContentEditor({
  course,
  module,
  chapter,
  onSave,
}: CourseContentEditorProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [contentType, setContentType] = useState<ChapterContentType>("video")
  const [videoUrl, setVideoUrl] = useState("")
  const [textContent, setTextContent] = useState("")

  useEffect(() => {
    if (course) {
      setTitle(course.title)
      setDescription(course.description)
    } else if (module) {
      setTitle(module.title)
      setDescription(module.description || "")
    } else if (chapter) {
      setTitle(chapter.title)
      setDescription(chapter.description || "")
      setContentType(chapter.content_type)
      setVideoUrl(chapter.content.video_url || "")
      setTextContent(chapter.content.text_content || "")
    } else {
      setTitle("")
      setDescription("")
      setContentType("video")
      setVideoUrl("")
      setTextContent("")
    }
  }, [course, module, chapter])

  const handleSave = () => {
    if (!onSave) return
    
    if (course) {
      onSave({
        ...course,
        title,
        description,
      } as Course)
    } else if (module) {
      onSave({
        ...module,
        title,
        description: description || undefined,
      } as Module)
    } else if (chapter) {
      onSave({
        ...chapter,
        title,
        description: description || undefined,
        content_type: contentType,
        content: {
          ...chapter.content,
          video_url: videoUrl || undefined,
          text_content: textContent || undefined,
        },
      } as Chapter)
    }
  }

  if (!course && !module && !chapter) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a course, module, or chapter to edit</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-sm font-semibold">
          {course ? "Course Details" : module ? "Module Details" : "Chapter Details"}
        </h2>
        {onSave && (
          <Button size="sm" onClick={handleSave} className="cursor-pointer">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full px-3 py-2 border rounded-md min-h-[100px] resize-none"
          />
        </div>

        {/* Chapter-specific fields */}
        {chapter && (
          <>
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <select
                id="content-type"
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
              <div className="space-y-2">
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            )}

            {contentType === "text" && (
              <div className="space-y-2">
                <Label htmlFor="text-content">Content</Label>
                <textarea
                  id="text-content"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter text content"
                  className="w-full px-3 py-2 border rounded-md min-h-[200px] resize-none"
                />
              </div>
            )}

            {contentType === "quiz" && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Quiz editor will be implemented here
                </p>
              </div>
            )}

            {contentType === "assignment" && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Assignment editor will be implemented here
                </p>
              </div>
            )}

            {contentType === "resource" && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Resource editor will be implemented here
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}



