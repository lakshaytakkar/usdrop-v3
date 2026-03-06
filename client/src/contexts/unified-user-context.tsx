import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './auth-context'
import { UserMetadata, UserMetadataApiResponse, mapApiResponseToMetadata } from '@/types/user-metadata'

interface UnifiedUserContextType {
  metadata: UserMetadata | null
  loading: boolean
  error: string | null
  refreshMetadata: () => Promise<void>
}

const UnifiedUserContext = createContext<UnifiedUserContextType | undefined>(undefined)

export function UnifiedUserProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, authData, refreshUser } = useAuth()
  const [metadata, setMetadata] = useState<UserMetadata | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return

    if (user && authData?.metadata) {
      const userMetadata = mapApiResponseToMetadata(authData.metadata as UserMetadataApiResponse)
      setMetadata(userMetadata)
      setLoading(false)
    } else if (!user) {
      setMetadata(null)
      setLoading(false)
    }
  }, [user, authLoading, authData])

  return (
    <UnifiedUserContext.Provider
      value={{
        metadata,
        loading,
        error: null,
        refreshMetadata: refreshUser,
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

