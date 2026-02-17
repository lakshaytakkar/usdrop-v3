import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
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

    const updateData: Record<string, any> = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail
    if (order_index !== undefined) updateData.order_index = order_index
    if (duration_minutes !== undefined) updateData.duration_minutes = duration_minutes
    if (is_preview !== undefined) updateData.is_preview = is_preview

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updateData.updated_at = new Date().toISOString()

    const { data: result, error } = await supabaseAdmin
      .from('course_modules')
      .update(updateData)
      .eq('id', moduleId)
      .select()
      .single()

    if (error || !result) {
      return NextResponse.json(
        { error: 'Failed to update module' },
        { status: 500 }
      )
    }

    return NextResponse.json({ module: result })
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

    await supabaseAdmin.from('course_modules').delete().eq('id', moduleId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
