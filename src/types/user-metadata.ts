// User Metadata Types
// Types for unified user context and metadata API

export interface UserMetadata {
  id: string
  email: string
  fullName: string | null
  username: string | null
  avatarUrl: string | null
  isInternal: boolean
  internalRole: 'superadmin' | 'admin' | 'manager' | 'executive' | null
  isExternal: boolean
  plan: string
  planName: string
  status: 'active' | 'inactive' | 'suspended'
  onboardingCompleted: boolean
  subscriptionStatus: string | null
}

export interface UserMetadataApiResponse {
  id: string
  email: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  is_internal: boolean
  internal_role: 'superadmin' | 'admin' | 'manager' | 'executive' | null
  is_external: boolean
  plan: string
  plan_name: string
  status: 'active' | 'inactive' | 'suspended'
  onboarding_completed: boolean
  subscription_status: string | null
}

/**
 * Helper function to map API response to UserMetadata
 */
export function mapApiResponseToMetadata(response: UserMetadataApiResponse): UserMetadata {
  return {
    id: response.id,
    email: response.email,
    fullName: response.full_name,
    username: response.username,
    avatarUrl: response.avatar_url,
    isInternal: response.is_internal,
    internalRole: response.internal_role,
    isExternal: response.is_external,
    plan: response.plan,
    planName: response.plan_name,
    status: response.status,
    onboardingCompleted: response.onboarding_completed,
    subscriptionStatus: response.subscription_status,
  }
}

