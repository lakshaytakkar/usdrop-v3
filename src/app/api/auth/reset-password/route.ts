import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validatePassword } from '@/lib/utils/validation'
import { getAuthErrorMessage } from '@/lib/utils/auth'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Password validation
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { 
          error: passwordValidation.errors[0] || 'Invalid password',
          errors: passwordValidation.errors
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current session - user should have a session from clicking the reset link
    // The callback route exchanges the code for a session, then redirects to reset-password page
    const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !existingSession) {
      // Check if the error indicates an expired or invalid token
      if (sessionError?.message?.includes('expired') || sessionError?.message?.includes('invalid')) {
        return NextResponse.json(
          { 
            error: 'This password reset link has expired or is invalid. Please request a new one.',
            expired: true
          },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'No active session found. Please click the password reset link from your email again.' },
        { status: 401 }
      )
    }

    // Verify the session is from a password recovery (has recovery type)
    // This ensures the session is from a password reset flow, not a regular login
    if (existingSession.user && !existingSession.user.recovery_sent_at) {
      // Session might be from a different flow - check if it's recent enough
      const sessionAge = Date.now() - (existingSession.expires_at ? existingSession.expires_at * 1000 : 0)
      if (sessionAge > 3600000) { // 1 hour
        return NextResponse.json(
          { 
            error: 'This password reset link has expired. Please request a new one.',
            expired: true
          },
          { status: 401 }
        )
      }
    }

    // User has a valid session from the reset link, update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    if (updateError) {
      // Handle specific error cases
      if (updateError.message.includes('expired') || updateError.message.includes('invalid')) {
        return NextResponse.json(
          { 
            error: 'This password reset link has expired or is invalid. Please request a new one.',
            expired: true
          },
          { status: 400 }
        )
      }

      if (updateError.message.includes('rate limit') || updateError.message.includes('too many requests')) {
        return NextResponse.json(
          { error: 'Too many password reset attempts. Please wait a moment and try again.' },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: getAuthErrorMessage(updateError) || 'Failed to update password' },
        { status: 400 }
      )
    }

    // Sign out after password reset for security (user will need to sign in again)
    await supabase.auth.signOut()

    return NextResponse.json({
      message: 'Password reset successfully. Please sign in with your new password.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
