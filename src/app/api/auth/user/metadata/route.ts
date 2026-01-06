import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { UserMetadataApiResponse } from '@/types/user-metadata'

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

    // Get user profile with subscription plan information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        username,
        avatar_url,
        internal_role,
        subscription_plan_id,
        account_type,
        status,
        onboarding_completed,
        subscription_status,
        subscription_plans (
          slug,
          name
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

    // Determine plan: subscription_plans.slug → account_type → 'free'
    const subscriptionPlanData = profile.subscription_plans as unknown
    const subscriptionPlan = Array.isArray(subscriptionPlanData)
      ? subscriptionPlanData[0] as { slug: string; name: string } | undefined
      : subscriptionPlanData as { slug: string; name: string } | null

    const plan = subscriptionPlan?.slug || profile.account_type || 'free'
    const planName = subscriptionPlan?.name || (profile.account_type === 'pro' ? 'Pro' : 'Free')

    // Determine user type
    const isInternal = profile.internal_role !== null && profile.internal_role !== undefined
    const isExternal = !isInternal

    // Build response
    const response: UserMetadataApiResponse = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      username: profile.username,
      avatar_url: profile.avatar_url,
      is_internal: isInternal,
      internal_role: profile.internal_role as 'superadmin' | 'admin' | 'manager' | 'executive' | null,
      is_external: isExternal,
      plan,
      plan_name: planName,
      status: (profile.status as 'active' | 'inactive' | 'suspended') || 'active',
      onboarding_completed: profile.onboarding_completed ?? false,
      subscription_status: profile.subscription_status,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching user metadata:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

