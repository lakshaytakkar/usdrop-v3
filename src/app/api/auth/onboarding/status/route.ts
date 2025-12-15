import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { onboarding_completed: false },
        { status: 200 }
      )
    }

    // Check onboarding status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (profileError) {
      // If profile doesn't exist, onboarding is not completed
      return NextResponse.json(
        { onboarding_completed: false },
        { status: 200 }
      )
    }

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

