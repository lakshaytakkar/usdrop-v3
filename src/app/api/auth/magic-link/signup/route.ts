import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'Magic link signup is currently unavailable. Please use email and password to sign up.' },
    { status: 503 }
  )
}
