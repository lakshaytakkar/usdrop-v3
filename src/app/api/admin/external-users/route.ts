import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { hashPassword } from '@/lib/auth'
import sql from '@/lib/db'
import { mapExternalUserFromDB } from '@/lib/utils/user-helpers'
import crypto from 'crypto'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        subscription_plans (
          id,
          name,
          slug,
          price_monthly,
          features,
          trial_days
        )
      `)
      .is('internal_role', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching external users:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json([])
    }

    const users = data.map((user: any) => mapExternalUserFromDB(user))

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error in GET /api/admin/external-users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        subscription_plans (
          id,
          name,
          slug,
          price_monthly,
          features,
          trial_days
        )
      `)
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching created external user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const user = mapExternalUserFromDB(data)

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/external-users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
