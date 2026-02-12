import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

function mapStore(item: any) {
  return {
    id: item.id,
    name: item.name,
    url: item.url,
    logo: item.logo,
    category_id: item.category_id,
    category: item.category_name ? { id: item.category_id_ref, name: item.category_name, slug: item.category_slug } : null,
    country: item.country,
    monthly_traffic: item.monthly_traffic,
    monthly_revenue: item.monthly_revenue ? parseFloat(item.monthly_revenue) : null,
    growth: parseFloat(item.growth),
    products_count: item.products_count,
    rating: item.rating ? parseFloat(item.rating) : null,
    verified: item.verified,
    created_at: item.created_at,
    updated_at: item.updated_at,
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
    const { verified } = body

    if (typeof verified !== 'boolean') {
      return NextResponse.json(
        { error: 'verified must be a boolean' },
        { status: 400 }
      )
    }

    const updateResult = await sql.unsafe(
      `UPDATE competitor_stores SET verified = $1, updated_at = NOW() WHERE id = $2 RETURNING id`,
      [verified, id]
    )

    if (updateResult.length === 0) {
      return NextResponse.json(
        { error: 'Competitor store not found' },
        { status: 404 }
      )
    }

    const result = await sql.unsafe(
      `SELECT cs.*, c.id as category_id_ref, c.name as category_name, c.slug as category_slug
       FROM competitor_stores cs
       LEFT JOIN categories c ON cs.category_id = c.id
       WHERE cs.id = $1`,
      [id]
    )

    const store = mapStore(result[0])

    return NextResponse.json({ store }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in PATCH competitor store verification:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}
