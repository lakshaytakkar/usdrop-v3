import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { validateEmail, validatePassword } from '@/lib/utils/validation'
import { createSessionToken } from '@/lib/auth'
import { sql } from '@/lib/db/index'

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

    const existing = await sql`SELECT id FROM profiles WHERE email = ${email.toLowerCase()} LIMIT 1`
    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists. Please sign in instead.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const freePlan = await sql`SELECT id FROM subscription_plans WHERE slug = 'free' LIMIT 1`
    const freePlanId = freePlan.length > 0 ? freePlan[0].id : null

    const newUser = await sql`
      INSERT INTO profiles (email, password_hash, full_name, account_type, status, subscription_plan_id)
      VALUES (${email.toLowerCase()}, ${passwordHash}, ${full_name || null}, 'free', 'active', ${freePlanId})
      RETURNING id, email
    `

    if (newUser.length === 0) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    const token = createSessionToken(newUser[0].id)
    const cookieStore = await cookies()
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    })

    return NextResponse.json({
      message: 'Account created successfully',
      user: { id: newUser[0].id, email: newUser[0].email, full_name: full_name || null },
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 })
  }
}
