
import { Course, CourseModule } from "@/types/courses"
import { Book, FileText, CheckCircle2, Clock, PlayCircle, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/supabase"

interface CourseSidebarProps {
  course: Course
  selectedModuleId: string | null
  onModuleSelect: (moduleId: string, courseId?: string) => void
}

export function CourseSidebar({
  course,
  selectedModuleId,
  onModuleSelect,
}: CourseSidebarProps) {
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set([course.id]))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllCourses() {
      try {
        const res = await apiFetch("/api/courses?pageSize=100")
        if (res.ok) {
          const data = await res.json()
          setAllCourses(data.courses || [])
        }
      } catch {
        setAllCourses([course])
      } finally {
        setLoading(false)
      }
    }
    fetchAllCourses()
  }, [course])

  useEffect(() => {
    setExpandedCourses(prev => {
      const next = new Set(prev)
      next.add(course.id)
      return next
    })
  }, [course.id])

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => {
      const next = new Set(prev)
      if (next.has(courseId)) {
        next.delete(courseId)
      } else {
        next.add(courseId)
      }
      return next
    })
  }

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins} min`
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    return `${hours}h ${mins}m`
  }

  const getModuleIcon = (module: CourseModule) => {
    const contentType = module.content_type || 'video'
    switch (contentType) {
      case 'video':
        return <PlayCircle className="h-3.5 w-3.5" />
      case 'text':
        return <FileText className="h-3.5 w-3.5" />
      case 'quiz':
        return <CheckCircle2 className="h-3.5 w-3.5" />
      default:
        return <PlayCircle className="h-3.5 w-3.5" />
    }
  }

  const coursesToDisplay = loading ? [course] : allCourses.length > 0 ? allCourses : [course]

  return (
    <div className="flex flex-col h-full" data-testid="course-sidebar">
      <div className="px-3 py-2.5 border-b bg-background">
        <h2 className="text-sm font-semibold line-clamp-1">{course.title}</h2>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          <div className="flex items-center gap-1">
            <Book className="h-3 w-3" />
            <span>{coursesToDisplay.length} courses</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-1.5 space-y-0.5">
          {coursesToDisplay.map((c) => {
            const isExpanded = expandedCourses.has(c.id)
            const isCurrentCourse = c.id === course.id
            const modules = c.modules || []

            return (
              <div key={c.id}>
                <button
                  onClick={() => toggleCourse(c.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2 rounded-md text-left transition-colors",
                    "hover:bg-muted/50",
                    isCurrentCourse && "bg-muted/30"
                  )}
                  data-testid={`course-toggle-${c.id}`}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "text-xs font-semibold truncate",
                      isCurrentCourse && "text-primary"
                    )}>
                      {c.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {modules.length} module{modules.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </button>

                {isExpanded && modules.length > 0 && (
                  <div className="ml-3 pl-2 border-l border-muted space-y-0.5 mt-0.5 mb-1">
                    {modules.map((module, index) => {
                      const isSelected = isCurrentCourse && module.id === selectedModuleId

                      return (
                        <button
                          key={module.id}
                          onClick={() => onModuleSelect(module.id, isCurrentCourse ? undefined : c.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors",
                            "hover:bg-muted/50",
                            isSelected && "bg-primary/10 text-primary border border-primary/20"
                          )}
                          data-testid={`module-select-${module.id}`}
                        >
                          <div className="flex-shrink-0 w-4 text-center">
                            <span className={cn("text-[10px] font-medium", isSelected ? "text-primary" : "text-muted-foreground")}>{index + 1}</span>
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
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
