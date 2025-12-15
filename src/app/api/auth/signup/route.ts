import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validateEmail, validatePassword } from '@/lib/utils/validation'
import { getAuthErrorMessage } from '@/lib/utils/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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
    const adminClient = createAdminClient()

    // Check if user already exists and their verification status
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers()
    const existingUser = users?.find(u => u.email?.toLowerCase() === email.toLowerCase())

    // If user exists but email is not verified, we should resend verification instead
    if (existingUser && !existingUser.email_confirmed_at) {
      // User exists but not verified - resend verification email
      const { error: resendError } = await adminClient.auth.admin.generateLink({
        type: 'signup',
        email: email,
        password: password,
        options: {
          redirectTo: emailRedirectTo,
        },
      })

      if (resendError) {
        // Fallback to signUp which may still send verification
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo,
          },
        })

        if (error) {
          // Handle specific Supabase errors
          if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
            return NextResponse.json(
              { error: 'Too many signup attempts. Please wait a moment and try again.' },
              { status: 429 }
            )
          }

          // Don't reveal if user exists for security
          return NextResponse.json(
            { error: getAuthErrorMessage(error) || 'Failed to create account' },
            { status: 400 }
          )
        }

        return NextResponse.json({
          message: 'Please check your email to confirm your account before signing in.',
          requiresConfirmation: true,
          email: data.user?.email,
        })
      }

      return NextResponse.json({
        message: 'Please check your email to confirm your account before signing in.',
        requiresConfirmation: true,
        email: email,
      })
    }

    // If user exists and is verified, return error
    if (existingUser && existingUser.email_confirmed_at) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 409 }
      )
    }

    // Create new user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
      },
    })

    if (error) {
      // Handle specific Supabase errors
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        // Check if they're verified
        if (existingUser?.email_confirmed_at) {
          return NextResponse.json(
            { error: 'An account with this email already exists. Please sign in instead.' },
            { status: 409 }
          )
        }
        // Not verified - treat as requires confirmation
        return NextResponse.json({
          message: 'Please check your email to confirm your account before signing in.',
          requiresConfirmation: true,
          email: email,
        })
      }

      if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        return NextResponse.json(
          { error: 'Too many signup attempts. Please wait a moment and try again.' },
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
        { error: getAuthErrorMessage(error) || 'Failed to create account' },
        { status: 400 }
      )
    }

    // Check if email confirmation is required
    // If no session is returned, email confirmation is required
    if (data.user && !data.session) {
      return NextResponse.json({
        message: 'Please check your email to confirm your account before signing in.',
        requiresConfirmation: true,
        email: data.user.email,
      })
    }

    // User created and auto-signed in (if email confirmation is disabled)
    return NextResponse.json({
      message: 'Account created successfully',
      user: data.user,
      session: data.session,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
