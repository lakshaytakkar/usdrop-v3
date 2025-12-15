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

    // Validate and construct emailRedirectTo URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const emailRedirectTo = `${siteUrl}/auth/callback`
    
    // Ensure the redirect URL is valid
    try {
      new URL(emailRedirectTo)
    } catch {
      return NextResponse.json(
        { error: 'Invalid site URL configuration. Please contact support.' },
        { status: 500 }
      )
    }

    const supabase = await createClient()

    // Supabase's recommended approach: Call signUp again with the same email
    // Supabase will resend the verification email if the user exists but isn't verified
    // This is the standard way to resend verification emails in Supabase
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password: Math.random().toString(36) + Math.random().toString(36), // Random password for existing users
      options: {
        emailRedirectTo,
      },
    })

    if (signUpError) {
      // Handle rate limiting
      if (signUpError.message.includes('rate limit') || signUpError.message.includes('too many requests')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment before requesting another verification email.' },
          { status: 429 }
        )
      }

      // Check for email sending errors
      if (signUpError.message.includes('email') && (signUpError.message.includes('send') || signUpError.message.includes('deliver'))) {
        console.error('Email sending error:', signUpError)
        return NextResponse.json(
          { error: 'Failed to send verification email. Please try again or contact support if the problem persists.' },
          { status: 500 }
        )
      }

      // If user is already registered, Supabase may still send the verification email
      // This is expected behavior - Supabase handles resending for existing unverified users
      if (signUpError.message.includes('already registered') || signUpError.message.includes('User already registered')) {
        // Supabase may still send verification email even with this error
        // This is the expected behavior for resending verification
      } else {
        // Other errors should be reported
        return NextResponse.json(
          { error: getAuthErrorMessage(signUpError) || 'Failed to resend verification email' },
          { status: 400 }
        )
      }
    }

    // Always return success (security best practice - don't reveal if email exists)
    // Even if there was an "already registered" error, Supabase may have sent the email
    return NextResponse.json({
      message: 'If your email needs verification, a new verification link has been sent.',
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
