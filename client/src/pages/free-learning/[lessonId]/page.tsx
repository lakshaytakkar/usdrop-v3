import { useState, useMemo } from "react"
import { Link } from "wouter"
import { useParams } from "@/hooks/use-router"
import { ArrowLeft, ArrowRight, Play, CheckCircle2, ChevronDown, ChevronRight, Clock, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { freeLearningModules, freeLearningCourse, findLesson, getNextLesson, getPrevLesson } from "../data"

function Sidebar({
  currentLessonId,
}: {
  currentLessonId: string
}) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const result = findLesson(currentLessonId)
    if (result) {
      return { [result.module.id]: true }
    }
    return {}
  })

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }))
  }

  const allLessons = freeLearningModules.flatMap(m => m.lessons)
  const currentIdx = allLessons.findIndex(l => l.id === currentLessonId)

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 truncate">{freeLearningCourse.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">{currentIdx + 1} / {allLessons.length} lessons</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {freeLearningModules.map((module) => {
          const isExpanded = expandedModules[module.id] ?? false

          return (
            <div key={module.id} className="border-b border-gray-50 last:border-b-0">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                data-testid={`button-sidebar-module-${module.id}`}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                )}
                <span className="text-xs font-semibold text-gray-700 truncate flex-1">{module.title}</span>
                <span className="text-[10px] text-gray-400 shrink-0">{module.lessons.length}</span>
              </button>

              {isExpanded && (
                <div className="pb-1">
                  {module.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLessonId
                    return (
                      <Link
                        key={lesson.id}
                        href={`/free-learning/${lesson.id}`}
                        data-testid={`link-sidebar-lesson-${lesson.id}`}
                        className={cn(
                          "flex items-center gap-2.5 pl-9 pr-4 py-2 text-xs transition-colors",
                          isActive
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <PlayCircle className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-blue-500" : "text-gray-400")} />
                        <span className="truncate flex-1">{lesson.title}</span>
                        {lesson.duration && (
                          <span className={cn("text-[10px] shrink-0", isActive ? "text-blue-400" : "text-gray-400")}>{lesson.duration}</span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function FreeLearningLessonPage() {
  const params = useParams()
  const lessonId = params.lessonId as string

  const result = useMemo(() => findLesson(lessonId), [lessonId])
  const nextLesson = useMemo(() => getNextLesson(lessonId), [lessonId])
  const prevLesson = useMemo(() => getPrevLesson(lessonId), [lessonId])

  if (!result) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Lesson not found</h1>
          <p className="text-gray-500 mb-4">This lesson doesn't exist or has been removed.</p>
          <Link href="/free-learning" className="text-blue-500 hover:text-blue-600 font-medium text-sm">
            Back to course
          </Link>
        </div>
      </div>
    )
  }

  const { lesson, module } = result

  const hasVideo = !!lesson.videoUrl
  const isYouTube = lesson.videoUrl?.includes("youtube") || lesson.videoUrl?.includes("youtu.be") || lesson.videoUrl?.includes("youtube-nocookie")

  const allLessons = freeLearningModules.flatMap(m => m.lessons)
  const currentIdx = allLessons.findIndex(l => l.id === lessonId)

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-5.5rem)] overflow-hidden px-4 md:px-8 lg:px-12">
      <div className="flex items-center justify-between py-2 border-b bg-background">
        <Link
          href="/free-learning"
          data-testid="link-back-to-course"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Close
        </Link>
        <div className="text-sm text-muted-foreground">
          Lesson {currentIdx + 1} of {allLessons.length}
        </div>
        <div className="flex items-center gap-1">
          {prevLesson ? (
            <Link
              href={`/free-learning/${prevLesson.id}`}
              data-testid="button-prev-lesson"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Prev
            </Link>
          ) : (
            <span className="text-sm text-gray-300">Prev</span>
          )}
          <span className="text-gray-300 mx-1">|</span>
          {nextLesson ? (
            <Link
              href={`/free-learning/${nextLesson.id}`}
              data-testid="button-next-lesson"
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Next Lesson
            </Link>
          ) : (
            <span className="text-sm text-gray-300">Next Lesson</span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden rounded-xl border border-black/[0.04] bg-background mt-2 mb-4">
        <div className="w-full lg:w-[300px] border-r bg-background overflow-hidden flex-shrink-0">
          <Sidebar currentLessonId={lessonId} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-shrink-0">
            <div className="w-full bg-black" data-testid="video-player-area">
              {hasVideo ? (
                isYouTube ? (
                  <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                    <iframe
                      src={lesson.videoUrl!}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={lesson.title}
                    />
                  </div>
                ) : (
                  <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                    <video
                      src={lesson.videoUrl!}
                      className="absolute inset-0 w-full h-full"
                      controls
                      playsInline
                    />
                  </div>
                )
              ) : (
                <div className="relative w-full flex items-center justify-center" style={{ paddingTop: "56.25%" }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
                      <Play className="h-7 w-7 text-white/40 ml-1" />
                    </div>
                    <p className="text-sm font-medium">Video coming soon</p>
                    <p className="text-xs text-white/40 mt-1">Check back later for this lesson</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between px-6 md:px-8 py-2 border-t">
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold truncate" data-testid="text-lesson-title">{lesson.title}</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {lesson.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{lesson.duration}</span>
                  </div>
                )}
                <span>·</span>
                <span>{module.title}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-4">
            {nextLesson && (
              <Link
                href={`/free-learning/${nextLesson.id}`}
                data-testid="link-next-lesson-bottom"
                className="flex items-center gap-3 p-4 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                  <Play className="h-4 w-4 text-white ml-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-blue-500 font-semibold uppercase">Next Lesson</span>
                  <p className="text-sm font-medium text-gray-900 truncate">{nextLesson.title}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>
            )}

            {!nextLesson && (
              <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="text-base font-bold text-gray-900 mb-1">You've reached the end!</h3>
                <p className="text-sm text-gray-500 mb-4">Ready to take your dropshipping business to the next level?</p>
                <Link
                  href="/signup"
                  data-testid="link-signup-cta"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all"
                >
                  Join USDrop Pro
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
