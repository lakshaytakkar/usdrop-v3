import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validateEmail } from '@/lib/utils/validation'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate input
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
    const emailRedirectTo = `${siteUrl}/auth/callback?type=signup`
    
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
    const adminClient = createAdminClient()

    // Check if user already exists and their verification status
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers()
    const existingUser = users?.find(u => u.email?.toLowerCase() === email.toLowerCase())

    // If user exists and is verified, return error
    if (existingUser && existingUser.email_confirmed_at) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 409 }
      )
    }

    // Use signInWithOtp for passwordless signup (magic link)
    // This will create the user when they click the magic link if they don't exist
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo,
        shouldCreateUser: true, // Create user when they click the magic link
      },
    })

    if (error) {
      // Handle specific Supabase errors
      if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment and try again.' },
          { status: 429 }
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
        { error: error.message || 'Failed to send magic link. Please try again.' },
        { status: 400 }
      )
    }

    // Always return success message (for security, don't reveal if user exists)
    return NextResponse.json({
      message: 'Check your email for a magic link to verify your account.',
      success: true,
    })
  } catch (error) {
    console.error('Magic link signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

