import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
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

    const data = await sql`
      SELECT * FROM subscription_plans WHERE id = ${id} LIMIT 1
    `

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const plan = mapPlanFromDB(data[0])
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

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.name !== undefined) updates.name = body.name
    if (body.slug !== undefined) {
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
      updates.features = JSON.stringify(body.features)
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

    if (updates.slug) {
      const existingPlan = await sql`
        SELECT id FROM subscription_plans WHERE slug = ${updates.slug as string} AND id != ${id} LIMIT 1
      `
      if (existingPlan.length > 0) {
        return NextResponse.json(
          { error: 'A plan with this slug already exists' },
          { status: 409 }
        )
      }
    }

    const setClauses: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    for (const [key, value] of Object.entries(updates)) {
      if (key === 'features') {
        setClauses.push(`${key} = $${paramIndex++}::jsonb`)
      } else {
        setClauses.push(`${key} = $${paramIndex++}`)
      }
      values.push(value)
    }

    values.push(id)

    try {
      const result = await sql.unsafe(
        `UPDATE subscription_plans SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      )

      if (!result || result.length === 0) {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }

      const plan = mapPlanFromDB(result[0])
      return NextResponse.json(plan)
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

    const profiles = await sql`
      SELECT id FROM profiles WHERE subscription_plan_id = ${id} LIMIT 1
    `

    if (profiles && profiles.length > 0) {
      const now = new Date().toISOString()
      const result = await sql`
        UPDATE subscription_plans SET active = false, updated_at = ${now}
        WHERE id = ${id}
        RETURNING *
      `

      if (!result || result.length === 0) {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        message: 'Plan deactivated (in use by users)',
        plan: mapPlanFromDB(result[0]),
      })
    }

    const deleteResult = await sql`DELETE FROM subscription_plans WHERE id = ${id} RETURNING id`

    if (!deleteResult || deleteResult.length === 0) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Plan deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/admin/plans/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
