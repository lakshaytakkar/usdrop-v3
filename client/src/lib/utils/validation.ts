/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate email format with detailed error message
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: 'Email is required' }
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: 'Please enter a valid email address' }
  }

  return { valid: true }
}

/**
 * Password validation
 */
export interface PasswordValidationResult {
  valid: boolean
  errors: string[]
  strength: number
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []

  if (!password) {
    return { valid: false, errors: ['Password is required'], strength: 0 }
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  // Calculate strength (0-4)
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z\d]/.test(password)) strength++

  return {
    valid: errors.length === 0,
    errors,
    strength: Math.min(strength, 4),
  }
}

/**
 * Check if passwords match
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): { valid: boolean; error?: string } {
  if (!confirmPassword) {
    return { valid: false, error: 'Please confirm your password' }
  }

  if (!passwordsMatch(password, confirmPassword)) {
    return { valid: false, error: 'Passwords do not match' }
  }

  return { valid: true }
}

/**
 * Form validation helpers
 */
export interface ValidationError {
  field: string
  message: string
}

export class ValidationError extends Error {
  field: string

  constructor(field: string, message: string) {
    super(message)
    this.field = field
    this.name = 'ValidationError'
  }
}

/**
 * Sanitize user input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}
