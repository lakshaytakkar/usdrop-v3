


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
      <div className="px-3 py-2.5 border-b bg-background">
        <h2 className="text-sm font-semibold line-clamp-1">{course.title}</h2>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          <div className="flex items-center gap-1">
            <Book className="h-3 w-3" />
            <span>{modules.length} modules</span>
          </div>
          {totalDuration > 0 && (
            <>
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(totalDuration)}</span>
              </div>
            </>
          )}
          <div className="ml-auto text-xs font-medium">{Math.round(progress)}%</div>
        </div>
        <Progress value={progress} className="h-1 mt-1.5" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-1.5 space-y-0.5">
          {modules.map((module, index) => {
            const isSelected = module.id === selectedModuleId

            return (
              <button
                key={module.id}
                onClick={() => onModuleSelect(module.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors",
                  "hover:bg-muted/50",
                  isSelected && "bg-primary/10 text-primary border border-primary/20"
                )}
              >
                <div className="flex-shrink-0 w-5 text-center">
                  <span className={cn("text-xs font-medium", isSelected ? "text-primary" : "text-muted-foreground")}>{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "text-xs font-medium truncate",
                    isSelected && "text-primary"
                  )}>
                    {module.title}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    {getModuleIcon(module)}
                    {module.duration_minutes ? (
                      <span>{formatDuration(module.duration_minutes)}</span>
                    ) : (
                      <span>0 min</span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
