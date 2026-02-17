import { NextResponse } from 'next/server'
import { validateEmail, validatePassword } from '@/lib/utils/validation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.errors[0], errors: passwordValidation.errors }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: full_name || null },
      },
    })

    if (error) {
      if (error.message?.includes('already registered') || error.message?.includes('already been registered')) {
        return NextResponse.json({ error: 'An account with this email already exists. Please sign in instead.' }, { status: 409 })
      }
      return NextResponse.json({ error: error.message || 'Failed to create account' }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    const { data: freePlan } = await supabaseAdmin
      .from('subscription_plans')
      .select('id')
      .eq('slug', 'free')
      .single()

    if (freePlan) {
      await supabaseAdmin
        .from('profiles')
        .update({ subscription_plan_id: freePlan.id })
        .eq('id', data.user.id)
    }

    return NextResponse.json({
      message: 'Account created successfully',
      user: { id: data.user.id, email: data.user.email, full_name: full_name || null },
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 })
  }
}
