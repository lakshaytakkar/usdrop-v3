import { useUnifiedUser } from '@/contexts/unified-user-context'
import { getUserRedirectPath } from '@/lib/utils/user-redirects'

/**
 * Hook that returns the appropriate redirect path for the current user
 * Uses unified user context metadata to determine redirect based on user type and plan
 */
export function useUserRedirect() {
  const { metadata, loading } = useUnifiedUser()

  return {
    redirectPath: getUserRedirectPath(metadata),
    loading,
  }
}

