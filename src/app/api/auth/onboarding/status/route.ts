import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { sql } from '@/lib/db/index'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ onboarding_completed: false }, { status: 200 })
    }

    const result = await sql`
      SELECT onboarding_completed FROM profiles WHERE id = ${user.id} LIMIT 1
    `

    return NextResponse.json({
      onboarding_completed: result[0]?.onboarding_completed || false,
    })
  } catch (error) {
    console.error('Onboarding status check error:', error)
    return NextResponse.json({ onboarding_completed: false }, { status: 200 })
  }
}
