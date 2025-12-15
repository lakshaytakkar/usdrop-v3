import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validateEmail } from '@/lib/utils/validation'
import { getAuthErrorMessage } from '@/lib/utils/auth'

export async function POST(request: Request) {
  try {
    const { email, token, type = 'signin' } = await request.json()

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
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

    // Token validation (should be 6 digits)
    if (!/^\d{6}$/.test(token)) {
      return NextResponse.json(
        { error: 'Invalid verification code format' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify OTP
    // Note: signInWithOtp always uses type 'email', so we verify with 'email' for both signup and signin
    // Supabase automatically creates the user if they don't exist when using signInWithOtp
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) {
      // Handle specific errors
      if (error.message.includes('expired') || error.message.includes('Expired')) {
        return NextResponse.json(
          { error: 'This verification code has expired. Please request a new one.' },
          { status: 400 }
        )
      }

      if (error.message.includes('invalid') || error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: 'Invalid verification code. Please check and try again.' },
          { status: 400 }
        )
      }

      if (error.message.includes('already used') || error.message.includes('used')) {
        return NextResponse.json(
          { error: 'This verification code has already been used. Please request a new one.' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: getAuthErrorMessage(error) || 'Failed to verify code' },
        { status: 400 }
      )
    }

    if (!data.session || !data.user) {
      return NextResponse.json(
        { error: 'Verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Check if profile exists, create if it doesn't (for new signups)
    let profile = null
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('internal_role, onboarding_completed')
      .eq('id', data.user.id)
      .single()

    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist - create it for new signup
      if (type === 'signup') {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email || '',
            status: 'active',
            internal_role: null,
            account_type: 'free',
            onboarding_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (insertError) {
          console.error('Error creating profile:', insertError)
          // Continue anyway - profile creation failure shouldn't block login
        } else {
          profile = { internal_role: null, onboarding_completed: false }
        }
      }
    } else if (existingProfile) {
      profile = existingProfile
    }

    // Check if user is internal (has internal_role in profiles table)
    let isInternal = false
    let requiresOnboarding = false

    if (profile) {
      isInternal = profile.internal_role !== null && profile.internal_role !== undefined
      
      // Check if onboarding is needed
      // For new signups, always require onboarding
      // For signins, check if onboarding was completed
      if (type === 'signup') {
        requiresOnboarding = true
      } else {
        requiresOnboarding = !profile.onboarding_completed
      }
    } else if (type === 'signup') {
      // If profile creation failed but it's a signup, still require onboarding
      requiresOnboarding = true
    }

    return NextResponse.json({
      message: type === 'signup' ? 'Account created successfully' : 'Signed in successfully',
      user: data.user,
      session: data.session,
      isInternal,
      requiresOnboarding,
    })
  } catch (error) {
    console.error('OTP verify error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

