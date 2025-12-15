import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile with plan information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        username,
        avatar_url,
        account_type,
        subscription_plan_id,
        subscription_plans (
          id,
          name,
          slug,
          price_monthly
        )
      `)
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    // subscription_plans may be returned as array from Supabase
    const subscriptionPlanData = profile.subscription_plans as unknown
    const subscriptionPlan = Array.isArray(subscriptionPlanData)
      ? subscriptionPlanData[0] as { id: string; name: string; slug: string; price_monthly: number } | undefined
      : subscriptionPlanData as { id: string; name: string; slug: string; price_monthly: number } | null

    return NextResponse.json({
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      username: profile.username,
      avatar_url: profile.avatar_url,
      plan: subscriptionPlan?.slug || profile.account_type || 'free',
      planName: subscriptionPlan?.name || 'Free',
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

