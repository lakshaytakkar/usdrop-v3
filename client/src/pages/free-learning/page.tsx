import { useState } from "react"
import { Link } from "wouter"
import { Play, Clock, Users, Star, ChevronDown, ChevronRight, BookOpen, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { FrameworkBanner } from "@/components/framework-banner"
import { freeLearningCourse, freeLearningModules, getTotalLessons, isAllCompleted, getCompletionCount } from "./data"
import type { FreeLearningModule } from "./data"
import { MentorshipActivationModal } from "./components/mentorship-activation-modal"

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
  const allCompleted = isAllCompleted()
  const completedCount = getCompletionCount()
  const [showActivation, setShowActivation] = useState(false)

  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2">
      <FrameworkBanner
        title="Free Learning"
        description="Master the fundamentals of USA dropshipping — from product research to Shopify setup to running your first ads. Free for everyone."
        iconSrc="/images/banners/3d-learning.png"
        tutorialVideoUrl=""
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900" data-testid="text-course-content">
            Course Content
          </h2>
          {allCompleted ? (
            <button
              onClick={() => setShowActivation(true)}
              data-testid="button-activate-mentorship"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium text-xs transition-all cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              Activate Mentorship
            </button>
          ) : firstLessonId ? (
            <Link
              href={`/free-learning/${firstLessonId}`}
              data-testid="button-start-course"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs transition-colors"
            >
              <Play className="h-3 w-3" />
              {completedCount > 0 ? "Continue Course" : "Start Course"}
            </Link>
          ) : null}
        </div>
        <span className="text-sm text-gray-400 font-medium">
          {completedCount > 0 && !allCompleted && (
            <span className="text-blue-500 mr-2">{completedCount}/{totalLessons} completed</span>
          )}
          {allCompleted && (
            <span className="text-green-500 mr-2">All completed</span>
          )}
          {freeLearningModules.length} modules · {totalLessons} lessons
        </span>
      </div>

      <div className="space-y-2.5">
        {freeLearningModules.map((module, idx) => (
          <ModuleAccordion key={module.id} module={module} defaultOpen={idx === 0} />
        ))}
      </div>

      {allCompleted ? (
        <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 md:p-8 text-center mt-4 mb-4" data-testid="banner-cta-mentorship">
          <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">You've completed the course!</h3>
          <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
            You're now eligible for personalized mentorship. Apply now to get matched with an expert mentor.
          </p>
          <button
            onClick={() => setShowActivation(true)}
            data-testid="button-activate-mentorship-bottom"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold text-sm transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            Activate Mentorship
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 md:p-8 text-center mt-4 mb-4" data-testid="banner-cta-mentorship">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for the next level?</h3>
          <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
            Complete all lessons to unlock your personalized mentorship program with expert guidance.
          </p>
          {firstLessonId && (
            <Link
              href={`/free-learning/${firstLessonId}`}
              data-testid="link-get-started"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold text-sm transition-all"
            >
              {completedCount > 0 ? "Continue Learning" : "Get Started Free"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      <MentorshipActivationModal open={showActivation} onOpenChange={setShowActivation} />
    </div>
  )
}
