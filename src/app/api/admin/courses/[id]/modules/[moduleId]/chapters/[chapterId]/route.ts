import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
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

    const updateData: Record<string, any> = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (content_type !== undefined) {
      const validContentTypes: ChapterContentType[] = ['video', 'text', 'quiz', 'assignment', 'resource']
      if (!validContentTypes.includes(content_type)) {
        return NextResponse.json(
          { error: `content_type must be one of: ${validContentTypes.join(', ')}` },
          { status: 400 }
        )
      }
      updateData.content_type = content_type
    }
    if (content !== undefined) updateData.content = content
    if (order_index !== undefined) updateData.order_index = order_index
    if (duration_minutes !== undefined) updateData.duration_minutes = duration_minutes
    if (is_preview !== undefined) updateData.is_preview = is_preview

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updateData.updated_at = new Date().toISOString()

    const { data: result, error } = await supabaseAdmin
      .from('course_chapters')
      .update(updateData)
      .eq('id', chapterId)
      .select()
      .single()

    if (error || !result) {
      return NextResponse.json(
        { error: 'Failed to update chapter' },
        { status: 500 }
      )
    }

    return NextResponse.json({ chapter: result })
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

    await supabaseAdmin.from('course_chapters').delete().eq('id', chapterId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting chapter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
