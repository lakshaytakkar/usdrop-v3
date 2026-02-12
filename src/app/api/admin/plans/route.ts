import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { mapPlanFromDB } from '@/lib/utils/plan-helpers'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET() {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult

    const data = await sql`
      SELECT * FROM subscription_plans
      ORDER BY display_order ASC, created_at DESC
    `

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

    const existingPlan = await sql`SELECT id FROM subscription_plans WHERE slug = ${slug} LIMIT 1`
    if (existingPlan.length > 0) {
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
    const featuresJson = JSON.stringify(features)

    try {
      const result = await sql`
        INSERT INTO subscription_plans (
          name, slug, description, price_monthly, price_annual, price_yearly,
          features, popular, active, is_public, display_order,
          key_pointers, trial_days, updated_at
        ) VALUES (
          ${name}, ${slug}, ${description || null}, ${priceMonthly}, ${priceAnnual ?? null}, ${priceYearly ?? null},
          ${featuresJson}::jsonb, ${popular || false}, ${active ?? true}, ${isPublic ?? true}, ${displayOrder ?? 0},
          ${keyPointers || null}, ${trialDays ?? 0}, ${now}
        )
        RETURNING *
      `

      if (!result || result.length === 0) {
        return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
      }

      const plan = mapPlanFromDB(result[0])
      return NextResponse.json(plan, { status: 201 })
    } catch (err: any) {
      if (err?.code === '23505') {
        return NextResponse.json(
          { error: 'A plan with this name or slug already exists' },
          { status: 409 }
        )
      }
      throw err
    }
  } catch (error) {
    console.error('Error in POST /api/admin/plans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
