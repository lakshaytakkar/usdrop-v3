import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { sql } from '@/lib/db/index'
import { UserMetadataApiResponse } from '@/types/user-metadata'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await sql`
      SELECT p.id, p.email, p.full_name, p.username, p.avatar_url,
             p.internal_role, p.subscription_plan_id, p.account_type,
             p.status, p.onboarding_completed, p.subscription_status,
             sp.slug as plan_slug, sp.name as plan_name
      FROM profiles p
      LEFT JOIN subscription_plans sp ON p.subscription_plan_id = sp.id
      WHERE p.id = ${user.id}
      LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    const profile = result[0]
    const plan = profile.plan_slug || profile.account_type || 'free'
    const planName = profile.plan_name || (profile.account_type === 'pro' ? 'Pro' : 'Free')

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
