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

    const updates: any = {}
    if (title !== undefined) updates.title = title
    if (description !== undefined) updates.description = description
    if (content_type !== undefined) {
      const validContentTypes: ChapterContentType[] = ['video', 'text', 'quiz', 'assignment', 'resource']
      if (!validContentTypes.includes(content_type)) {
        return NextResponse.json(
          { error: `content_type must be one of: ${validContentTypes.join(', ')}` },
          { status: 400 }
        )
      }
      updates.content_type = content_type
    }
    if (content !== undefined) updates.content = content
    if (order_index !== undefined) updates.order_index = order_index
    if (duration_minutes !== undefined) updates.duration_minutes = duration_minutes
    if (is_preview !== undefined) updates.is_preview = is_preview

    const { data: chapter, error } = await supabaseAdmin
      .from('course_chapters')
      .update(updates)
      .eq('id', chapterId)
      .select()
      .single()

    if (error) {
      console.error('Error updating chapter:', error)
      return NextResponse.json(
        { error: 'Failed to update chapter', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ chapter })
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

    const { error } = await supabaseAdmin
      .from('course_chapters')
      .delete()
      .eq('id', chapterId)

    if (error) {
      console.error('Error deleting chapter:', error)
      return NextResponse.json(
        { error: 'Failed to delete chapter', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting chapter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

