import { BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"
import { useOnboarding } from "@/contexts/onboarding-context"

interface FreeLearningCutoffProps {
  itemCount?: number
  contentType?: string
}

export function FreeLearningCutoff({
  itemCount = 3,
  contentType = "items",
}: FreeLearningCutoffProps) {
  const { freeLearningCompletedLessons: completedLessons, freeLearningTotalLessons: totalLessons, freeLearningProgress } = useOnboarding()

  return (
    <div
      className="relative mt-4 rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50/80 to-white p-8 text-center"
      data-testid="free-learning-cutoff"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-amber-100">
          <BookOpen className="size-6 text-amber-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1" data-testid="text-cutoff-title">
            Complete Free Learning to see more
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto" data-testid="text-cutoff-description">
            You're viewing the first {itemCount} {contentType}. Complete all Free Learning
            videos to unlock full access to this page.
          </p>
        </div>

        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{completedLessons} of {totalLessons} lessons</span>
            <span>{freeLearningProgress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden" data-testid="progress-cutoff-bar">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${freeLearningProgress}%` }}
            />
          </div>
        </div>

        <Link href="/free-learning">
          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
            data-testid="button-cutoff-learning"
          >
            Go to Free Learning
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
