import { useState } from "react"
import { Link } from "wouter"
import { Play, Clock, Users, Star, ChevronDown, ChevronRight, BookOpen, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { freeLearningCourse, freeLearningModules, getTotalLessons } from "./data"
import type { FreeLearningModule } from "./data"

function ModuleAccordion({ module, defaultOpen }: { module: FreeLearningModule; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false)

  return (
    <div className="border border-black/[0.06] rounded-xl overflow-hidden bg-white" data-testid={`module-${module.id}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
        data-testid={`button-toggle-module-${module.id}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors",
            isOpen ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
          )}>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
          <span className="text-[15px] font-semibold text-left truncate">{module.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="text-xs text-gray-400 font-medium">{module.lessons.length} Lesson{module.lessons.length !== 1 ? "s" : ""}</span>
          {module.totalDuration && (
            <>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400 font-medium">{module.totalDuration}</span>
            </>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-black/[0.04]">
          {module.lessons.map((lesson, idx) => (
            <Link
              key={lesson.id}
              href={`/free-learning/${lesson.id}`}
              data-testid={`link-lesson-${lesson.id}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50/50 transition-colors group border-b border-black/[0.03] last:border-b-0"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-500 shrink-0 group-hover:bg-blue-100 transition-colors">
                <Play className="h-3 w-3 ml-0.5" />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors flex-1 min-w-0 truncate">
                {lesson.title}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {lesson.duration && (
                  <span className="text-xs text-gray-400">{lesson.duration}</span>
                )}
                <span className="text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Watch
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FreeLearningPage() {
  const totalLessons = getTotalLessons()
  const firstLessonId = freeLearningModules[0]?.lessons[0]?.id

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 md:p-10 text-white mb-8" data-testid="banner-free-learning">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Free Course</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{freeLearningCourse.title}</h1>
              <p className="text-gray-300 text-sm mb-4">{freeLearningCourse.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-3.5 w-3.5",
                          star <= Math.round(freeLearningCourse.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-500"
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-white">{freeLearningCourse.rating}</span>
                  <span className="text-gray-400">({freeLearningCourse.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>{freeLearningCourse.memberCount.toLocaleString()} members</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{freeLearningCourse.completionTime}</span>
                </div>
              </div>
            </div>

            {firstLessonId && (
              <Link
                href={`/free-learning/${firstLessonId}`}
                data-testid="button-start-course"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors shrink-0"
              >
                <Play className="h-4 w-4" />
                Start Course
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900" data-testid="text-course-content">
            Course Content
          </h2>
          <span className="text-sm text-gray-400 font-medium">
            {freeLearningModules.length} modules · {totalLessons} lessons
          </span>
        </div>

        <div className="space-y-2.5">
          {freeLearningModules.map((module, idx) => (
            <ModuleAccordion key={module.id} module={module} defaultOpen={idx === 0} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 md:p-8 text-center" data-testid="banner-cta-mentorship">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for the next level?</h3>
          <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
            Unlock personalized mentorship, advanced strategies, and full platform access with USDrop Pro.
          </p>
          <Link
            href="/signup"
            data-testid="link-get-started"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold text-sm transition-all"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
