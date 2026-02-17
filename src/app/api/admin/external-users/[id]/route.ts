import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { mapExternalUserFromDB } from '@/lib/utils/user-helpers'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

async function fetchUserWithPlan(id: string) {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('*, subscription_plans(id, name, slug, price_monthly, features, trial_days)')
    .eq('id', id)
    .is('internal_role', null)
    .single()

  return data
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

    const user = mapExternalUserFromDB(row)

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

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateData.full_name = name
    if (email !== undefined) updateData.email = email
    if (status !== undefined) {
      const validStatuses = ['active', 'inactive', 'suspended']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be one of: active, inactive, suspended' },
          { status: 400 }
        )
      }
      updateData.status = status
    }
    if (credits !== undefined) updateData.credits = credits
    if (phoneNumber !== undefined) updateData.phone_number = phoneNumber || null
    if (username !== undefined) updateData.username = username || null
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl || null
    if (subscriptionStartDate !== undefined) {
      updateData.subscription_started_at = subscriptionStartDate ? new Date(subscriptionStartDate).toISOString() : null
    }
    if (subscriptionEndsAt !== undefined) {
      updateData.subscription_ends_at = subscriptionEndsAt ? new Date(subscriptionEndsAt).toISOString() : null
    }
    if (isTrial !== undefined) {
      updateData.is_trial = isTrial
      updateData.subscription_status = isTrial ? 'trial' : 'active'
    }
    if (trialEndsAt !== undefined) {
      updateData.trial_ends_at = trialEndsAt ? new Date(trialEndsAt).toISOString() : null
    }

    if (password !== undefined && password.trim() !== '') {
      const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(id, {
        password,
      })
      if (pwError) {
        console.error('Error updating password:', pwError)
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
      }
    }

    if (email !== undefined) {
      const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(id, {
        email,
      })
      if (emailError) {
        console.error('Error updating email in auth:', emailError)
      }
    }

    if (updateData.subscription_started_at && updateData.subscription_ends_at) {
      const startDate = new Date(updateData.subscription_started_at as string)
      const endDate = new Date(updateData.subscription_ends_at as string)
      if (endDate < startDate) {
        return NextResponse.json(
          { error: 'Subscription end date must be after start date' },
          { status: 400 }
        )
      }
    }

    if (plan !== undefined) {
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
      updateData.subscription_plan_id = planData.id

      if (isTrial !== undefined && isTrial && planData.trial_days > 0) {
        const startDate = updateData.subscription_started_at 
          ? new Date(updateData.subscription_started_at as string)
          : new Date()
        const calculatedTrialEndsAt = new Date(startDate)
        calculatedTrialEndsAt.setDate(calculatedTrialEndsAt.getDate() + planData.trial_days)
        updateData.trial_ends_at = calculatedTrialEndsAt.toISOString()
      }
    }

    const { data: updateResult, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .is('internal_role', null)
      .select('id')

    if (updateError) {
      if (updateError.code === '23505') {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        )
      }
      throw updateError
    }

    if (!updateResult || updateResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const row = await fetchUserWithPlan(id)

    if (!row) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = mapExternalUserFromDB(row)

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

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)
    if (authError) {
      console.error('Error deleting auth user:', authError)
    }

    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id)
      .is('internal_role', null)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/external-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
