

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ChevronDown, ChevronRight, GripVertical, Edit, Trash2, FileVideo, FileText, HelpCircle, FileDown, BookOpen } from "lucide-react"
import { Course, Module, Chapter } from "../data/courses"
import { ChapterContentType } from "../data/courses"

interface CourseStructureTreeProps {
  course: Course
  onModuleSelect?: (module: Module) => void
  onChapterSelect?: (chapter: Chapter, module: Module) => void
  onAddModule?: () => void
  onAddChapter?: (moduleId: string) => void
  onEditModule?: (module: Module) => void
  onEditChapter?: (chapter: Chapter, module: Module) => void
  onDeleteModule?: (module: Module) => void
  onDeleteChapter?: (chapter: Chapter, module: Module) => void
  selectedModuleId?: string | null
  selectedChapterId?: string | null
}

const getContentTypeIcon = (type: ChapterContentType) => {
  switch (type) {
    case "video":
      return FileVideo
    case "text":
      return FileText
    case "quiz":
      return HelpCircle
    case "assignment":
      return FileText
    case "resource":
      return FileDown
    default:
      return BookOpen
  }
}

export function CourseStructureTree({
  course,
  onModuleSelect,
  onChapterSelect,
  onAddModule,
  onAddChapter,
  onEditModule,
  onEditChapter,
  onDeleteModule,
  onDeleteChapter,
  selectedModuleId,
  selectedChapterId,
}: CourseStructureTreeProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(course.modules?.map(m => m.id) || [])
  )

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const handleModuleClick = (module: Module) => {
    onModuleSelect?.(module)
    toggleModule(module.id)
  }

  const handleChapterClick = (chapter: Chapter, module: Module) => {
    onChapterSelect?.(chapter, module)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-sm font-semibold">Course Structure</h2>
        {onAddModule && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddModule}
            className="h-7 text-xs cursor-pointer"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Module
          </Button>
        )}
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {course.modules && course.modules.length > 0 ? (
          course.modules
            .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
            .map((module) => {
              const isExpanded = expandedModules.has(module.id)
              const isSelected = selectedModuleId === module.id
              const chapters = module.chapters?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || []

              return (
                <div
                  key={module.id}
                  className={`border rounded-lg overflow-hidden ${
                    isSelected ? "border-primary shadow-sm" : "border-border"
                  }`}
                >
                  {/* Module Header */}
                  <div
                    className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                      isSelected ? "bg-primary/5" : ""
                    }`}
                    onClick={() => handleModuleClick(module)}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleModule(module.id)
                        }}
                        className="p-0.5 hover:bg-muted rounded"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium truncate">{module.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
                          </Badge>
                          {module.is_preview && (
                            <Badge variant="secondary" className="text-xs">Preview</Badge>
                          )}
                        </div>
                        {module.description && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {module.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {onAddChapter && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onAddChapter(module.id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                        {onEditModule && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onEditModule(module)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        {onDeleteModule && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => onDeleteModule(module)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chapters List */}
                  {isExpanded && chapters.length > 0 && (
                    <div className="border-t bg-muted/30">
                      {chapters.map((chapter) => {
                        const isChapterSelected = selectedChapterId === chapter.id
                        const IconComponent = getContentTypeIcon(chapter.content_type)

                        return (
                          <div
                            key={chapter.id}
                            className={`px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors border-l-2 ${
                              isChapterSelected
                                ? "border-l-primary bg-primary/5"
                                : "border-l-transparent"
                            }`}
                            onClick={() => handleChapterClick(chapter, module)}
                          >
                            <div className="flex items-center gap-2 ml-6">
                              <GripVertical className="h-3 w-3 text-muted-foreground cursor-grab" />
                              <IconComponent className="h-3 w-3 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium truncate">{chapter.title}</span>
                                  {chapter.is_preview && (
                                    <Badge variant="secondary" className="text-xs">Preview</Badge>
                                  )}
                                  {chapter.duration && (
                                    <span className="text-xs text-muted-foreground">{chapter.duration}</span>
                                  )}
                                </div>
                                {chapter.description && (
                                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                                    {chapter.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                {onEditChapter && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => onEditChapter(chapter, module)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                )}
                                {onDeleteChapter && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={() => onDeleteChapter(chapter, module)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {onAddChapter && (
                        <div className="px-3 py-2 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onAddChapter(module.id)}
                            className="w-full justify-start h-7 text-xs cursor-pointer"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Chapter
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Empty state for modules with no chapters */}
                  {isExpanded && chapters.length === 0 && (
                    <div className="border-t bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground text-center mb-2">No chapters yet</p>
                      {onAddChapter && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddChapter(module.id)}
                          className="w-full h-7 text-xs cursor-pointer"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add First Chapter
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )
            })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm mb-2">No modules added yet</p>
            {onAddModule && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAddModule}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Module
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

