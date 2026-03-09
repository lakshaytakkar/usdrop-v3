import { useState } from "react"
import { Link } from "wouter"
import { Play, ChevronDown, ChevronRight, ArrowRight, GraduationCap, Check, BookOpen, Video, Layers, BadgeCheck, Clock, ExternalLink, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getYouTubeThumbnail, getCompletedLessons, getCompletionCount, isAllCompleted } from "./data"
import type { FreeLearningModule, FreeLearningLesson } from "./data"
import { useFreeLearningModules } from "./use-free-learning-modules"
import { MentorshipActivationModal } from "./components/mentorship-activation-modal"

function LessonCard({ lesson, index, moduleIndex, completedIds }: { lesson: FreeLearningLesson; index: number; moduleIndex: number; completedIds: string[] }) {
  const thumbnail = lesson.thumbnail || getYouTubeThumbnail(lesson.videoUrl)
  const [imgError, setImgError] = useState(false)
  const isCompleted = completedIds.includes(lesson.id)
  const lessonNumber = index + 1
  const isExternal = !lesson.videoUrl && lesson.externalUrl

  const content = (
    <div
      data-testid={`card-lesson-${lesson.id}`}
      className="flex bg-white border border-black/[0.06] rounded-xl overflow-hidden hover:shadow-sm transition-shadow group"
    >
      <div className="w-[200px] min-w-[200px] h-[120px] relative bg-gray-100 overflow-hidden shrink-0">
        {thumbnail && !imgError ? (
          <img
            src={thumbnail}
            alt={lesson.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
            data-testid={`img-lesson-${lesson.id}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            {isExternal ? (
              <ExternalLink className="h-8 w-8 text-white/40" />
            ) : (
              <Play className="h-8 w-8 text-white/40" />
            )}
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1" data-testid={`text-lesson-title-${lesson.id}`}>
            {lessonNumber}. {lesson.title}
          </h4>
          {lesson.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{lesson.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <span
              data-testid={`button-watch-${lesson.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
            >
              <Play className="h-3 w-3" />
              {isExternal ? "Open Resource" : "Watch Lesson"}
            </span>
            {lesson.duration && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                Duration: {lesson.duration}
              </span>
            )}
          </div>

          {lesson.tags && lesson.tags.length > 0 && (
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {lesson.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded border border-green-200 bg-green-50 text-green-700 text-[10px] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (isExternal) {
    return (
      <a href={lesson.externalUrl!} target="_blank" rel="noopener noreferrer" data-testid={`link-lesson-${lesson.id}`}>
        {content}
      </a>
    )
  }

  return (
    <Link href={`/free-learning/${lesson.id}`} data-testid={`link-lesson-${lesson.id}`}>
      {content}
    </Link>
  )
}

function ModuleAccordion({ module, moduleIndex, defaultOpen, completedIds }: { module: FreeLearningModule; moduleIndex: number; defaultOpen?: boolean; completedIds: string[] }) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false)

  return (
    <div className="rounded-xl overflow-hidden" data-testid={`module-${module.id}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-black/[0.06] rounded-xl hover:bg-gray-50/50 transition-colors cursor-pointer"
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
        <div className="space-y-3 pt-4 pl-5">
          {module.lessons.map((lesson, idx) => (
            <LessonCard key={lesson.id} lesson={lesson} index={idx} moduleIndex={moduleIndex} completedIds={completedIds} />
          ))}
        </div>
      )}
    </div>
  )
}

const mentorStats = [
  { icon: Video, label: "25 Video Lessons" },
  { icon: Layers, label: "6 Modules" },
  { icon: BookOpen, label: "Beginner Friendly" },
  { icon: BadgeCheck, label: "100% Free" },
]

const mentorCredentials = [
  "USA Dropshipping Expert",
  "100+ Students Mentored",
  "1-on-1 Guidance",
  "Proven Framework",
]

export default function FreeLearningPage() {
  const { modules, isLoading, totalLessons } = useFreeLearningModules()
  const firstLessonId = modules[0]?.lessons[0]?.id
  const allCompleted = isAllCompleted()
  const completedCount = getCompletionCount()
  const completedIds = getCompletedLessons()
  const [showActivation, setShowActivation] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-12 md:px-20 lg:px-32 py-6 md:py-8">
      <div
        className="relative overflow-hidden rounded-xl w-full"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
        data-testid="banner-free-learning-hero"
      >
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-[0.08] pointer-events-none"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)" }}
        />

        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:p-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/20 text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                <GraduationCap className="h-3 w-3" />
                Free Learning
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight" data-testid="text-hero-title">
              Learn USA Dropshipping<br className="hidden md:block" /> From Zero to Pro
            </h1>
            <p className="text-sm md:text-[15px] text-white/60 mb-5 max-w-lg leading-relaxed">
              Master the fundamentals of USA dropshipping — from product research to Shopify setup to running your first ads. Guided by an industry expert, completely free.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-6 max-w-sm">
              {mentorStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.08] shrink-0">
                    <stat.icon className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <span className="text-xs text-white/70 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {allCompleted ? (
              <button
                onClick={() => setShowActivation(true)}
                data-testid="button-activate-mentorship-hero"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors cursor-pointer shadow-lg shadow-black/20"
              >
                Activate Mentorship
              </button>
            ) : firstLessonId ? (
              <Link
                href={`/free-learning/${firstLessonId}`}
                data-testid="button-start-course-hero"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-white/90 text-sm font-semibold transition-all shadow-lg shadow-black/20"
              >
                <Play className="h-4 w-4" />
                {completedCount > 0 ? "Continue Learning" : "Start Learning"}
              </Link>
            ) : null}
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl bg-white mb-3">
              <img
                src="/images/mentor-suprans.png"
                alt="Mr. Suprans - Your Mentor"
                className="w-full h-full object-cover"
                data-testid="img-mentor-photo"
              />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <GraduationCap className="h-3 w-3 text-blue-300" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-blue-300">Your Mentor</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2.5">Mr. Suprans</h3>
            <ul className="space-y-1.5">
              {mentorCredentials.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 shrink-0">
                    <Check className="h-2.5 w-2.5 text-emerald-400" />
                  </span>
                  <span className="text-[12px] text-white/60">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900" data-testid="text-course-content">
            Learning Content
          </h2>
          {allCompleted ? (
            <button
              onClick={() => setShowActivation(true)}
              data-testid="button-activate-mentorship"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Activate Mentorship
            </button>
          ) : firstLessonId ? (
            <Link
              href={`/free-learning/${firstLessonId}`}
              data-testid="button-start-course"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs transition-colors"
            >
              <Play className="h-3 w-3" />
              {completedCount > 0 ? "Continue Learning" : "Start Learning"}
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
          {modules.length} modules · {totalLessons} lessons
        </span>
      </div>

      <div className="space-y-4">
        {modules.map((module, idx) => (
          <ModuleAccordion key={module.id} module={module} moduleIndex={idx} defaultOpen={idx === 0} completedIds={completedIds} />
        ))}
      </div>

      {allCompleted ? (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 md:p-8 text-center" data-testid="banner-cta-mentorship">
          <GraduationCap className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">You've completed all the lessons!</h3>
          <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
            You're now eligible for personalized mentorship. Apply now to get matched with an expert mentor.
          </p>
          <button
            onClick={() => setShowActivation(true)}
            data-testid="button-activate-mentorship-bottom"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Activate Mentorship
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 md:p-8 text-center" data-testid="banner-cta-mentorship">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for the next level?</h3>
          <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
            Complete all lessons to unlock your personalized mentorship program with expert guidance.
          </p>
          {firstLessonId && (
            <Link
              href={`/free-learning/${firstLessonId}`}
              data-testid="link-get-started"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors"
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
