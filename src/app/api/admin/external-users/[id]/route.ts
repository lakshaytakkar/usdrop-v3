import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { mapExternalUserFromDB } from '@/lib/utils/user-helpers'

// GET /api/admin/external-users/[id] - Get a single external user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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
      .eq('id', id)
      .is('internal_role', null)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      console.error('Error fetching external user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Use helper to map response
    const user = mapExternalUserFromDB(data)

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in GET /api/admin/external-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/external-users/[id] - Update an external user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    // Build update object with only provided fields
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

    // Handle password update separately if provided
    if (password !== undefined && password.trim() !== '') {
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
      
      const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(id, {
        password: password
      })

      if (passwordError) {
        console.error('Error updating password:', passwordError)
        return NextResponse.json(
          { error: 'Failed to update password: ' + passwordError.message },
          { status: 500 }
        )
      }
    }

    // Validate subscription dates
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

    // Handle plan change
    if (plan !== undefined) {
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
      
      updates.subscription_plan_id = planData.id

      // Auto-calculate trial end date if trial is enabled and plan has trial days
      if (isTrial !== undefined && isTrial && planData.trial_days > 0) {
        const startDate = updates.subscription_started_at 
          ? new Date(updates.subscription_started_at as string)
          : new Date()
        const calculatedTrialEndsAt = new Date(startDate)
        calculatedTrialEndsAt.setDate(calculatedTrialEndsAt.getDate() + planData.trial_days)
        updates.trial_ends_at = calculatedTrialEndsAt.toISOString()
      }
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .is('internal_role', null)
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
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        )
      }
      console.error('Error updating external user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Use helper to map response
    const user = mapExternalUserFromDB(data)

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in PATCH /api/admin/external-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/external-users/[id] - Delete an external user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id)
      .is('internal_role', null)

    if (error) {
      console.error('Error deleting external user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/external-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

