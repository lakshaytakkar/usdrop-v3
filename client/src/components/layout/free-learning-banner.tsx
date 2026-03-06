import { Link } from "wouter";
import { GraduationCap, ArrowRight, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/onboarding-context";

export function FreeLearningBanner() {
  const {
    isFree,
    isAdmin,
    hasCompletedFreeLearning: isFreeLearningComplete,
    freeLearningCompletedLessons: completedLessons,
    freeLearningTotalLessons: totalLessons,
    isLoading,
  } = useOnboarding();

  if (isLoading) return null;
  if (!isFree || isAdmin) return null;

  if (isFreeLearningComplete) {
    return (
      <div
        className="w-full px-4 py-2.5 flex items-center justify-center gap-3 flex-wrap"
        style={{ background: "linear-gradient(90deg, #16a34a, #15803d)" }}
        data-testid="banner-free-learning-complete"
      >
        <PartyPopper className="h-4 w-4 text-white shrink-0" />
        <span className="text-sm font-medium text-white text-center" data-testid="text-banner-complete-message">
          Congratulations! You've completed all lessons. Your POC will reach out soon to unlock full access.
        </span>
      </div>
    );
  }

  return (
    <div
      className="w-full px-4 py-2.5 flex items-center justify-center gap-3 flex-wrap"
      style={{ background: "linear-gradient(90deg, #d97706, #b45309)" }}
      data-testid="banner-free-learning-progress"
    >
      <GraduationCap className="h-4 w-4 text-white shrink-0" />
      <span className="text-sm font-medium text-white text-center" data-testid="text-banner-progress-message">
        Complete all Free Learning videos to unlock full platform access
      </span>
      <span className="text-xs text-white/80 font-medium" data-testid="text-banner-lesson-count">
        {completedLessons} of {totalLessons} lessons completed
      </span>
      <Link href="/free-learning">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs font-medium border-white/30 text-white bg-white/10 backdrop-blur-sm"
          data-testid="button-banner-go-to-learning"
        >
          Go to Free Learning
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </Link>
    </div>
  );
}
