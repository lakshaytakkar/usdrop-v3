import { NextResponse } from 'next/server'
import { validateEmail } from '@/lib/utils/validation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getUserWithPlan } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 })
    }

    const { data: profileCheck } = await supabaseAdmin
      .from('profiles')
      .select('status')
      .eq('email', email.toLowerCase())
      .single()

    if (profileCheck?.status === 'suspended') {
      return NextResponse.json({ error: 'Your account has been suspended. Please contact support.' }, { status: 403 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const profile = await getUserWithPlan(data.user.id)
    const isInternal = profile?.internal_role !== null && profile?.internal_role !== undefined
    const requiresOnboarding = !profile?.onboarding_completed && !isInternal
    const plan = profile?.plan_slug || profile?.account_type || 'free'
    const planName = profile?.plan_name || 'Free'

    return NextResponse.json({
      message: 'Signed in successfully',
      user: { id: data.user.id, email: data.user.email, user_metadata: { full_name: profile?.full_name } },
      isInternal,
      requiresOnboarding,
      plan,
      planName,
    })
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 })
  }
}
