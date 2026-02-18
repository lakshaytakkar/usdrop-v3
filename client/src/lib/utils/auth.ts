/**
 * Auth utility functions
 */

/**
 * Get redirect URL from search params or default
 */
export function getRedirectUrl(searchParams: URLSearchParams, defaultPath: string = '/'): string {
  const redirect = searchParams.get('redirectedFrom') || searchParams.get('redirect') || defaultPath
  
  // Ensure redirect is relative (security)
  if (redirect.startsWith('http://') || redirect.startsWith('https://')) {
    return defaultPath
  }
  
  // Ensure redirect starts with /
  if (!redirect.startsWith('/')) {
    return `/${redirect}`
  }
  
  return redirect
}

/**
 * Build redirect URL with query parameter
 */
export function buildRedirectUrl(path: string, redirectedFrom?: string): string {
  if (!redirectedFrom) {
    return path
  }
  
  const url = new URL(path, 'http://localhost') // Base URL doesn't matter, we only need pathname
  url.searchParams.set('redirectedFrom', redirectedFrom)
  return url.pathname + url.search
}

/**
 * Extract token from URL hash (for password reset)
 */
export function extractTokenFromHash(hash: string): { type: string; token: string } | null {
  if (!hash) return null
  
  try {
    const params = new URLSearchParams(hash.substring(1)) // Remove #
    const type = params.get('type')
    const accessToken = params.get('access_token')
    
    if (type && accessToken) {
      return { type, token: accessToken }
    }
    
    return null
  } catch {
    return null
  }
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch') ||
      error.name === 'TypeError'
    )
  }
  return false
}

/**
 * Get user-friendly error message from Supabase error
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!error) {
    return 'An unexpected error occurred'
  }

  if (isNetworkError(error)) {
    return 'Network error. Please check your connection and try again.'
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    // Handle specific Supabase auth errors
    if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
      return 'Invalid email or password'
    }

    if (message.includes('email not confirmed') || message.includes('email_not_confirmed')) {
      return 'Please verify your email before signing in. Check your inbox for a confirmation link.'
    }

    if (message.includes('already registered') || message.includes('user already registered')) {
      return 'An account with this email already exists'
    }

    if (message.includes('password')) {
      return 'Password is too weak or invalid'
    }

    if (message.includes('rate limit') || message.includes('too many requests')) {
      return 'Too many attempts. Please wait a moment and try again.'
    }

    if (message.includes('token') && (message.includes('expired') || message.includes('invalid'))) {
      return 'This link has expired or is invalid. Please request a new one.'
    }

    if (message.includes('signup_disabled')) {
      return 'Sign up is currently disabled. Please contact support.'
    }

    // Return generic error for security
    return error.message
  }

  return 'An unexpected error occurred'
}

/**
 * Check if email verification is required
 */
export function isEmailVerificationRequired(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('email not confirmed') ||
      message.includes('email_not_confirmed') ||
      message.includes('verify your email')
    )
  }
  return false
}
