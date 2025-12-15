import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthErrorMessage } from '@/lib/utils/auth'

export async function POST(request: Request) {
  try {
    const { password, email } = await request.json()

    const supabase = await createClient()

    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'You must be signed in to reauthenticate.' },
        { status: 401 }
      )
    }

    // If password is provided, verify it
    if (password) {
      // Verify password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email || email || '',
        password,
      })

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials') || signInError.message.includes('invalid credentials')) {
          return NextResponse.json(
            { error: 'Invalid password. Please try again.' },
            { status: 401 }
          )
        }

        return NextResponse.json(
          { error: getAuthErrorMessage(signInError) || 'Reauthentication failed' },
          { status: 401 }
        )
      }

      // Reauthentication successful
      return NextResponse.json({
        message: 'Reauthentication successful',
        authenticated: true,
      })
    }

    // If no password provided, send OTP for passwordless reauthentication
    if (!email && !session.user.email) {
      return NextResponse.json(
        { error: 'Email or password is required for reauthentication.' },
        { status: 400 }
      )
    }

    const reauthEmail = email || session.user.email || ''

    // Validate and construct emailRedirectTo URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const emailRedirectTo = `${siteUrl}/auth/callback?type=reauthentication`
    
    // Send OTP for reauthentication
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: reauthEmail,
      options: {
        emailRedirectTo,
        shouldCreateUser: false, // Don't create new user, only for existing users
      },
    })

    if (otpError) {
      // Handle rate limiting
      if (otpError.message.includes('rate limit') || otpError.message.includes('too many requests')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment before requesting another verification link.' },
          { status: 429 }
        )
      }

      // Check for email sending errors
      if (otpError.message.includes('email') && (otpError.message.includes('send') || otpError.message.includes('deliver'))) {
        console.error('Email sending error:', otpError)
        return NextResponse.json(
          { error: 'Failed to send reauthentication email. Please try again or contact support if the problem persists.' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: getAuthErrorMessage(otpError) || 'Failed to send reauthentication link' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'A reauthentication link has been sent to your email. Please click the link to complete reauthentication.',
      email: reauthEmail,
    })
  } catch (error) {
    console.error('Reauthentication error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}





