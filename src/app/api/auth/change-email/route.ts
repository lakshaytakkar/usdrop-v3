import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validateEmail } from '@/lib/utils/validation'
import { getAuthErrorMessage } from '@/lib/utils/auth'

export async function POST(request: Request) {
  try {
    const { newEmail } = await request.json()

    if (!newEmail) {
      return NextResponse.json(
        { error: 'New email address is required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailValidation = validateEmail(newEmail)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'You must be signed in to change your email address.' },
        { status: 401 }
      )
    }

    // Check if new email is different from current email
    if (session.user.email?.toLowerCase() === newEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'New email address must be different from your current email.' },
        { status: 400 }
      )
    }

    // Validate and construct emailRedirectTo URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const emailRedirectTo = `${siteUrl}/auth/callback?type=email_change`
    
    // Ensure the redirect URL is valid
    try {
      new URL(emailRedirectTo)
    } catch {
      return NextResponse.json(
        { error: 'Invalid site URL configuration. Please contact support.' },
        { status: 500 }
      )
    }

    // Update user email - Supabase will automatically send verification email to new address
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
    })

    if (error) {
      // Handle rate limiting
      if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment before requesting another email change.' },
          { status: 429 }
        )
      }

      // Handle email already in use
      if (error.message.includes('already registered') || error.message.includes('User already registered') || error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'An account with this email address already exists.' },
          { status: 409 }
        )
      }

      // Check for email sending errors
      if (error.message.includes('email') && (error.message.includes('send') || error.message.includes('deliver'))) {
        console.error('Email sending error:', error)
        return NextResponse.json(
          { error: 'Failed to send verification email. Please try again or contact support if the problem persists.' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: getAuthErrorMessage(error) || 'Failed to update email address' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Please check your new email address to verify the change. A verification link has been sent.',
      email: data.user?.email,
      newEmail: newEmail,
    })
  } catch (error) {
    console.error('Change email error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}



