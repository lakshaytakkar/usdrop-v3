import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { mapPlanFromDB } from '@/lib/utils/plan-helpers'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET() {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult

    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching plans:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json([])
    }

    const plans = data.map((plan: any) => mapPlanFromDB(plan))

    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error in GET /api/admin/plans:', error)
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
      slug,
      description,
      priceMonthly,
      priceAnnual,
      priceYearly,
      features = [],
      popular = false,
      active = true,
      isPublic = true,
      displayOrder = 0,
      keyPointers,
      trialDays = 0,
    } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    if (priceMonthly === undefined || priceMonthly === null) {
      return NextResponse.json(
        { error: 'Monthly price is required' },
        { status: 400 }
      )
    }

    const { validatePlanSlug } = await import('@/lib/utils/plan-helpers')
    if (!validatePlanSlug(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Must be lowercase alphanumeric with hyphens or underscores' },
        { status: 400 }
      )
    }

    const { data: existingPlan } = await supabaseAdmin
      .from('subscription_plans')
      .select('id')
      .eq('slug', slug)
      .limit(1)

    if (existingPlan && existingPlan.length > 0) {
      return NextResponse.json(
        { error: 'A plan with this slug already exists' },
        { status: 409 }
      )
    }

    if (!Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Features must be an array' },
        { status: 400 }
      )
    }

    if (priceMonthly < 0 || (priceAnnual !== null && priceAnnual !== undefined && priceAnnual < 0) || 
        (priceYearly !== null && priceYearly !== undefined && priceYearly < 0)) {
      return NextResponse.json(
        { error: 'Prices must be non-negative' },
        { status: 400 }
      )
    }

    if (trialDays < 0) {
      return NextResponse.json(
        { error: 'Trial days must be non-negative' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    const { data: result, error: insertError } = await supabaseAdmin
      .from('subscription_plans')
      .insert({
        name,
        slug,
        description: description || null,
        price_monthly: priceMonthly,
        price_annual: priceAnnual ?? null,
        price_yearly: priceYearly ?? null,
        features,
        popular: popular || false,
        active: active ?? true,
        is_public: isPublic ?? true,
        display_order: displayOrder ?? 0,
        key_pointers: keyPointers || null,
        trial_days: trialDays ?? 0,
        updated_at: now,
      })
      .select()
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'A plan with this name or slug already exists' },
          { status: 409 }
        )
      }
      console.error('Error creating plan:', insertError)
      return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
    }

    const plan = mapPlanFromDB(result)
    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/plans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
