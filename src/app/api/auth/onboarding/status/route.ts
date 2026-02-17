import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { onboarding_completed: false },
        { status: 200 }
      )
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      onboarding_completed: profile?.onboarding_completed || false,
    })
  } catch (error) {
    console.error('Onboarding status check error:', error)
    return NextResponse.json(
      { onboarding_completed: false },
      { status: 200 }
    )
  }
}
