

import { useOnboarding } from "@/contexts/onboarding-context"

export interface TeaserLockConfig {
  freeVisibleCount?: number
  strategy?: "first-n-items" | "details-locked" | "pagination-locked" | "all-locked"
  customLockCheck?: (index: number, total: number, isFree: boolean) => boolean
}

export interface TeaserLockResult {
  isLocked: boolean
  lockReason?: string
}

const FREE_LEARNING_LOCK_REASON = "Complete all Free Learning videos to unlock full access"

export function useTeaserLock(
  index: number,
  config: TeaserLockConfig = {}
): TeaserLockResult {
  const { isFree, hasCompletedFreeLearning } = useOnboarding()
  const {
    freeVisibleCount = 6,
    strategy = "first-n-items",
    customLockCheck,
  } = config

  if (!isFree) {
    return { isLocked: false }
  }

  if (hasCompletedFreeLearning) {
    return { isLocked: false }
  }

  if (customLockCheck) {
    const isLocked = customLockCheck(index, 0, isFree)
    return {
      isLocked,
      lockReason: isLocked ? FREE_LEARNING_LOCK_REASON : undefined,
    }
  }

  switch (strategy) {
    case "first-n-items":
      return {
        isLocked: index >= freeVisibleCount,
        lockReason: index >= freeVisibleCount
          ? FREE_LEARNING_LOCK_REASON
          : undefined,
      }

    case "details-locked":
      return {
        isLocked: false,
        lockReason: FREE_LEARNING_LOCK_REASON,
      }

    case "pagination-locked":
      return {
        isLocked: false,
        lockReason: FREE_LEARNING_LOCK_REASON,
      }

    case "all-locked":
      return {
        isLocked: true,
        lockReason: FREE_LEARNING_LOCK_REASON,
      }

    default:
      return { isLocked: false }
  }
}

export function usePaginationLock(isFree: boolean): boolean {
  return isFree
}

export function useDetailsLock(isFree: boolean): boolean {
  return isFree
}

export function getTeaserLockState(
  index: number,
  isFree: boolean,
  config: TeaserLockConfig = {},
  hasCompletedFreeLearning: boolean = false
): TeaserLockResult {
  const {
    freeVisibleCount = 6,
    strategy = "first-n-items",
    customLockCheck,
  } = config

  if (!isFree) {
    return { isLocked: false }
  }

  if (hasCompletedFreeLearning) {
    return { isLocked: false }
  }

  if (customLockCheck) {
    const isLocked = customLockCheck(index, 0, isFree)
    return {
      isLocked,
      lockReason: isLocked ? FREE_LEARNING_LOCK_REASON : undefined,
    }
  }

  switch (strategy) {
    case "first-n-items":
      return {
        isLocked: index >= freeVisibleCount,
        lockReason: index >= freeVisibleCount
          ? FREE_LEARNING_LOCK_REASON
          : undefined,
      }

    case "details-locked":
      return {
        isLocked: false,
        lockReason: FREE_LEARNING_LOCK_REASON,
      }

    case "pagination-locked":
      return {
        isLocked: false,
        lockReason: FREE_LEARNING_LOCK_REASON,
      }

    case "all-locked":
      return {
        isLocked: true,
        lockReason: FREE_LEARNING_LOCK_REASON,
      }

    default:
      return { isLocked: false }
  }
}

