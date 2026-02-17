"use client"

import Image from "next/image"
import { Course, CourseModule } from "@/types/courses"
import { Book, FileText, CheckCircle2, Clock, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface CourseSidebarProps {
  course: Course
  selectedModuleId: string | null
  onModuleSelect: (moduleId: string) => void
}

export function CourseSidebar({
  course,
  selectedModuleId,
  onModuleSelect,
}: CourseSidebarProps) {
  const modules = course.modules || []

  const totalDuration = modules.reduce((acc, module) => {
    return acc + (module.duration_minutes || 0)
  }, 0)

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins} min`
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    return `${hours}h ${mins}m`
  }

  const progress = 0

  const getModuleIcon = (module: CourseModule) => {
    const contentType = module.content_type || 'video'
    switch (contentType) {
      case 'video':
        return <PlayCircle className="h-4 w-4" />
      case 'text':
        return <FileText className="h-4 w-4" />
      case 'quiz':
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <PlayCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-background">
        <h2 className="text-lg font-semibold mb-4 line-clamp-2">{course.title}</h2>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span>{modules.length} modules</span>
          </div>
          {totalDuration > 0 && (
            <>
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(totalDuration)}</span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-1">
          {modules.map((module, index) => {
            const isSelected = module.id === selectedModuleId

            return (
              <button
                key={module.id}
                onClick={() => onModuleSelect(module.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                  "hover:bg-muted/50",
                  isSelected && "bg-primary/10 text-primary border border-primary/20"
                )}
              >
                <div className={cn(
                  "relative w-20 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted",
                  isSelected && "ring-2 ring-primary"
                )}>
                  {(module.thumbnail || course.thumbnail) ? (
                    <Image
                      src={module.thumbnail || course.thumbnail!}
                      alt={module.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-200 to-gray-300">
                      <PlayCircle className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <PlayCircle className="h-4 w-4 text-white drop-shadow" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "text-sm font-medium truncate",
                    isSelected && "text-primary"
                  )}>
                    {module.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    {getModuleIcon(module)}
                    {module.duration_minutes ? (
                      <span>{formatDuration(module.duration_minutes)}</span>
                    ) : (
                      <span>0 min</span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
