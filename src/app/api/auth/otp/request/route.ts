import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'OTP authentication is currently unavailable. Please use email and password to sign in.' },
    { status: 503 }
  )
}
