import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { apiFetch, clearAccessToken, getAccessToken } from '@/lib/supabase'

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  account_type: string
  internal_role: string | null
  status: string
  onboarding_completed: boolean
}

type AuthResponseData = {
  user: UserProfile
  plan: string
  planName: string
  metadata: any
} | null

type AuthContextType = {
  user: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  authData: AuthResponseData
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [authData, setAuthData] = useState<AuthResponseData>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const token = getAccessToken()
      if (!token) {
        setUser(null)
        setAuthData(null)
        setLoading(false)
        return
      }
      const res = await apiFetch(`/api/auth/user?_=${Date.now()}`)
      if (res.ok) {
        const data = await res.json()
        setUser(data.user || null)
        setAuthData(data)
      } else {
        setUser(null)
        setAuthData(null)
        if (res.status === 401) {
          clearAccessToken()
        }
      }
    } catch {
      setUser(null)
      setAuthData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const signOut = useCallback(async () => {
    try {
      await apiFetch('/api/auth/signout', { method: 'POST' })
    } catch (error) {
      console.error('Error signing out:', error)
    }
    clearAccessToken()
    setUser(null)
    setAuthData(null)
    window.location.href = '/login'
  }, [])

  const refreshUser = useCallback(async () => {
    await fetchUser()
  }, [fetchUser])

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser, authData }}>
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
