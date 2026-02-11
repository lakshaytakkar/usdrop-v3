import { NextResponse } from 'next/server'
import { getCurrentUser, getUserWithPlan } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getUserWithPlan(user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        username: profile.username,
        avatar_url: profile.avatar_url,
        account_type: profile.account_type || 'free',
        internal_role: profile.internal_role,
        status: profile.status || 'active',
        onboarding_completed: profile.onboarding_completed,
      },
      plan: profile.plan_slug || profile.account_type || 'free',
      planName: profile.plan_name || 'Free',
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
