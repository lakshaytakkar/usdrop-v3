import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { validatePassword } from '@/lib/utils/validation'
import { getCurrentUser } from '@/lib/auth'
import { sql } from '@/lib/db/index'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({
        error: passwordValidation.errors[0] || 'Invalid password',
        errors: passwordValidation.errors,
      }, { status: 400 })
    }

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to reset your password.' }, { status: 401 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await sql`UPDATE profiles SET password_hash = ${passwordHash}, updated_at = NOW() WHERE id = ${user.id}`

    const cookieStore = await cookies()
    cookieStore.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return NextResponse.json({
      message: 'Password reset successfully. Please sign in with your new password.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 })
  }
}
