import { NextResponse } from 'next/server'
import { validateEmail, validatePassword } from '@/lib/utils/validation'
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth'
import sql from '@/lib/db'

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

    const existing = await sql`SELECT id FROM profiles WHERE LOWER(email) = LOWER(${email}) LIMIT 1`
    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists. Please sign in instead.' }, { status: 409 })
    }

    const password_hash = await hashPassword(password)

    const freePlan = await sql`SELECT id FROM subscription_plans WHERE slug = 'free' LIMIT 1`
    const planId = freePlan.length > 0 ? freePlan[0].id : null

    const result = await sql`
      INSERT INTO profiles (email, password_hash, full_name, subscription_plan_id, account_type, status)
      VALUES (${email.toLowerCase()}, ${password_hash}, ${full_name || null}, ${planId}, 'free', 'active')
      RETURNING id, email, full_name
    `

    const user = result[0]
    const token = await createSession(user.id, request)
    await setSessionCookie(token)

    return NextResponse.json({
      message: 'Account created successfully',
      user: { id: user.id, email: user.email, full_name: user.full_name },
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 })
  }
}
