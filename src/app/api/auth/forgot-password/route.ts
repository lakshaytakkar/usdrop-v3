import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validateEmail } from '@/lib/utils/validation'
import { getAuthErrorMessage } from '@/lib/utils/auth'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    // Validate and construct redirectTo URL
    // Password reset flow: email link -> /auth/callback?type=recovery -> /auth/reset-password
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const redirectTo = `${siteUrl}/auth/callback?type=recovery`
    
    // Ensure the redirect URL is valid
    try {
      new URL(redirectTo)
    } catch {
      return NextResponse.json(
        { error: 'Invalid site URL configuration. Please contact support.' },
        { status: 500 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) {
      // Handle rate limiting
      if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment before requesting another reset link.' },
          { status: 429 }
        )
      }

      // Check for email sending errors
      if (error.message.includes('email') && (error.message.includes('send') || error.message.includes('deliver'))) {
        console.error('Email sending error:', error)
        return NextResponse.json(
          { error: 'Failed to send password reset email. Please try again or contact support if the problem persists.' },
          { status: 500 }
        )
      }

      // Handle invalid email format (though we validate above, Supabase might catch edge cases)
      if (error.message.includes('invalid') && error.message.includes('email')) {
        return NextResponse.json(
          { error: 'Invalid email address format.' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: getAuthErrorMessage(error) || 'Failed to send reset email' },
        { status: 400 }
      )
    }

    // Always return success message (security best practice - don't reveal if email exists)
    return NextResponse.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
