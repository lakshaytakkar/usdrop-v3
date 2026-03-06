import { Lock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"
import { useOnboarding } from "@/contexts/onboarding-context"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("relative inline-flex", className)} data-testid="teaser-button-lock">
            <div className="pointer-events-none opacity-30 select-none grayscale">
              {children}
            </div>
            <Link href="/free-learning" className="absolute inset-0 flex items-center justify-center" data-testid="button-teaser-unlock">
              <Lock className="size-4 text-gray-500" />
            </Link>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-white border-gray-200 text-gray-600 text-xs font-medium shadow-sm">
          <div className="flex items-center gap-1.5">
            <Lock className="size-3" />
            {message}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
        size="sm"
        className="gap-2 border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
        data-testid="button-teaser-guard"
      >
        <Lock className="size-3.5" />
        Complete lessons to unlock
      </Button>
    </Link>
  )
}
