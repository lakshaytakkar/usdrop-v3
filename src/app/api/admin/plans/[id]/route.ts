import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { mapPlanFromDB } from '@/lib/utils/plan-helpers'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

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

    if (error || !data) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const plan = mapPlanFromDB(data)
    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error in GET /api/admin/plans/[id]:', error)
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

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (body.name !== undefined) updateData.name = body.name
    if (body.slug !== undefined) {
      const { validatePlanSlug } = await import('@/lib/utils/plan-helpers')
      if (!validatePlanSlug(body.slug)) {
        return NextResponse.json(
          { error: 'Invalid slug format. Must be lowercase alphanumeric with hyphens or underscores' },
          { status: 400 }
        )
      }
      updateData.slug = body.slug
    }
    if (body.description !== undefined) updateData.description = body.description || null
    if (body.priceMonthly !== undefined) {
      if (body.priceMonthly < 0) {
        return NextResponse.json(
          { error: 'Monthly price must be non-negative' },
          { status: 400 }
        )
      }
      updateData.price_monthly = body.priceMonthly
    }
    if (body.priceAnnual !== undefined) {
      if (body.priceAnnual !== null && body.priceAnnual < 0) {
        return NextResponse.json(
          { error: 'Annual price must be non-negative' },
          { status: 400 }
        )
      }
      updateData.price_annual = body.priceAnnual ?? null
    }
    if (body.priceYearly !== undefined) {
      if (body.priceYearly !== null && body.priceYearly < 0) {
        return NextResponse.json(
          { error: 'Yearly price must be non-negative' },
          { status: 400 }
        )
      }
      updateData.price_yearly = body.priceYearly ?? null
    }
    if (body.features !== undefined) {
      if (!Array.isArray(body.features)) {
        return NextResponse.json(
          { error: 'Features must be an array' },
          { status: 400 }
        )
      }
      updateData.features = body.features
    }
    if (body.popular !== undefined) updateData.popular = body.popular
    if (body.active !== undefined) updateData.active = body.active
    if (body.isPublic !== undefined) updateData.is_public = body.isPublic
    if (body.displayOrder !== undefined) updateData.display_order = body.displayOrder
    if (body.keyPointers !== undefined) updateData.key_pointers = body.keyPointers || null
    if (body.trialDays !== undefined) {
      if (body.trialDays < 0) {
        return NextResponse.json(
          { error: 'Trial days must be non-negative' },
          { status: 400 }
        )
      }
      updateData.trial_days = body.trialDays
    }

    if (updateData.slug) {
      const { data: existingPlan } = await supabaseAdmin
        .from('subscription_plans')
        .select('id')
        .eq('slug', updateData.slug)
        .neq('id', id)
        .limit(1)

      if (existingPlan && existingPlan.length > 0) {
        return NextResponse.json(
          { error: 'A plan with this slug already exists' },
          { status: 409 }
        )
      }
    }

    const { data: result, error: updateError } = await supabaseAdmin
      .from('subscription_plans')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      if (updateError.code === '23505') {
        return NextResponse.json(
          { error: 'A plan with this name or slug already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    if (!result) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const plan = mapPlanFromDB(result)
    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error in PATCH /api/admin/plans/[id]:', error)
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

    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('subscription_plan_id', id)
      .limit(1)

    if (profiles && profiles.length > 0) {
      const now = new Date().toISOString()
      const { data: result, error } = await supabaseAdmin
        .from('subscription_plans')
        .update({ active: false, updated_at: now })
        .eq('id', id)
        .select()
        .single()

      if (error || !result) {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        message: 'Plan deactivated (in use by users)',
        plan: mapPlanFromDB(result),
      })
    }

    const { data: deleteResult, error: deleteError } = await supabaseAdmin
      .from('subscription_plans')
      .delete()
      .eq('id', id)
      .select('id')

    if (deleteError || !deleteResult || deleteResult.length === 0) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Plan deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/admin/plans/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
