import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import sql from '@/lib/db'
import { mapExternalUserFromDB } from '@/lib/utils/user-helpers'
import crypto from 'crypto'
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

export async function GET() {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult

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
      WHERE p.internal_role IS NULL
      ORDER BY p.created_at DESC
    `

    if (!rows || rows.length === 0) {
      return NextResponse.json([])
    }

    const users = rows.map((row: any) => mapExternalUserFromDB(mapRowToUserWithPlan(row)))

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error in GET /api/admin/external-users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const body = await request.json()
    const { 
      name, 
      email, 
      password,
      plan = 'free', 
      status = 'active',
      credits = 0,
      phoneNumber,
      username,
      avatarUrl,
      isTrial = false,
      trialEndsAt,
      subscriptionStartDate,
      subscriptionEndDate,
    } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    const existing = await sql`SELECT id FROM profiles WHERE email = ${email} LIMIT 1`
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const userId = crypto.randomUUID()

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

    const startDate = subscriptionStartDate ? new Date(subscriptionStartDate) : new Date()
    let endDate = subscriptionEndDate ? new Date(subscriptionEndDate) : null
    let calculatedTrialEndsAt = trialEndsAt ? new Date(trialEndsAt) : null

    if (isTrial && !calculatedTrialEndsAt && planData.trial_days > 0) {
      calculatedTrialEndsAt = new Date(startDate)
      calculatedTrialEndsAt.setDate(calculatedTrialEndsAt.getDate() + planData.trial_days)
    }

    if (!endDate) {
      endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + 1)
    }

    if (endDate < startDate) {
      return NextResponse.json(
        { error: 'Subscription end date must be after start date' },
        { status: 400 }
      )
    }

    await sql`
      INSERT INTO profiles (
        id, email, full_name, password_hash, internal_role,
        subscription_plan_id, subscription_status, subscription_started_at, subscription_ends_at,
        status, credits, phone_number, username, avatar_url,
        is_trial, trial_ends_at, created_at, updated_at
      ) VALUES (
        ${userId}, ${email}, ${name}, ${passwordHash}, ${null},
        ${planData.id}, ${isTrial ? 'trial' : 'active'}, ${startDate.toISOString()}, ${endDate.toISOString()},
        ${status}, ${credits}, ${phoneNumber || null}, ${username || null}, ${avatarUrl || null},
        ${isTrial}, ${calculatedTrialEndsAt ? calculatedTrialEndsAt.toISOString() : null},
        ${new Date().toISOString()}, ${new Date().toISOString()}
      )
    `

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
      WHERE p.id = ${userId}
    `

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch created user' }, { status: 500 })
    }

    const user = mapExternalUserFromDB(mapRowToUserWithPlan(rows[0]))

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/external-users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
