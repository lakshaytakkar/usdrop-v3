import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { mapPlanFromDB } from '@/lib/utils/plan-helpers'

// GET /api/admin/plans - List all subscription plans
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching plans:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json([])
    }

    // Transform to match SubscriptionPlan interface using helper
    const plans = data.map((plan) => mapPlanFromDB(plan))

    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error in GET /api/admin/plans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/plans - Create a new subscription plan
export async function POST(request: NextRequest) {
  try {
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

    // Validate required fields
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

    // Validate slug format
    const { validatePlanSlug } = await import('@/lib/utils/plan-helpers')
    if (!validatePlanSlug(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Must be lowercase alphanumeric with hyphens or underscores' },
        { status: 400 }
      )
    }

    // Check slug uniqueness
    const { data: existingPlan, error: checkError } = await supabaseAdmin
      .from('subscription_plans')
      .select('id')
      .eq('slug', slug)
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

    // Validate features is an array
    if (!Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Features must be an array' },
        { status: 400 }
      )
    }

    // Validate numeric fields
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

    // Insert new plan
    const { data, error } = await supabaseAdmin
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
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating plan:', error)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A plan with this name or slug already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Use helper to map response
    const plan = mapPlanFromDB(data)

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/plans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

