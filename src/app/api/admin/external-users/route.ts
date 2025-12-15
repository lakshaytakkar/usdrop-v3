import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { mapExternalUserFromDB } from '@/lib/utils/user-helpers'

// GET /api/admin/external-users - List all external users
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

    // Transform to match ExternalUser interface using helper
    const users = data.map((user) => mapExternalUserFromDB(user))

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error in GET /api/admin/external-users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/external-users - Create a new external user
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

    // Create user in auth.users first using service role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
      },
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'User not created in auth system' }, { status: 500 })
    }

    // Wait a bit for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 500))

    // Get plan ID and details from slug
    const { data: planData, error: planError } = await supabaseAdmin
      .from('subscription_plans')
      .select('id, trial_days')
      .eq('slug', plan)
      .single()

    if (planError && planError.code !== 'PGRST116') {
      console.error('Error fetching plan:', planError)
      return NextResponse.json(
        { error: `Plan "${plan}" not found` },
        { status: 400 }
      )
    }

    if (!planData) {
      return NextResponse.json(
        { error: `Plan "${plan}" not found` },
        { status: 400 }
      )
    }

    // Auto-calculate dates if not provided
    const startDate = subscriptionStartDate ? new Date(subscriptionStartDate) : new Date()
    let endDate = subscriptionEndDate ? new Date(subscriptionEndDate) : null
    let calculatedTrialEndsAt = trialEndsAt ? new Date(trialEndsAt) : null

    // If trial and no trial end date provided, calculate from plan
    if (isTrial && !calculatedTrialEndsAt && planData.trial_days > 0) {
      calculatedTrialEndsAt = new Date(startDate)
      calculatedTrialEndsAt.setDate(calculatedTrialEndsAt.getDate() + planData.trial_days)
    }

    // If no end date provided, calculate from start date (1 month default)
    if (!endDate) {
      endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + 1)
    }

    // Validate subscription dates
    if (endDate < startDate) {
      return NextResponse.json(
        { error: 'Subscription end date must be after start date' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: name,
        internal_role: null, // External user
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', authData.user.id)
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
      .single()

    if (error) {
      console.error('Error creating external user:', error)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Use helper to map response
    const user = mapExternalUserFromDB(data)

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/external-users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

