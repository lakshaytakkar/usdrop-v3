import { BookOpen, ArrowRight, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"
import { useOnboarding } from "@/contexts/onboarding-context"
import { motion } from "motion/react"

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative mt-2 rounded-xl border border-gray-200 bg-white p-5"
      data-testid="free-learning-cutoff"
    >
      <div className="flex items-center gap-4">
        <div className="shrink-0 flex size-10 items-center justify-center rounded-lg bg-amber-50 border border-amber-100">
          <Eye className="size-4.5 text-amber-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-900" data-testid="text-cutoff-title">
            You're previewing {itemCount} {contentType}
          </p>
          <p className="text-[12px] text-gray-400 mt-0.5" data-testid="text-cutoff-description">
            Complete Free Learning to unlock everything on this page
          </p>
        </div>

        <div className="shrink-0 hidden sm:flex items-center gap-3">
          <div className="text-right mr-1">
            <div className="text-[11px] text-gray-400">{completedLessons}/{totalLessons} lessons</div>
            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1" data-testid="progress-cutoff-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${freeLearningProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>

          <Link href="/free-learning">
            <Button
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg cursor-pointer"
              data-testid="button-cutoff-learning"
            >
              Continue
              <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="shrink-0 sm:hidden">
          <Link href="/free-learning">
            <Button
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg cursor-pointer"
              data-testid="button-cutoff-learning-mobile"
            >
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
