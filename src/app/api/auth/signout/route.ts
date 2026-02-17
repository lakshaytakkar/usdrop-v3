import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
    return NextResponse.json({ message: 'Signed out successfully' })
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json({ message: 'Signed out successfully' })
  }
}
