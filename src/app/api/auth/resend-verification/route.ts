import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json({
    message: 'If your email needs verification, a new verification link has been sent.',
  })
}
