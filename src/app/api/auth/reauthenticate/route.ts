import { NextResponse } from 'next/server'
import { getCurrentUser, verifyPassword } from '@/lib/auth'
import sql from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { password, email } = await request.json()

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to reauthenticate.' },
        { status: 401 }
      )
    }

    if (password) {
      const result = await sql`SELECT password_hash FROM profiles WHERE id = ${user.id} LIMIT 1`
      if (result.length === 0 || !result[0].password_hash) {
        return NextResponse.json(
          { error: 'Invalid password. Please try again.' },
          { status: 401 }
        )
      }

      const isValid = await verifyPassword(password, result[0].password_hash)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid password. Please try again.' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        message: 'Reauthentication successful',
        authenticated: true,
      })
    }

    return NextResponse.json(
      { error: 'Password is required for reauthentication.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Reauthentication error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
