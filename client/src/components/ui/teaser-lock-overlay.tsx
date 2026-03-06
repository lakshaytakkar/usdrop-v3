import { Lock, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useOnboarding } from "@/contexts/onboarding-context";

interface TeaserLockOverlayProps {
  message?: string;
  ctaText?: string;
  onUpgrade?: () => void;
  className?: string;
}

export function TeaserLockOverlay({
  message = "Complete all Free Learning videos to unlock this content",
  ctaText = "Continue Learning",
  onUpgrade,
  className,
}: TeaserLockOverlayProps) {
  const { freeLearningCompletedLessons: completed, freeLearningTotalLessons: total, freeLearningProgress } = useOnboarding();

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 py-10 px-6",
        "bg-gradient-to-t from-background via-background/60 to-transparent",
        className
      )}
      data-testid="teaser-lock-overlay"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100">
        <BookOpen className="size-3.5 text-amber-600" />
        <span className="text-[11px] font-semibold text-amber-700">
          {completed}/{total} lessons completed
        </span>
        <span className="text-[11px] font-bold text-amber-600">{freeLearningProgress}%</span>
      </div>

      <p className="text-center text-sm text-muted-foreground max-w-sm">
        {message}
      </p>

      {onUpgrade ? (
        <Button onClick={onUpgrade} size="sm" data-testid="button-learning-teaser" className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg cursor-pointer">
          {ctaText}
          <ArrowRight className="size-3.5 ml-1.5" />
        </Button>
      ) : (
        <Link href="/free-learning">
          <Button size="sm" data-testid="button-learning-teaser-link" className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg cursor-pointer">
            {ctaText}
            <ArrowRight className="size-3.5 ml-1.5" />
          </Button>
        </Link>
      )}
    </div>
  );
}

interface TeaserItemOverlayProps {
  children: React.ReactNode;
  locked?: boolean;
}

export function TeaserItemOverlay({ children, locked = false }: TeaserItemOverlayProps) {
  if (!locked) return <>{children}</>;

  return (
    <div className="relative group" data-testid="teaser-item-locked">
      <div className="pointer-events-none opacity-50" style={{ filter: "blur(2px)" }}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm border border-gray-200">
          <Lock className="size-3" />
          Complete lessons to unlock
        </div>
      </div>
    </div>
  );
}
