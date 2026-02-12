import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { moduleId } = await params
    const body = await request.json()

    const {
      title,
      description,
      thumbnail,
      order_index,
      duration_minutes,
      is_preview,
    } = body

    const setClauses: string[] = []
    const params_arr: unknown[] = []
    let paramIndex = 1

    if (title !== undefined) { setClauses.push(`title = $${paramIndex++}`); params_arr.push(title) }
    if (description !== undefined) { setClauses.push(`description = $${paramIndex++}`); params_arr.push(description) }
    if (thumbnail !== undefined) { setClauses.push(`thumbnail = $${paramIndex++}`); params_arr.push(thumbnail) }
    if (order_index !== undefined) { setClauses.push(`order_index = $${paramIndex++}`); params_arr.push(order_index) }
    if (duration_minutes !== undefined) { setClauses.push(`duration_minutes = $${paramIndex++}`); params_arr.push(duration_minutes) }
    if (is_preview !== undefined) { setClauses.push(`is_preview = $${paramIndex++}`); params_arr.push(is_preview) }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    setClauses.push(`updated_at = now()`)

    const query = `UPDATE course_modules SET ${setClauses.join(', ')} WHERE id = $${paramIndex++} RETURNING *`
    params_arr.push(moduleId)

    const result = await sql.unsafe(query, params_arr)

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update module' },
        { status: 500 }
      )
    }

    return NextResponse.json({ module: result[0] })
  } catch (error) {
    console.error('Unexpected error updating module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { moduleId } = await params

    await sql`DELETE FROM course_modules WHERE id = ${moduleId}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
