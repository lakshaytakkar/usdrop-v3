import { useOnboarding } from "@/contexts/onboarding-context"
import { FreeLearningCutoff } from "@/components/ui/free-learning-cutoff"
import { cn } from "@/lib/utils"

interface TeaserListFadeProps {
  children: React.ReactNode
  visibleItems: number
  contentType?: string
  className?: string
}

export function TeaserListFade({
  children,
  visibleItems,
  contentType = "items",
  className,
}: TeaserListFadeProps) {
  const { isFree, hasCompletedFreeLearning } = useOnboarding()
  const isLocked = isFree && !hasCompletedFreeLearning

  if (!isLocked) {
    return <>{children}</>
  }

  return (
    <div className={cn("relative", className)} data-testid="teaser-list-fade">
      <div className="relative">
        {children}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, rgba(245,245,247,0.6) 40%, rgba(245,245,247,0.95) 100%)",
          }}
        />
      </div>
      <div className="relative -mt-12 z-20">
        <FreeLearningCutoff itemCount={visibleItems} contentType={contentType} />
      </div>
    </div>
  )
}

interface TeaserCardGridProps {
  items: any[]
  visibleItems: number
  contentType?: string
  renderItem: (item: any, index: number, isLocked: boolean) => React.ReactNode
  className?: string
  gridClassName?: string
}

export function TeaserCardGrid({
  items,
  visibleItems,
  contentType = "items",
  renderItem,
  className,
  gridClassName,
}: TeaserCardGridProps) {
  const { isFree, hasCompletedFreeLearning } = useOnboarding()
  const isLocked = isFree && !hasCompletedFreeLearning

  if (!isLocked) {
    return (
      <div className={cn(gridClassName, className)}>
        {items.map((item, i) => renderItem(item, i, false))}
      </div>
    )
  }

  const visible = items.slice(0, visibleItems)
  const locked = items.slice(visibleItems, visibleItems + 2)

  return (
    <div className={className} data-testid="teaser-card-grid">
      <div className={gridClassName}>
        {visible.map((item, i) => renderItem(item, i, false))}
        {locked.map((item, i) => (
          <div key={`locked-${i}`} className="relative select-none" data-testid={`teaser-card-locked-${i}`}>
            <div className="blur-[3px] opacity-50 pointer-events-none saturate-50">
              {renderItem(item, visibleItems + i, true)}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm border border-gray-200">
                <svg className="size-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                Complete lessons to unlock
              </div>
            </div>
          </div>
        ))}
      </div>
      <FreeLearningCutoff itemCount={visibleItems} contentType={contentType} />
    </div>
  )
}
