import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json(
    { error: 'Google sign-in is currently unavailable. Please use email and password to sign in.' },
    { status: 503 }
  )
}
