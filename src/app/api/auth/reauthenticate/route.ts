import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getCurrentUser } from '@/lib/auth'
import { sql } from '@/lib/db/index'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to reauthenticate.' }, { status: 401 })
    }

    if (!password) {
      return NextResponse.json({ error: 'Password is required for reauthentication.' }, { status: 400 })
    }

    const result = await sql`SELECT password_hash FROM profiles WHERE id = ${user.id} LIMIT 1`
    if (result.length === 0 || !result[0].password_hash) {
      return NextResponse.json({ error: 'Invalid password. Please try again.' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, result[0].password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid password. Please try again.' }, { status: 401 })
    }

    return NextResponse.json({ message: 'Reauthentication successful', authenticated: true })
  } catch (error) {
    console.error('Reauthentication error:', error)
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 })
  }
}
