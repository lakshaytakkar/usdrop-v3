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

    const result = await sql`SELECT * FROM suppliers WHERE id = ${id} LIMIT 1`

    if (result.length === 0) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }

    return NextResponse.json({ supplier: result[0] })
  } catch (error) {
    console.error('Error fetching supplier:', error)
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

    const { name, website, country, rating, verified, shipping_time, min_order_quantity, contact_email } = body

    const setClauses: string[] = []
    const params_arr: unknown[] = []
    let paramIndex = 1

    if (name !== undefined) { setClauses.push(`name = $${paramIndex++}`); params_arr.push(name) }
    if (website !== undefined) { setClauses.push(`website = $${paramIndex++}`); params_arr.push(website) }
    if (country !== undefined) { setClauses.push(`country = $${paramIndex++}`); params_arr.push(country) }
    if (rating !== undefined) { setClauses.push(`rating = $${paramIndex++}`); params_arr.push(rating) }
    if (verified !== undefined) { setClauses.push(`verified = $${paramIndex++}`); params_arr.push(verified) }
    if (shipping_time !== undefined) { setClauses.push(`shipping_time = $${paramIndex++}`); params_arr.push(shipping_time) }
    if (min_order_quantity !== undefined) { setClauses.push(`min_order_quantity = $${paramIndex++}`); params_arr.push(min_order_quantity) }
    if (contact_email !== undefined) { setClauses.push(`contact_email = $${paramIndex++}`); params_arr.push(contact_email) }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    setClauses.push(`updated_at = now()`)

    const query = `UPDATE suppliers SET ${setClauses.join(', ')} WHERE id = $${paramIndex++} RETURNING *`
    params_arr.push(id)

    const result = await sql.unsafe(query, params_arr)

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }

    return NextResponse.json({ supplier: result[0] })
  } catch (error) {
    console.error('Error updating supplier:', error)
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

    await sql`DELETE FROM suppliers WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
