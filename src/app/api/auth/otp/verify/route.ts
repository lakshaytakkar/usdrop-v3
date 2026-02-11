import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'OTP verification is currently unavailable. Please use email and password to sign in.' },
    { status: 503 }
  )
}
