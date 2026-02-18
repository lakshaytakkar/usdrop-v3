/**
 * Generate a secure random password
 * @param length - Password length (default: 16)
 * @returns Generated password
 */
export function generateSecurePassword(length: number = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const allChars = lowercase + uppercase + numbers + symbols

  // Ensure at least one character from each category
  let password = ''
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Calculate password strength score (0-4)
 * @param password - Password to check
 * @returns Strength score: 0=very weak, 1=weak, 2=fair, 3=good, 4=strong
 */
export function getPasswordStrength(password: string): number {
  if (!password) return 0
  
  let score = 0
  
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z\d]/.test(password)) score++
  
  return Math.min(score, 4)
}

/**
 * Get password strength label
 * @param password - Password to check
 * @returns Strength label
 */
export function getPasswordStrengthLabel(password: string): string {
  const strength = getPasswordStrength(password)
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return labels[strength]
}

/**
 * Get password strength color
 * @param password - Password to check
 * @returns Color class name
 */
export function getPasswordStrengthColor(password: string): string {
  const strength = getPasswordStrength(password)
  if (strength >= 4) return 'text-green-600'
  if (strength >= 3) return 'text-blue-600'
  if (strength >= 2) return 'text-yellow-600'
  return 'text-red-600'
}

/**
 * Get password strength progress bar color
 * @param password - Password to check
 * @returns Color class name
 */
export function getPasswordStrengthBarColor(password: string): string {
  const strength = getPasswordStrength(password)
  if (strength >= 4) return 'bg-green-600'
  if (strength >= 3) return 'bg-blue-600'
  if (strength >= 2) return 'bg-yellow-600'
  return 'bg-red-600'
}

/**
 * Get password strength progress percentage
 * @param password - Password to check
 * @returns Progress percentage (0-100)
 */
export function getPasswordStrengthProgress(password: string): number {
  const strength = getPasswordStrength(password)
  return (strength / 4) * 100
}
























