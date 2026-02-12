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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    const result = await sql.unsafe(
      `SELECT cs.*, c.id as category_id_ref, c.name as category_name, c.slug as category_slug
       FROM competitor_stores cs
       LEFT JOIN categories c ON cs.category_id = c.id
       WHERE cs.id = $1`,
      [id]
    )

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Competitor store not found' },
        { status: 404 }
      )
    }

    const store = mapStore(result[0])

    return NextResponse.json({ store }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in GET competitor store:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
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
      url,
      logo,
      category_id,
      country,
      monthly_traffic,
      monthly_revenue,
      growth,
      products_count,
      rating,
      verified,
    } = body

    const setParts: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (name !== undefined) { setParts.push(`name = $${paramIndex}`); values.push(name); paramIndex++ }
    if (url !== undefined) { setParts.push(`url = $${paramIndex}`); values.push(url); paramIndex++ }
    if (logo !== undefined) { setParts.push(`logo = $${paramIndex}`); values.push(logo || null); paramIndex++ }
    if (category_id !== undefined) { setParts.push(`category_id = $${paramIndex}`); values.push(category_id || null); paramIndex++ }
    if (country !== undefined) { setParts.push(`country = $${paramIndex}`); values.push(country || null); paramIndex++ }
    if (monthly_traffic !== undefined) { setParts.push(`monthly_traffic = $${paramIndex}`); values.push(monthly_traffic); paramIndex++ }
    if (monthly_revenue !== undefined) { setParts.push(`monthly_revenue = $${paramIndex}`); values.push(monthly_revenue || null); paramIndex++ }
    if (growth !== undefined) { setParts.push(`growth = $${paramIndex}`); values.push(growth); paramIndex++ }
    if (products_count !== undefined) { setParts.push(`products_count = $${paramIndex}`); values.push(products_count || null); paramIndex++ }
    if (rating !== undefined) { setParts.push(`rating = $${paramIndex}`); values.push(rating || null); paramIndex++ }
    if (verified !== undefined) { setParts.push(`verified = $${paramIndex}`); values.push(verified); paramIndex++ }

    if (setParts.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    setParts.push(`updated_at = NOW()`)

    const updateQuery = `UPDATE competitor_stores SET ${setParts.join(', ')} WHERE id = $${paramIndex} RETURNING id`
    values.push(id)

    const updateResult = await sql.unsafe(updateQuery, values)

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
    console.error('Unexpected error in PATCH competitor store:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
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

    await sql.unsafe(`DELETE FROM competitor_stores WHERE id = $1`, [id])

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in DELETE competitor store:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}
