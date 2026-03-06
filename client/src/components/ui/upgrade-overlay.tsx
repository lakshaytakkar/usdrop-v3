import { motion } from "motion/react"
import { Lock, BookOpen, ArrowRight, Eye } from "lucide-react"
import { useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { DURATION, EASING } from "@/lib/motion"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Link } from "wouter"

interface UpgradeOverlayProps {
  featureName: string
  featureDescription: string
  children?: React.ReactNode
}

export function UpgradeOverlay({
  featureName,
  featureDescription,
  children,
}: UpgradeOverlayProps) {
  const router = useRouter()
  const { isFree, hasCompletedFreeLearning: isFreeLearningComplete, freeLearningProgress, freeLearningCompletedLessons: completedLessons, freeLearningTotalLessons: totalLessons } = useOnboarding()

  const showLearningMessage = isFree && !isFreeLearningComplete

  return (
    <div className="relative w-full min-h-[60vh]">
      {children && (
        <div
          className="pointer-events-none select-none"
          style={{ filter: "blur(3px)", opacity: 0.7 }}
          aria-hidden="true"
        >
          {children}
        </div>
      )}

      <div className="absolute inset-0 z-40 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: DURATION.slow,
          ease: [...EASING.easeOut],
        }}
        className="absolute inset-x-0 bottom-0 z-50 flex justify-center pb-12 pointer-events-none"
        style={{ top: "min(40%, 280px)" }}
      >
        <div className="pointer-events-auto w-full max-w-lg mx-4">
          <div className="rounded-2xl border border-gray-200/80 bg-white/95 backdrop-blur-sm shadow-xl shadow-black/5 p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 border border-amber-100">
                <Eye className="w-5 h-5 text-amber-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600" data-testid="text-overlay-label">
                    Preview Mode
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1" data-testid="text-overlay-title">
                  {featureName}
                </h3>

                <p className="text-[13px] text-gray-500 leading-relaxed mb-4" data-testid="text-overlay-description">
                  {showLearningMessage
                    ? "You're previewing this feature. Complete Free Learning to unlock full access and start using it."
                    : featureDescription}
                </p>

                {showLearningMessage && (
                  <div className="mb-4">
                    <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                      <span>{completedLessons} of {totalLessons} lessons done</span>
                      <span className="font-semibold text-amber-600">{freeLearningProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden" data-testid="progress-overlay-bar">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${freeLearningProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        className="h-full bg-amber-500 rounded-full"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Link href={showLearningMessage ? "/free-learning" : "/framework"}>
                    <Button
                      className="bg-gray-900 text-white hover:bg-gray-800 rounded-lg px-5 h-9 text-[13px] font-medium cursor-pointer"
                      data-testid="button-overlay-action"
                    >
                      <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                      {showLearningMessage ? "Continue Learning" : "Contact Your POC"}
                    </Button>
                  </Link>

                  <button
                    onClick={() => router.back()}
                    className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    data-testid="button-overlay-back"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-[11px] text-gray-400">
              <Lock className="w-3 h-3 inline mr-1 -mt-0.5" />
              Full access unlocks after completing all lessons
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
