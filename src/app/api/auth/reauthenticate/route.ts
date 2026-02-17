import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to reauthenticate.' },
        { status: 401 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required for reauthentication.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Invalid password. Please try again.' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: 'Reauthentication successful',
      authenticated: true,
    })
  } catch (error) {
    console.error('Reauthentication error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
