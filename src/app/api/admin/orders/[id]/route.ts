import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    const result = await sql`
      SELECT o.*, 
        p.full_name as user_name, p.email as user_email, p.avatar_url as user_avatar
      FROM orders o
      LEFT JOIN profiles p ON o.user_id = p.id
      WHERE o.id = ${id} LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order: result[0] })
  } catch (error) {
    console.error('Error fetching order:', error)
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

    const { status, tracking_number, tracking_url, notes } = body

    const setClauses: string[] = []
    const params_arr: unknown[] = []
    let paramIndex = 1

    if (status !== undefined) { setClauses.push(`status = $${paramIndex++}`); params_arr.push(status) }
    if (tracking_number !== undefined) { setClauses.push(`tracking_number = $${paramIndex++}`); params_arr.push(tracking_number) }
    if (tracking_url !== undefined) { setClauses.push(`tracking_url = $${paramIndex++}`); params_arr.push(tracking_url) }
    if (notes !== undefined) { setClauses.push(`notes = $${paramIndex++}`); params_arr.push(notes) }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    setClauses.push(`updated_at = now()`)

    const query = `UPDATE orders SET ${setClauses.join(', ')} WHERE id = $${paramIndex++} RETURNING *`
    params_arr.push(id)

    const result = await sql.unsafe(query, params_arr)

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order: result[0] })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
