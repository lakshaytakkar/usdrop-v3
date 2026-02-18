

import { apiFetch } from '@/lib/supabase'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './auth-context'
import { UserMetadata, UserMetadataApiResponse, mapApiResponseToMetadata } from '@/types/user-metadata'

interface UnifiedUserContextType {
  metadata: UserMetadata | null
  loading: boolean
  error: string | null
  refreshMetadata: () => Promise<void>
}

const UnifiedUserContext = createContext<UnifiedUserContextType | undefined>(undefined)

const CACHE_KEY = 'unified_user_metadata_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface CachedMetadata {
  metadata: UserMetadata
  timestamp: number
}

export function UnifiedUserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [metadata, setMetadata] = useState<UserMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetadata = useCallback(async (skipCache = false) => {
    if (!user) {
      setMetadata(null)
      setLoading(false)
      setError(null)
      // Clear cache on logout
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.removeItem(CACHE_KEY)
        } catch (e) {
          // Ignore cache errors
        }
      }
      return
    }

    // Check cache first
    if (!skipCache && typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY)
        if (cached) {
          const cachedData: CachedMetadata = JSON.parse(cached)
          const now = Date.now()

          // Use cached data if still valid
          if (now - cachedData.timestamp < CACHE_DURATION) {
            setMetadata(cachedData.metadata)
            setLoading(false)
            setError(null)
            return
          }
        }
      } catch (cacheError) {
        // If cache parsing fails, continue to fetch
        console.warn('Failed to read metadata cache:', cacheError)
      }
    }

    try {
      setLoading(true)
      setError(null)

      const response = await apiFetch("/api/auth/user/metadata")

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - user might have logged out
          setMetadata(null)
          setLoading(false)
          if (typeof window !== 'undefined') {
            try {
              sessionStorage.removeItem(CACHE_KEY)
            } catch (e) {
              // Ignore cache errors
            }
          }
          return
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch user metadata`)
      }

      const data: UserMetadataApiResponse = await response.json()
      const userMetadata = mapApiResponseToMetadata(data)

      setMetadata(userMetadata)
      setError(null)

      // Cache the result
      if (typeof window !== 'undefined') {
        try {
          const cacheData: CachedMetadata = {
            metadata: userMetadata,
            timestamp: Date.now(),
          }
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        } catch (cacheError) {
          console.warn('Failed to cache metadata:', cacheError)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user metadata'
      setError(errorMessage)
      console.error('Error fetching user metadata:', err)
      // Don't set metadata to null on error, keep existing if available
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch metadata on mount and when user changes
  useEffect(() => {
    fetchMetadata()
  }, [fetchMetadata])

  const refreshMetadata = useCallback(async () => {
    await fetchMetadata(true) // Skip cache on manual refresh
  }, [fetchMetadata])

  return (
    <UnifiedUserContext.Provider
      value={{
        metadata,
        loading,
        error,
        refreshMetadata,
      }}
    >
      {children}
    </UnifiedUserContext.Provider>
  )
}

export function useUnifiedUser() {
  const context = useContext(UnifiedUserContext)
  if (context === undefined) {
    throw new Error('useUnifiedUser must be used within UnifiedUserProvider')
  }
  return context
}

