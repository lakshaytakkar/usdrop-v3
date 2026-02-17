import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { mapExternalUserFromDB } from '@/lib/utils/user-helpers'
import crypto from 'crypto'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET() {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult

    const { data: rows, error } = await supabaseAdmin
      .from('profiles')
      .select('*, subscription_plans(id, name, slug, price_monthly, features, trial_days)')
      .is('internal_role', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching external users:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json([])
    }

    const users = rows.map((row: any) => mapExternalUserFromDB(row))

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

    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const userId = crypto.randomUUID()

    const { data: planResult } = await supabaseAdmin
      .from('subscription_plans')
      .select('id, trial_days')
      .eq('slug', plan)
      .limit(1)

    if (!planResult || planResult.length === 0) {
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

    const now = new Date().toISOString()

    await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: name,
        password_hash: passwordHash,
        internal_role: null,
        subscription_plan_id: planData.id,
        subscription_status: isTrial ? 'trial' : 'active',
        subscription_started_at: startDate.toISOString(),
        subscription_ends_at: endDate.toISOString(),
        status,
        credits,
        phone_number: phoneNumber || null,
        username: username || null,
        avatar_url: avatarUrl || null,
        is_trial: isTrial,
        trial_ends_at: calculatedTrialEndsAt ? calculatedTrialEndsAt.toISOString() : null,
        created_at: now,
        updated_at: now,
      })

    const { data: rows } = await supabaseAdmin
      .from('profiles')
      .select('*, subscription_plans(id, name, slug, price_monthly, features, trial_days)')
      .eq('id', userId)

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch created user' }, { status: 500 })
    }

    const user = mapExternalUserFromDB(rows[0])

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/external-users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
