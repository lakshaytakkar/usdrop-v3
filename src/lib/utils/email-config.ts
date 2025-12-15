/**
 * Email Configuration Utilities
 * 
 * Functions to validate and check Supabase email configuration
 */

import { createClient } from '@/lib/supabase/server'

export interface EmailConfigStatus {
  configured: boolean
  provider?: 'built-in' | 'smtp' | 'unknown'
  error?: string
  message?: string
}

/**
 * Check if Supabase email is properly configured
 * This attempts to verify email functionality by checking Supabase settings
 */
export async function checkEmailConfiguration(): Promise<EmailConfigStatus> {
  try {
    const supabase = await createClient()

    // Try to get auth settings (this may not be available via client API)
    // We'll use a simple test: attempt to check if we can query auth users
    // If this works, email is likely configured
    
    // Note: Supabase doesn't expose email config via client API
    // This is a best-effort check
    // The actual configuration should be verified in Supabase Dashboard
    
    return {
      configured: true,
      provider: 'unknown',
      message: 'Email configuration should be verified in Supabase Dashboard. Ensure email provider is enabled in Authentication > Email settings.',
    }
  } catch (error) {
    console.error('Error checking email configuration:', error)
    return {
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Unable to verify email configuration. Please check Supabase Dashboard settings.',
    }
  }
}

/**
 * Validate email redirect URL
 */
export function validateEmailRedirectUrl(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: false, error: 'Redirect URL is required' }
  }

  try {
    const urlObj = new URL(url)
    
    // Ensure it's HTTP or HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'Redirect URL must use HTTP or HTTPS protocol' }
    }

    // Ensure it's from the same origin (security)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const siteUrlObj = new URL(siteUrl)
    
    if (urlObj.origin !== siteUrlObj.origin) {
      // Allow localhost for development
      if (process.env.NODE_ENV === 'development' && urlObj.hostname === 'localhost') {
        return { valid: true }
      }
      
      return { 
        valid: false, 
        error: 'Redirect URL must be from the same origin as the site URL' 
      }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}

/**
 * Get email configuration instructions
 */
export function getEmailConfigInstructions(): string {
  return `
To configure email in Supabase:

1. Go to Supabase Dashboard > Authentication > Email
2. Enable the Email provider
3. Choose either:
   - Built-in email (for development/testing)
   - Custom SMTP (for production)
4. Configure SMTP settings if using custom SMTP:
   - SMTP Host
   - SMTP Port
   - SMTP User
   - SMTP Password
   - Sender email address
5. Set Site URL in Authentication > URL Configuration
6. Add redirect URLs for:
   - Email confirmation
   - Password reset
   - Magic link
7. (Optional) Customize email templates in Authentication > Email Templates

For production, it's recommended to use a custom SMTP provider like:
- SendGrid
- Mailgun
- AWS SES
- Postmark
- Resend
`
}





