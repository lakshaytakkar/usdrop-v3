import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
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
      const { data: maxResult } = await supabaseAdmin
        .from('course_modules')
        .select('order_index')
        .eq('course_id', courseId)
        .order('order_index', { ascending: false })
        .limit(1)

      finalOrderIndex = (maxResult && maxResult.length > 0 ? maxResult[0].order_index : -1) + 1
    }

    const { data: result, error } = await supabaseAdmin
      .from('course_modules')
      .insert({
        course_id: courseId,
        title,
        description: description || null,
        thumbnail: thumbnail || null,
        order_index: finalOrderIndex,
        duration_minutes: duration_minutes || null,
        is_preview: is_preview || false,
      })
      .select()
      .single()

    if (error || !result) {
      console.error('Error creating module:', error)
      return NextResponse.json(
        { error: 'Failed to create module' },
        { status: 500 }
      )
    }

    return NextResponse.json({ module: result }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
