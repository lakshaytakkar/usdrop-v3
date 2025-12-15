import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validateEmail } from '@/lib/utils/validation'
import { getAuthErrorMessage, isEmailVerificationRequired } from '@/lib/utils/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

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

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Handle specific errors
      if (isEmailVerificationRequired(error)) {
        return NextResponse.json(
          { 
            error: 'Please verify your email before signing in. Check your inbox for a confirmation link.',
            requiresVerification: true,
            email,
          },
          { status: 403 }
        )
      }

      if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        return NextResponse.json(
          { error: 'Too many sign-in attempts. Please wait a moment and try again.' },
          { status: 429 }
        )
      }

      // Generic error for invalid credentials (security best practice)
      if (error.message.includes('Invalid login credentials') || error.message.includes('invalid credentials')) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { error: getAuthErrorMessage(error) || 'Failed to sign in' },
        { status: 400 }
      )
    }

    // Check if user is internal and onboarding status
    let isInternal = false
    let requiresOnboarding = false

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('internal_role, onboarding_completed')
        .eq('id', data.user.id)
        .single()
      
      isInternal = profile?.internal_role !== null && profile?.internal_role !== undefined
      
      // Check if onboarding is needed (for existing users who haven't completed onboarding)
      requiresOnboarding = !profile?.onboarding_completed && !isInternal
    }

    return NextResponse.json({
      message: 'Signed in successfully',
      user: data.user,
      session: data.session,
      isInternal,
      requiresOnboarding,
    })
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
