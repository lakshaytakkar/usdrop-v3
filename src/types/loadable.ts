export interface LoadableState<T> {
  data: T
  isLoading: boolean
  error: string | null
  isEmpty: boolean
  isPartial?: boolean
}

export interface LoadableOptions<T> {
  data: T
  isLoading: boolean
  error: string | null
  isPartial?: boolean
}

/**
  * Lightweight helper to derive empty state.
  * - Arrays: empty when length === 0.
  * - Objects: empty when no keys.
  * - Null/undefined: empty.
  */
export function deriveEmpty(data: unknown): boolean {
  if (data === null || data === undefined) return true
  if (Array.isArray(data)) return data.length === 0
  if (typeof data === "object") return Object.keys(data as Record<string, unknown>).length === 0
  return false
}

/**
 * Create a normalized LoadableState from primitives.
 */
export function buildLoadableState<T>(options: LoadableOptions<T>): LoadableState<T> {
  const { data, isLoading, error, isPartial } = options
  const isEmpty = !isLoading && deriveEmpty(data)
  return {
    data,
    isLoading,
    error,
    isEmpty,
    isPartial,
  }
}

