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

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('category_id')
    const country = searchParams.get('country')
    const search = searchParams.get('search')
    const verified = searchParams.get('verified')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const values: any[] = []
    let paramIndex = 1

    const baseSelect = `SELECT cs.*, c.id as category_id_ref, c.name as category_name, c.slug as category_slug
             FROM competitor_stores cs
             LEFT JOIN categories c ON cs.category_id = c.id`

    const whereParts: string[] = []

    if (verified !== null) {
      whereParts.push(`cs.verified = $${paramIndex}`)
      values.push(verified === 'true')
      paramIndex++
    }

    if (categoryId) {
      whereParts.push(`cs.category_id = $${paramIndex}`)
      values.push(categoryId)
      paramIndex++
    }

    if (country) {
      whereParts.push(`cs.country = $${paramIndex}`)
      values.push(country)
      paramIndex++
    }

    if (search) {
      whereParts.push(`(cs.name ILIKE $${paramIndex} OR cs.url ILIKE $${paramIndex})`)
      values.push(`%${search}%`)
      paramIndex++
    }

    const whereClause = whereParts.length > 0 ? ` WHERE ${whereParts.join(' AND ')}` : ''

    const allowedSortColumns: Record<string, string> = {
      name: 'cs.name',
      monthly_revenue: 'cs.monthly_revenue',
      monthly_traffic: 'cs.monthly_traffic',
      growth: 'cs.growth',
      rating: 'cs.rating',
      created_at: 'cs.created_at',
    }
    const orderCol = allowedSortColumns[sortBy] || 'cs.created_at'
    const orderDir = sortOrder === 'asc' ? 'ASC' : 'DESC'

    const offset = (page - 1) * pageSize

    const query = `${baseSelect}${whereClause} ORDER BY ${orderCol} ${orderDir} NULLS LAST LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    const queryValues = [...values, pageSize, offset]

    const countQuery = `SELECT COUNT(*) FROM competitor_stores cs${whereClause}`

    const [result, countResult] = await Promise.all([
      sql.unsafe(query, queryValues),
      sql.unsafe(countQuery, values),
    ])

    const stores = result.map(mapStore)
    const totalCount = parseInt(countResult[0].count, 10)

    return NextResponse.json({ stores, totalCount }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in GET admin competitor stores:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
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

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      )
    }

    const insertResult = await sql.unsafe(
      `INSERT INTO competitor_stores (name, url, logo, category_id, country, monthly_traffic, monthly_revenue, growth, products_count, rating, verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id`,
      [
        name,
        url,
        logo || null,
        category_id || null,
        country || null,
        monthly_traffic || 0,
        monthly_revenue || null,
        growth || 0,
        products_count || null,
        rating || null,
        verified || false,
      ]
    )

    const newId = insertResult[0].id

    const result = await sql.unsafe(
      `SELECT cs.*, c.id as category_id_ref, c.name as category_name, c.slug as category_slug
       FROM competitor_stores cs
       LEFT JOIN categories c ON cs.category_id = c.id
       WHERE cs.id = $1`,
      [newId]
    )

    const store = mapStore(result[0])

    return NextResponse.json({ store }, { status: 201 })
  } catch (error: any) {
    console.error('Unexpected error in POST admin competitor stores:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}
