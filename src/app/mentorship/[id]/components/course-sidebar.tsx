"use client"

import { Course, CourseModule, CourseChapter } from "@/types/courses"
// ScrollArea not available, using div with overflow
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Book, FileText, CheckCircle2, Clock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface CourseSidebarProps {
  course: Course
  selectedModuleId: string | null
  selectedChapterId: string | null
  onChapterSelect: (moduleId: string, chapterId: string) => void
}

export function CourseSidebar({
  course,
  selectedModuleId,
  selectedChapterId,
  onChapterSelect,
}: CourseSidebarProps) {
  // Calculate total lectures and duration
  const totalLectures = course.modules?.reduce((acc, module) => {
    return acc + (module.chapters?.length || 0)
  }, 0) || 0

  const totalDuration = course.modules?.reduce((acc, module) => {
    const moduleDuration = module.chapters?.reduce((chAcc, chapter) => {
      return chAcc + (chapter.duration_minutes || 0)
    }, 0) || 0
    return acc + moduleDuration
  }, 0) || 0

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins} min`
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    return `${hours}h ${mins}m`
  }

  // Calculate progress (placeholder - would come from enrollment data)
  const progress = 0 // TODO: Get from enrollment progress

  const getChapterIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <Book className="h-4 w-4" />
      case 'text':
        return <FileText className="h-4 w-4" />
      case 'quiz':
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <Book className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Course Header */}
      <div className="p-6 border-b bg-background">
        <h2 className="text-lg font-semibold mb-4 line-clamp-2">{course.title}</h2>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span>{totalLectures} lectures</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground" />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(totalDuration)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Modules and Chapters List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <Accordion
            type="multiple"
            defaultValue={selectedModuleId ? [selectedModuleId] : []}
            className="w-full"
          >
            {course.modules?.map((module) => {
              const moduleChapters = module.chapters || []
              const moduleDuration = moduleChapters.reduce((acc, ch) => acc + (ch.duration_minutes || 0), 0)

              return (
                <AccordionItem key={module.id} value={module.id} className="border-none">
                  <AccordionTrigger className="py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="text-left">
                        <div className="font-medium text-sm">{module.title}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{moduleChapters.length} lectures</span>
                          <span>•</span>
                          <span>{formatDuration(moduleDuration)}</span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1 pt-2">
                      {moduleChapters.map((chapter) => {
                        const isSelected = chapter.id === selectedChapterId
                        const isCurrentModule = module.id === selectedModuleId

                        return (
                          <button
                            key={chapter.id}
                            onClick={() => onChapterSelect(module.id, chapter.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
                              "hover:bg-muted/50",
                              isSelected && isCurrentModule && "bg-primary/10 text-primary"
                            )}
                          >
                            <div className={cn(
                              "flex-shrink-0",
                              isSelected && isCurrentModule && "text-primary"
                            )}>
                              {getChapterIcon(chapter.content_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={cn(
                                "text-sm font-medium truncate",
                                isSelected && isCurrentModule && "text-primary"
                              )}>
                                {chapter.title}
                              </div>
                              {chapter.duration_minutes && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDuration(chapter.duration_minutes)}</span>
                                </div>
                              )}
                            </div>
                            {isSelected && isCurrentModule && (
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </div>
  )
}

