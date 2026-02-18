

import { useOnboarding } from "@/contexts/onboarding-context"

export interface TeaserLockConfig {
  /**
   * Number of items to show fully for free users (default: 6)
   */
  freeVisibleCount?: number
  /**
   * Strategy for locking items
   * - "first-n-items": Show first N items, lock the rest (Product Hunt style)
   * - "details-locked": Show all items but lock detail pages/actions
   * - "pagination-locked": Show page 1, lock pagination/load more
   * - "all-locked": Lock all items (use sparingly)
   */
  strategy?: "first-n-items" | "details-locked" | "pagination-locked" | "all-locked"
  /**
   * Custom lock check function (overrides default behavior)
   */
  customLockCheck?: (index: number, total: number, isFree: boolean) => boolean
}

export interface TeaserLockResult {
  /**
   * Whether the item at this index should be locked for free users
   */
  isLocked: boolean
  /**
   * Reason for locking (for tooltips/UI)
   */
  lockReason?: string
}

/**
 * Hook to determine if an item should be locked for free users
 * Based on the Product Hunt pattern: show first N items, lock the rest
 * 
 * @param index - Zero-based index of the item in the list
 * @param config - Configuration for the teaser lock behavior
 * @returns Object with isLocked boolean and optional lockReason
 * 
 * @example
 * ```tsx
 * const { isLocked } = useTeaserLock(index, { freeVisibleCount: 6 })
 * 
 * return (
 *   <ProductCard 
 *     product={product}
 *     isLocked={isLocked}
 *     onLockedClick={() => setIsUpsellOpen(true)}
 *   />
 * )
 * ```
 */
export function useTeaserLock(
  index: number,
  config: TeaserLockConfig = {}
): TeaserLockResult {
  const { isFree } = useOnboarding()
  const {
    freeVisibleCount = 6,
    strategy = "first-n-items",
    customLockCheck,
  } = config

  // If user is Pro, nothing is locked
  if (!isFree) {
    return { isLocked: false }
  }

  // Custom lock check takes precedence
  if (customLockCheck) {
    const isLocked = customLockCheck(index, 0, isFree)
    return {
      isLocked,
      lockReason: isLocked ? "This feature requires a Pro subscription" : undefined,
    }
  }

  // Apply strategy-based locking
  switch (strategy) {
    case "first-n-items":
      // Product Hunt style: first N items visible, rest locked
      return {
        isLocked: index >= freeVisibleCount,
        lockReason: index >= freeVisibleCount
          ? `View the first ${freeVisibleCount} items for free. Upgrade to Pro to see all products.`
          : undefined,
      }

    case "details-locked":
      // All items visible, but detail pages/actions are locked
      return {
        isLocked: false, // Items themselves are visible
        lockReason: "Detail pages require Pro",
      }

    case "pagination-locked":
      // First page visible, pagination locked
      return {
        isLocked: false, // Items on page 1 are visible
        lockReason: "Pagination requires Pro",
      }

    case "all-locked":
      // Everything locked (use sparingly)
      return {
        isLocked: true,
        lockReason: "This feature requires a Pro subscription",
      }

    default:
      return { isLocked: false }
  }
}

/**
 * Helper to check if pagination/load more should be locked
 */
export function usePaginationLock(isFree: boolean): boolean {
  return isFree
}

/**
 * Helper to check if detail pages/actions should be locked
 */
export function useDetailsLock(isFree: boolean): boolean {
  return isFree
}

/**
 * Non-hook version for use in loops/maps
 * Use this when you can't call hooks (e.g., inside .map())
 */
export function getTeaserLockState(
  index: number,
  isFree: boolean,
  config: TeaserLockConfig = {}
): TeaserLockResult {
  const {
    freeVisibleCount = 6,
    strategy = "first-n-items",
    customLockCheck,
  } = config

  // If user is Pro, nothing is locked
  if (!isFree) {
    return { isLocked: false }
  }

  // Custom lock check takes precedence
  if (customLockCheck) {
    const isLocked = customLockCheck(index, 0, isFree)
    return {
      isLocked,
      lockReason: isLocked ? "This feature requires a Pro subscription" : undefined,
    }
  }

  // Apply strategy-based locking
  switch (strategy) {
    case "first-n-items":
      return {
        isLocked: index >= freeVisibleCount,
        lockReason: index >= freeVisibleCount
          ? `View the first ${freeVisibleCount} items for free. Upgrade to Pro to see all products.`
          : undefined,
      }

    case "details-locked":
      return {
        isLocked: false, // Items themselves are visible
        lockReason: "Detail pages require Pro",
      }

    case "pagination-locked":
      return {
        isLocked: false, // Items on page 1 are visible
        lockReason: "Pagination requires Pro",
      }

    case "all-locked":
      return {
        isLocked: true,
        lockReason: "This feature requires a Pro subscription",
      }

    default:
      return { isLocked: false }
  }
}

