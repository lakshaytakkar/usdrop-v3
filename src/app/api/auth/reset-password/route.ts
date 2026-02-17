import { NextResponse } from 'next/server'
import { validatePassword } from '@/lib/utils/validation'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

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
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      if (error.message?.includes('session') || error.message?.includes('not authenticated')) {
        return NextResponse.json(
          { error: 'No active session found. Please click the password reset link from your email again.' },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { error: error.message || 'Failed to reset password' },
        { status: 400 }
      )
    }

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
