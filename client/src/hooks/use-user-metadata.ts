import { useUnifiedUser } from '@/contexts/unified-user-context'

/**
 * Hook to access user metadata from unified user context
 * Provides convenient access to user information and computed values
 */
export function useUserMetadata() {
  const { metadata, loading, error } = useUnifiedUser()

  return {
    // Basic info
    id: metadata?.id,
    email: metadata?.email,
    fullName: metadata?.fullName,
    username: metadata?.username,
    avatarUrl: metadata?.avatarUrl,

    // User type
    isInternal: metadata?.isInternal ?? false,
    isExternal: metadata?.isExternal ?? true,
    internalRole: metadata?.internalRole,

    // Plan/subscription
    plan: metadata?.plan || 'free',
    planName: metadata?.planName || 'Free',
    isPro: metadata?.isInternal || metadata?.plan === 'pro',
    isFree: !metadata?.isInternal && (metadata?.plan === 'free' || !metadata?.plan),

    // Status
    status: metadata?.status || 'active',
    isActive: metadata?.status === 'active',
    onboardingCompleted: metadata?.onboardingCompleted ?? false,

    // Loading and error states
    loading,
    error,
  }
}

