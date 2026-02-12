import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { mapShopifyStoreFromDB } from '@/lib/utils/shopify-store-helpers'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('user_id')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const conditions: string[] = []
    const params: unknown[] = []
    let paramIndex = 1

    if (status) {
      conditions.push(`s.status = $${paramIndex++}`)
      params.push(status)
    }

    if (userId) {
      conditions.push(`s.user_id = $${paramIndex++}`)
      params.push(userId)
    }

    if (search) {
      conditions.push(`(s.name ILIKE $${paramIndex} OR s.url ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const allowedSortColumns = ['created_at', 'updated_at', 'name', 'url', 'status', 'products_count']
    const safeSortBy = allowedSortColumns.includes(sortBy) ? `s.${sortBy}` : 's.created_at'
    const safeSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC'

    const offset = (page - 1) * pageSize

    const dataQuery = `
      SELECT s.*, 
        p.id as profile_id, p.email as profile_email, p.full_name as profile_full_name
      FROM shopify_stores s
      LEFT JOIN profiles p ON s.user_id = p.id
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `
    params.push(pageSize, offset)

    const data = await sql.unsafe(dataQuery, params)

    if (!data || data.length === 0) {
      const countParams = params.slice(0, params.length - 2)
      const countQuery = `SELECT COUNT(*) as total FROM shopify_stores s ${whereClause}`
      const countResult = await sql.unsafe(countQuery, countParams)
      const total = parseInt(countResult[0]?.total || '0')

      return NextResponse.json({
        stores: [],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      })
    }

    const stores = data.map((row: any) => {
      const store = {
        ...row,
        profiles: row.profile_id ? {
          id: row.profile_id,
          email: row.profile_email,
          full_name: row.profile_full_name,
        } : null,
      }
      delete store.profile_id
      delete store.profile_email
      delete store.profile_full_name
      return mapShopifyStoreFromDB(store)
    })

    const countParams = params.slice(0, params.length - 2)
    const countQuery = `SELECT COUNT(*) as total FROM shopify_stores s ${whereClause}`
    const countResult = await sql.unsafe(countQuery, countParams)
    const totalCount = parseInt(countResult[0]?.total || '0')

    return NextResponse.json({
      stores,
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize)
    })
  } catch (error) {
    console.error('Error in GET /api/admin/shopify-stores:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
