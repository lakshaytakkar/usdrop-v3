import { useOnboarding } from "@/contexts/onboarding-context"
import { getTeaserConfig, type TeaserPageConfig } from "@/lib/teaser-config"

interface PageTeaserResult {
  isLocked: boolean
  config: TeaserPageConfig | null
  isFree: boolean
  hasCompletedFreeLearning: boolean
  isLoading: boolean
}

export function usePageTeaser(path?: string): PageTeaserResult {
  const { isFree, hasCompletedFreeLearning, isLoading } = useOnboarding()

  const config = path ? getTeaserConfig(path) : null
  const isLocked = isFree && !hasCompletedFreeLearning && config !== null && config.strategy !== "none"

  return {
    isLocked,
    config,
    isFree,
    hasCompletedFreeLearning,
    isLoading,
  }
}

export function useItemTeaser(path: string, index: number): { isLocked: boolean; lockMessage: string } {
  const { isLocked, config } = usePageTeaser(path)

  if (!isLocked || !config) {
    return { isLocked: false, lockMessage: "" }
  }

  const itemLocked = index >= config.visibleItems
  return {
    isLocked: itemLocked,
    lockMessage: config.lockMessage,
  }
}
