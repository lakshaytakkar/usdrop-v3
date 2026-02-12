import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { mapPlanFromDB, mapPlanToDB } from '@/lib/utils/plan-helpers'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

// GET /api/admin/plans/[id] - Get a single subscription plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }
      console.error('Error fetching plan:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Use helper to map response
    const plan = mapPlanFromDB(data)

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error in GET /api/admin/plans/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/plans/[id] - Update a subscription plan
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params
    const body = await request.json()

    // Build update object with only provided fields
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.name !== undefined) updates.name = body.name
    if (body.slug !== undefined) {
      // Validate slug format if provided
      const { validatePlanSlug } = await import('@/lib/utils/plan-helpers')
      if (!validatePlanSlug(body.slug)) {
        return NextResponse.json(
          { error: 'Invalid slug format. Must be lowercase alphanumeric with hyphens or underscores' },
          { status: 400 }
        )
      }
      updates.slug = body.slug
    }
    if (body.description !== undefined) updates.description = body.description || null
    if (body.priceMonthly !== undefined) {
      if (body.priceMonthly < 0) {
        return NextResponse.json(
          { error: 'Monthly price must be non-negative' },
          { status: 400 }
        )
      }
      updates.price_monthly = body.priceMonthly
    }
    if (body.priceAnnual !== undefined) {
      if (body.priceAnnual !== null && body.priceAnnual < 0) {
        return NextResponse.json(
          { error: 'Annual price must be non-negative' },
          { status: 400 }
        )
      }
      updates.price_annual = body.priceAnnual ?? null
    }
    if (body.priceYearly !== undefined) {
      if (body.priceYearly !== null && body.priceYearly < 0) {
        return NextResponse.json(
          { error: 'Yearly price must be non-negative' },
          { status: 400 }
        )
      }
      updates.price_yearly = body.priceYearly ?? null
    }
    if (body.features !== undefined) {
      if (!Array.isArray(body.features)) {
        return NextResponse.json(
          { error: 'Features must be an array' },
          { status: 400 }
        )
      }
      updates.features = body.features
    }
    if (body.popular !== undefined) updates.popular = body.popular
    if (body.active !== undefined) updates.active = body.active
    if (body.isPublic !== undefined) updates.is_public = body.isPublic
    if (body.displayOrder !== undefined) updates.display_order = body.displayOrder
    if (body.keyPointers !== undefined) updates.key_pointers = body.keyPointers || null
    if (body.trialDays !== undefined) {
      if (body.trialDays < 0) {
        return NextResponse.json(
          { error: 'Trial days must be non-negative' },
          { status: 400 }
        )
      }
      updates.trial_days = body.trialDays
    }

    // Check slug uniqueness if slug is being updated
    if (updates.slug) {
      const { data: existingPlan, error: checkError } = await supabaseAdmin
        .from('subscription_plans')
        .select('id')
        .eq('slug', updates.slug as string)
        .neq('id', id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking slug uniqueness:', checkError)
        return NextResponse.json({ error: 'Failed to validate slug' }, { status: 500 })
      }

      if (existingPlan) {
        return NextResponse.json(
          { error: 'A plan with this slug already exists' },
          { status: 409 }
        )
      }
    }

    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A plan with this name or slug already exists' },
          { status: 409 }
        )
      }
      console.error('Error updating plan:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Use helper to map response
    const plan = mapPlanFromDB(data)

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error in PATCH /api/admin/plans/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/plans/[id] - Delete a subscription plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    // Check if plan is referenced by any profiles
    const { data: profiles, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('subscription_plan_id', id)
      .limit(1)

    if (checkError) {
      console.error('Error checking plan dependencies:', checkError)
      return NextResponse.json({ error: 'Failed to check plan dependencies' }, { status: 500 })
    }

    if (profiles && profiles.length > 0) {
      // Plan is in use - soft delete by setting active=false
      const { data, error } = await supabaseAdmin
        .from('subscription_plans')
        .update({
          active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
        }
        console.error('Error deactivating plan:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Plan deactivated (in use by users)',
        plan: mapPlanFromDB(data),
      })
    }

    // Plan is not in use - hard delete
    const { error } = await supabaseAdmin
      .from('subscription_plans')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }
      console.error('Error deleting plan:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Plan deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/admin/plans/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

