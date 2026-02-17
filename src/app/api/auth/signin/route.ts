import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { validateEmail } from '@/lib/utils/validation'
import { getUserWithPlan, createSessionToken } from '@/lib/auth'
import { sql } from '@/lib/db/index'

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

    const result = await sql`
      SELECT id, email, password_hash, status FROM profiles 
      WHERE email = ${email.toLowerCase()} LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const user = result[0]

    if (user.status === 'suspended') {
      return NextResponse.json({ error: 'Your account has been suspended. Please contact support.' }, { status: 403 })
    }

    if (!user.password_hash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash)
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = createSessionToken(user.id)
    const cookieStore = await cookies()
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    })

    const profile = await getUserWithPlan(user.id)
    const isInternal = profile?.internal_role !== null && profile?.internal_role !== undefined
    const requiresOnboarding = !profile?.onboarding_completed && !isInternal
    const plan = profile?.plan_slug || profile?.account_type || 'free'
    const planName = profile?.plan_name || 'Free'

    return NextResponse.json({
      message: 'Signed in successfully',
      user: { id: user.id, email: user.email, user_metadata: { full_name: profile?.full_name } },
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
