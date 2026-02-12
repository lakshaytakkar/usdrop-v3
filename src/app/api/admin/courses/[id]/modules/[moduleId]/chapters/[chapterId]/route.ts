import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { ChapterContentType } from '@/types/courses'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; chapterId: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { chapterId } = await params
    const body = await request.json()

    const {
      title,
      description,
      content_type,
      content,
      order_index,
      duration_minutes,
      is_preview,
    } = body

    const setClauses: string[] = []
    const params_arr: unknown[] = []
    let paramIndex = 1

    if (title !== undefined) { setClauses.push(`title = $${paramIndex++}`); params_arr.push(title) }
    if (description !== undefined) { setClauses.push(`description = $${paramIndex++}`); params_arr.push(description) }
    if (content_type !== undefined) {
      const validContentTypes: ChapterContentType[] = ['video', 'text', 'quiz', 'assignment', 'resource']
      if (!validContentTypes.includes(content_type)) {
        return NextResponse.json(
          { error: `content_type must be one of: ${validContentTypes.join(', ')}` },
          { status: 400 }
        )
      }
      setClauses.push(`content_type = $${paramIndex++}`)
      params_arr.push(content_type)
    }
    if (content !== undefined) { setClauses.push(`content = $${paramIndex++}`); params_arr.push(JSON.stringify(content)) }
    if (order_index !== undefined) { setClauses.push(`order_index = $${paramIndex++}`); params_arr.push(order_index) }
    if (duration_minutes !== undefined) { setClauses.push(`duration_minutes = $${paramIndex++}`); params_arr.push(duration_minutes) }
    if (is_preview !== undefined) { setClauses.push(`is_preview = $${paramIndex++}`); params_arr.push(is_preview) }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    setClauses.push(`updated_at = now()`)

    const query = `UPDATE course_chapters SET ${setClauses.join(', ')} WHERE id = $${paramIndex++} RETURNING *`
    params_arr.push(chapterId)

    const result = await sql.unsafe(query, params_arr)

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update chapter' },
        { status: 500 }
      )
    }

    return NextResponse.json({ chapter: result[0] })
  } catch (error) {
    console.error('Unexpected error updating chapter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; chapterId: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { chapterId } = await params

    await sql`DELETE FROM course_chapters WHERE id = ${chapterId}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting chapter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
