import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { CourseModule } from '@/types/courses'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id: courseId } = await params
    const body = await request.json()

    const {
      title,
      description,
      thumbnail,
      order_index,
      duration_minutes,
      is_preview = false,
    } = body

    if (!title) {
      return NextResponse.json(
        { error: 'title is required' },
        { status: 400 }
      )
    }

    let finalOrderIndex = order_index
    if (finalOrderIndex === undefined) {
      const maxResult = await sql`
        SELECT COALESCE(MAX(order_index), -1) as max_order FROM course_modules WHERE course_id = ${courseId}
      `
      finalOrderIndex = maxResult[0].max_order + 1
    }

    const result = await sql`
      INSERT INTO course_modules (course_id, title, description, thumbnail, order_index, duration_minutes, is_preview)
      VALUES (${courseId}, ${title}, ${description || null}, ${thumbnail || null}, ${finalOrderIndex}, ${duration_minutes || null}, ${is_preview || false})
      RETURNING *
    `

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create module' },
        { status: 500 }
      )
    }

    return NextResponse.json({ module: result[0] }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
