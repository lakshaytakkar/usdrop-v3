import { UserMetadata } from '@/types/user-metadata'

/**
 * Get the appropriate redirect path for a user based on their type and plan
 * 
 * @param metadata - User metadata object
 * @returns Redirect path string
 */
export function getUserRedirectPath(metadata: UserMetadata | null): string {
  if (!metadata) {
    return '/login'
  }

  // Internal users always go to /admin
  if (metadata.isInternal) {
    return '/admin'
  }

  // External users: free → /onboarding, pro → /home
  if (metadata.isExternal) {
    if (metadata.plan === 'pro') {
      return '/home'
    }
    // Default to /onboarding for free users
    return '/onboarding'
  }

  // Fallback (shouldn't happen, but just in case)
  return '/onboarding'
}

/**
 * Check if user should be redirected to onboarding
 * 
 * @param metadata - User metadata object
 * @returns true if user should go to onboarding
 */
export function shouldRedirectToOnboarding(metadata: UserMetadata | null): boolean {
  if (!metadata) {
    return false
  }

  // Internal users never go to onboarding
  if (metadata.isInternal) {
    return false
  }

  // External free users go to onboarding
  return metadata.isExternal && metadata.plan === 'free'
}

/**
 * Get redirect path for internal users
 */
export function getInternalUserRedirectPath(): string {
  return '/admin'
}

/**
 * Get redirect path for external users based on plan
 */
export function getExternalUserRedirectPath(plan: string): string {
  return plan === 'pro' ? '/home' : '/onboarding'
}

