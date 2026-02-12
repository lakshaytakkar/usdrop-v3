import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import sql from '@/lib/db'
import { mapExternalUserFromDB } from '@/lib/utils/user-helpers'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

function mapRowToUserWithPlan(row: any) {
  return {
    ...row,
    subscription_plans: row.plan_id ? {
      id: row.plan_id,
      name: row.plan_name,
      slug: row.plan_slug,
      price_monthly: row.plan_price_monthly,
      features: row.plan_features,
      trial_days: row.plan_trial_days,
    } : null
  }
}

async function fetchUserWithPlan(id: string) {
  const rows = await sql`
    SELECT
      p.*,
      sp.id AS plan_id,
      sp.name AS plan_name,
      sp.slug AS plan_slug,
      sp.price_monthly AS plan_price_monthly,
      sp.features AS plan_features,
      sp.trial_days AS plan_trial_days
    FROM profiles p
    LEFT JOIN subscription_plans sp ON p.subscription_plan_id = sp.id
    WHERE p.id = ${id} AND p.internal_role IS NULL
  `
  return rows.length > 0 ? rows[0] : null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    const row = await fetchUserWithPlan(id)

    if (!row) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = mapExternalUserFromDB(mapRowToUserWithPlan(row))

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in GET /api/admin/external-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params
    const body = await request.json()
    const { 
      name, 
      email, 
      plan, 
      status, 
      credits, 
      phoneNumber,
      username,
      avatarUrl,
      isTrial,
      trialEndsAt,
      subscriptionStartDate,
      subscriptionEndsAt,
      password,
    } = body

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updates.full_name = name
    if (email !== undefined) updates.email = email
    if (status !== undefined) {
      const validStatuses = ['active', 'inactive', 'suspended']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be one of: active, inactive, suspended' },
          { status: 400 }
        )
      }
      updates.status = status
    }
    if (credits !== undefined) updates.credits = credits
    if (phoneNumber !== undefined) updates.phone_number = phoneNumber || null
    if (username !== undefined) updates.username = username || null
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl || null
    if (subscriptionStartDate !== undefined) {
      updates.subscription_started_at = subscriptionStartDate ? new Date(subscriptionStartDate).toISOString() : null
    }
    if (subscriptionEndsAt !== undefined) {
      updates.subscription_ends_at = subscriptionEndsAt ? new Date(subscriptionEndsAt).toISOString() : null
    }
    if (isTrial !== undefined) {
      updates.is_trial = isTrial
      updates.subscription_status = isTrial ? 'trial' : 'active'
    }
    if (trialEndsAt !== undefined) {
      updates.trial_ends_at = trialEndsAt ? new Date(trialEndsAt).toISOString() : null
    }

    if (password !== undefined && password.trim() !== '') {
      const passwordHash = await hashPassword(password)
      await sql`UPDATE profiles SET password_hash = ${passwordHash} WHERE id = ${id}`
    }

    if (updates.subscription_started_at && updates.subscription_ends_at) {
      const startDate = new Date(updates.subscription_started_at as string)
      const endDate = new Date(updates.subscription_ends_at as string)
      if (endDate < startDate) {
        return NextResponse.json(
          { error: 'Subscription end date must be after start date' },
          { status: 400 }
        )
      }
    }

    if (plan !== undefined) {
      const planResult = await sql`
        SELECT id, trial_days FROM subscription_plans WHERE slug = ${plan} LIMIT 1
      `

      if (planResult.length === 0) {
        return NextResponse.json(
          { error: `Plan "${plan}" not found` },
          { status: 400 }
        )
      }

      const planData = planResult[0]
      updates.subscription_plan_id = planData.id

      if (isTrial !== undefined && isTrial && planData.trial_days > 0) {
        const startDate = updates.subscription_started_at 
          ? new Date(updates.subscription_started_at as string)
          : new Date()
        const calculatedTrialEndsAt = new Date(startDate)
        calculatedTrialEndsAt.setDate(calculatedTrialEndsAt.getDate() + planData.trial_days)
        updates.trial_ends_at = calculatedTrialEndsAt.toISOString()
      }
    }

    const setClauses = Object.entries(updates)
      .map(([key], i) => `"${key}" = $${i + 1}`)
      .join(', ')
    const values = Object.values(updates)

    const updateQuery = `UPDATE profiles SET ${setClauses} WHERE id = $${values.length + 1} AND internal_role IS NULL RETURNING id`
    const updateResult = await sql.unsafe(updateQuery, [...values, id])

    if (!updateResult || updateResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const row = await fetchUserWithPlan(id)

    if (!row) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = mapExternalUserFromDB(mapRowToUserWithPlan(row))

    return NextResponse.json(user)
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }
    console.error('Error in PATCH /api/admin/external-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    await sql`DELETE FROM profiles WHERE id = ${id} AND internal_role IS NULL`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/external-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
