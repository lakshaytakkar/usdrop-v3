'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const refreshBlockedRef = useRef(false)

  useEffect(() => {
    let isMounted = true
    let refreshTimeout: NodeJS.Timeout | null = null
    let lastRefreshTime = 0
    const MIN_REFRESH_INTERVAL = 2000 // Minimum 2 seconds between refreshes

    // Check if we're on a 404 page by checking the document
    const check404 = () => {
      if (typeof window !== 'undefined') {
        // Check if we're rendering the not-found page
        const notFoundElement = document.querySelector('[data-not-found]')
        const htmlHas404 = document.documentElement.hasAttribute('data-not-found')
        const is404 = !!notFoundElement || htmlHas404
        
        // Update the ref so other parts of the code can check
        refreshBlockedRef.current = is404
        
        return is404
      }
      return false
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted && !check404()) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      } else if (isMounted) {
        // Still set loading to false even on 404 to prevent loading state
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return
      
      // Check if we're on a 404 page before doing anything
      if (check404()) {
        // Don't update state or refresh on 404 pages to prevent loops
        // Still update loading state to prevent infinite loading
        setLoading(false)
        return
      }
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Only refresh router on significant auth changes (sign in/out)
      // Completely skip refresh on 404 pages and add rate limiting
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        const now = Date.now()
        const timeSinceLastRefresh = now - lastRefreshTime
        
        // Rate limit refreshes - don't refresh if we just refreshed recently
        if (timeSinceLastRefresh < MIN_REFRESH_INTERVAL) {
          return
        }
        
        // Clear any pending refresh
        if (refreshTimeout) {
          clearTimeout(refreshTimeout)
        }
        // Use a small delay to prevent rapid refreshes
        refreshTimeout = setTimeout(() => {
          if (isMounted && !check404() && !refreshBlockedRef.current) {
            lastRefreshTime = Date.now()
            router.refresh()
          }
        }, 100)
      }
    })

    return () => {
      isMounted = false
      if (refreshTimeout) {
        clearTimeout(refreshTimeout)
      }
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
      
      // Clear state immediately
      setSession(null)
      setUser(null)
      
      // Use window.location for a hard redirect to ensure clean logout
      // This prevents any re-render issues
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
      // Even if there's an error, try to redirect
      window.location.href = '/login'
    }
  }, [supabase])

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
