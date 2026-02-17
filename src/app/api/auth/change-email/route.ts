import { NextResponse } from 'next/server'
import { validateEmail } from '@/lib/utils/validation'
import { getCurrentUser } from '@/lib/auth'
import { sql } from '@/lib/db/index'

export async function POST(request: Request) {
  try {
    const { newEmail } = await request.json()

    if (!newEmail) {
      return NextResponse.json({ error: 'New email address is required' }, { status: 400 })
    }

    const emailValidation = validateEmail(newEmail)
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 })
    }

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to change your email address.' }, { status: 401 })
    }

    if (user.email.toLowerCase() === newEmail.toLowerCase()) {
      return NextResponse.json({ error: 'New email address must be different from your current email.' }, { status: 400 })
    }

    const existing = await sql`SELECT id FROM profiles WHERE email = ${newEmail.toLowerCase()} LIMIT 1`
    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email address already exists.' }, { status: 409 })
    }

    await sql`UPDATE profiles SET email = ${newEmail.toLowerCase()}, updated_at = NOW() WHERE id = ${user.id}`

    return NextResponse.json({
      message: 'Email address updated successfully.',
      email: user.email,
      newEmail: newEmail,
    })
  } catch (error) {
    console.error('Change email error:', error)
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 })
  }
}
