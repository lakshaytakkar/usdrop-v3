import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { CompetitorStore } from '@/types/competitor-stores'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('category_id')
    const country = searchParams.get('country')
    const search = searchParams.get('search')
    const verified = searchParams.get('verified')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const sortBy = searchParams.get('sortBy') || 'monthly_revenue'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const whereClauses: string[] = []
    const values: any[] = []
    let paramIndex = 0

    const isVerified = verified === null ? true : verified === 'true'
    paramIndex++
    whereClauses.push(`cs.verified = $${paramIndex}`)
    values.push(isVerified)

    if (categoryId) {
      paramIndex++
      whereClauses.push(`cs.category_id = $${paramIndex}`)
      values.push(categoryId)
    }

    if (country) {
      paramIndex++
      whereClauses.push(`cs.country = $${paramIndex}`)
      values.push(country)
    }

    if (search) {
      paramIndex++
      const searchParam = `%${search}%`
      whereClauses.push(`(cs.name ILIKE $${paramIndex} OR cs.url ILIKE $${paramIndex})`)
      values.push(searchParam)
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const orderColumn = sortBy === 'name' ? 'cs.name' :
                       sortBy === 'monthly_revenue' ? 'cs.monthly_revenue' :
                       sortBy === 'monthly_traffic' ? 'cs.monthly_traffic' :
                       sortBy === 'growth' ? 'cs.growth' :
                       sortBy === 'rating' ? 'cs.rating' :
                       'cs.created_at'
    const orderDir = sortOrder === 'asc' ? 'ASC' : 'DESC'

    const countQuery = `
      SELECT COUNT(*) as count
      FROM competitor_stores cs
      ${whereSQL}
    `
    const countResult = await sql.unsafe(countQuery, values)
    const totalCount = parseInt(countResult[0]?.count || '0')

    const offset = (page - 1) * pageSize

    const dataQuery = `
      SELECT
        cs.id, cs.name, cs.url, cs.logo, cs.category_id, cs.country,
        cs.monthly_traffic, cs.monthly_revenue, cs.growth, cs.products_count,
        cs.rating, cs.verified, cs.created_at, cs.updated_at,
        c.id as cat_id, c.name as cat_name, c.slug as cat_slug
      FROM competitor_stores cs
      LEFT JOIN categories c ON cs.category_id = c.id
      ${whereSQL}
      ORDER BY ${orderColumn} ${orderDir} NULLS LAST
      LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}
    `

    const data = await sql.unsafe(dataQuery, [...values, pageSize, offset])

    const stores: CompetitorStore[] = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      url: item.url,
      logo: item.logo,
      category_id: item.category_id,
      category: item.cat_id ? {
        id: item.cat_id,
        name: item.cat_name,
        slug: item.cat_slug,
      } : null,
      country: item.country,
      monthly_traffic: item.monthly_traffic,
      monthly_revenue: item.monthly_revenue ? parseFloat(item.monthly_revenue) : null,
      growth: parseFloat(item.growth),
      products_count: item.products_count,
      rating: item.rating ? parseFloat(item.rating) : null,
      verified: item.verified,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    return NextResponse.json({ stores, totalCount }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in GET competitor stores:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}
