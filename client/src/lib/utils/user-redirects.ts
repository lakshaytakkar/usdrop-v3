import { UserMetadata } from '@/types/user-metadata'

export function getUserRedirectPath(metadata: UserMetadata | null): string {
  if (!metadata) {
    return '/login'
  }

  if (metadata.isInternal) {
    return '/admin'
  }

  return '/home'
}

export function shouldRedirectToOnboarding(_metadata: UserMetadata | null): boolean {
  return false
}

export function getInternalUserRedirectPath(): string {
  return '/admin'
}

export function getExternalUserRedirectPath(_plan: string): string {
  return '/home'
}
