import { NextResponse } from 'next/server'
import { validateEmail } from '@/lib/utils/validation'
import { verifyPassword, createSession, setSessionCookie, getUserWithPlan } from '@/lib/auth'
import sql from '@/lib/db'

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

    const users = await sql`
      SELECT id, email, password_hash, full_name, status
      FROM profiles 
      WHERE LOWER(email) = LOWER(${email})
      LIMIT 1
    `

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const user = users[0]

    if (user.status === 'suspended') {
      return NextResponse.json({ error: 'Your account has been suspended. Please contact support.' }, { status: 403 })
    }

    if (!user.password_hash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await createSession(user.id, request)
    await setSessionCookie(token)

    const profile = await getUserWithPlan(user.id)
    const isInternal = profile?.internal_role !== null && profile?.internal_role !== undefined
    const requiresOnboarding = !profile?.onboarding_completed && !isInternal
    const plan = profile?.plan_slug || profile?.account_type || 'free'
    const planName = profile?.plan_name || 'Free'

    return NextResponse.json({
      message: 'Signed in successfully',
      user: { id: user.id, email: user.email, user_metadata: { full_name: user.full_name } },
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
