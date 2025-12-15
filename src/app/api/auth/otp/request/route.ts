import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validateEmail } from '@/lib/utils/validation'
import { getAuthErrorMessage } from '@/lib/utils/auth'

export async function POST(request: Request) {
  try {
    const { email, type = 'signin' } = await request.json()

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

    const supabase = await createClient()

    // Use signInWithOtp for both signup and signin
    // DO NOT include emailRedirectTo - this causes Supabase to send magic links instead of OTP codes
    // When emailRedirectTo is omitted, Supabase sends 6-digit OTP codes
    // Supabase will automatically create account if it doesn't exist when using OTP
    const { error } = await supabase.auth.signInWithOtp({
      email,
      // No options.emailRedirectTo - this ensures OTP codes are sent, not magic links
    })

    if (error) {
      // Handle rate limiting
      if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment before requesting another code.' },
          { status: 429 }
        )
      }

      // Check for email sending errors
      if (error.message.includes('email') && (error.message.includes('send') || error.message.includes('deliver'))) {
        console.error('Email sending error:', error)
        return NextResponse.json(
          { error: 'Failed to send verification code. Please try again or contact support if the problem persists.' },
          { status: 500 }
        )
      }

      // Handle invalid email format
      if (error.message.includes('invalid') && error.message.includes('email')) {
        return NextResponse.json(
          { error: 'Invalid email address format.' },
          { status: 400 }
        )
      }

      // Handle disabled email provider
      if (error.message.includes('disabled') || error.message.includes('not enabled')) {
        console.error('Email provider not configured:', error)
        return NextResponse.json(
          { error: 'Email authentication is currently unavailable. Please contact support.' },
          { status: 503 }
        )
      }

      return NextResponse.json(
        { error: getAuthErrorMessage(error) || 'Failed to send verification code' },
        { status: 400 }
      )
    }

    // Always return success message (security best practice - don't reveal if email exists)
    return NextResponse.json({
      message: 'A 6-digit verification code has been sent to your email.',
    })
  } catch (error) {
    console.error('OTP request error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
