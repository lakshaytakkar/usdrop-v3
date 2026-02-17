import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { UserMetadataApiResponse } from '@/types/user-metadata'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        id, email, full_name, username, avatar_url,
        internal_role, subscription_plan_id, account_type,
        status, onboarding_completed, subscription_status,
        subscription_plans!profiles_subscription_plan_id_fkey (slug, name)
      `)
      .eq('id', user.id)
      .single()

    if (error || !profile) {
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    const planData = (profile as any).subscription_plans
    const plan = planData?.slug || profile.account_type || 'free'
    const planName = planData?.name || (profile.account_type === 'pro' ? 'Pro' : 'Free')

    const isInternal = profile.internal_role !== null && profile.internal_role !== undefined
    const isExternal = !isInternal

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
