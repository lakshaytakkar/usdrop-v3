import { NextResponse } from 'next/server'
import { validatePassword } from '@/lib/utils/validation'
import { getCurrentUser, hashPassword, getSessionToken, invalidateSession, clearSessionCookie } from '@/lib/auth'
import sql from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { 
          error: passwordValidation.errors[0] || 'Invalid password',
          errors: passwordValidation.errors
        },
        { status: 400 }
      )
    }

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No active session found. Please click the password reset link from your email again.' },
        { status: 401 }
      )
    }

    const password_hash = await hashPassword(password)
    await sql`UPDATE profiles SET password_hash = ${password_hash}, updated_at = NOW() WHERE id = ${user.id}`

    const token = await getSessionToken()
    if (token) {
      await invalidateSession(token)
    }
    await clearSessionCookie()

    return NextResponse.json({
      message: 'Password reset successfully. Please sign in with your new password.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
