import { NextResponse } from 'next/server'
import { validateEmail } from '@/lib/utils/validation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { newEmail } = await request.json()

    if (!newEmail) {
      return NextResponse.json(
        { error: 'New email address is required' },
        { status: 400 }
      )
    }

    const emailValidation = validateEmail(newEmail)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to change your email address.' },
        { status: 401 }
      )
    }

    if (user.email.toLowerCase() === newEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'New email address must be different from your current email.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ email: newEmail })

    if (error) {
      if (error.message?.includes('already') || error.message?.includes('exists')) {
        return NextResponse.json(
          { error: 'An account with this email address already exists.' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: error.message || 'Failed to update email' },
        { status: 400 }
      )
    }

    await supabaseAdmin
      .from('profiles')
      .update({ email: newEmail.toLowerCase() })
      .eq('id', user.id)

    return NextResponse.json({
      message: 'Email address updated successfully.',
      email: user.email,
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
