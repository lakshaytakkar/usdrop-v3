import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export interface AuthUser {
  id: string
  email: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  account_type: string
  internal_role: string | null
  status: string
  onboarding_completed: boolean
  subscription_plan_id: string | null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) return null

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, username, avatar_url, account_type, internal_role, status, onboarding_completed, subscription_plan_id')
      .eq('id', user.id)
      .eq('status', 'active')
      .single()

    if (!profile) return null
    return profile as AuthUser
  } catch {
    return null
  }
}

export async function getUserWithPlan(userId: string) {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select(`
      id, email, full_name, username, avatar_url,
      account_type, internal_role, status, onboarding_completed,
      subscription_plan_id, onboarding_progress,
      subscription_plans!profiles_subscription_plan_id_fkey (slug, name, price_monthly)
    `)
    .eq('id', userId)
    .single()

  if (!data) return null

  const plan = (data as any).subscription_plans
  return {
    ...data,
    plan_slug: plan?.slug || null,
    plan_name: plan?.name || null,
    price_monthly: plan?.price_monthly || null,
    subscription_plans: undefined,
  }
}
