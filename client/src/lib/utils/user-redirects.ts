import { UserMetadata } from '@/types/user-metadata'

export function getUserRedirectPath(metadata: UserMetadata | null): string {
  if (!metadata) {
    return '/login'
  }

  if (metadata.isInternal) {
    return '/admin'
  }

  const planLower = (metadata.plan || 'free').toLowerCase()
  if (planLower === 'free') {
    return '/free-learning'
  }

  return '/home'
}

export function shouldRedirectToOnboarding(_metadata: UserMetadata | null): boolean {
  return false
}

export function getInternalUserRedirectPath(): string {
  return '/admin'
}

export function getExternalUserRedirectPath(plan: string): string {
  if ((plan || 'free').toLowerCase() === 'free') {
    return '/free-learning'
  }
  return '/home'
}
