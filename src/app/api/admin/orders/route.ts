import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100)
    const offset = (page - 1) * pageSize

    const conditions: string[] = []
    const params_arr: any[] = []
    let paramIndex = 1

    if (status && status !== 'all') {
      conditions.push(`o.status = $${paramIndex++}`)
      params_arr.push(status)
    }
    if (search) {
      conditions.push(`(o.order_number ILIKE $${paramIndex} OR o.customer_name ILIKE $${paramIndex} OR o.customer_email ILIKE $${paramIndex})`)
      params_arr.push(`%${search}%`)
      paramIndex++
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''

    const countQuery = `SELECT COUNT(*) as total FROM orders o ${whereClause}`
    const countResult = await sql.unsafe(countQuery, params_arr)
    const total = parseInt(countResult[0]?.total || '0')

    const dataParams = [...params_arr, pageSize, offset]
    const query = `
      SELECT o.*, 
        p.full_name as user_name, p.email as user_email, p.avatar_url as user_avatar
      FROM orders o
      LEFT JOIN profiles p ON o.user_id = p.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `
    const orders = await sql.unsafe(query, dataParams)

    return NextResponse.json({
      orders,
      total,
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
