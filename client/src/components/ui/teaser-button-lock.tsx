import { Lock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"
import { useOnboarding } from "@/contexts/onboarding-context"
import { cn } from "@/lib/utils"

interface TeaserButtonLockProps {
  children: React.ReactNode
  locked?: boolean
  message?: string
  className?: string
}

export function TeaserButtonLock({
  children,
  locked,
  message = "Complete Free Learning to unlock",
  className,
}: TeaserButtonLockProps) {
  const { isFree, hasCompletedFreeLearning } = useOnboarding()

  const isLocked = locked !== undefined ? locked : (isFree && !hasCompletedFreeLearning)

  if (!isLocked) {
    return <>{children}</>
  }

  return (
    <div className={cn("relative inline-flex group", className)} data-testid="teaser-button-lock">
      <div className="pointer-events-none opacity-40 select-none blur-[1px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Link href="/free-learning">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs font-medium border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 shadow-sm cursor-pointer"
            data-testid="button-teaser-unlock"
          >
            <Lock className="size-3" />
            <span className="hidden sm:inline">{message}</span>
            <span className="sm:hidden">Unlock</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}

interface TeaserActionGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function TeaserActionGuard({ children, fallback }: TeaserActionGuardProps) {
  const { isFree, hasCompletedFreeLearning } = useOnboarding()
  const isLocked = isFree && !hasCompletedFreeLearning

  if (!isLocked) return <>{children}</>

  if (fallback) return <>{fallback}</>

  return (
    <Link href="/free-learning">
      <Button
        variant="outline"
        className="gap-2 border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer"
        data-testid="button-teaser-guard"
      >
        <BookOpen className="size-4" />
        Complete Free Learning to unlock
      </Button>
    </Link>
  )
}
