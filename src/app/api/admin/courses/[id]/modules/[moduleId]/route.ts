import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
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

    const updates: any = {}
    if (title !== undefined) updates.title = title
    if (description !== undefined) updates.description = description
    if (thumbnail !== undefined) updates.thumbnail = thumbnail
    if (order_index !== undefined) updates.order_index = order_index
    if (duration_minutes !== undefined) updates.duration_minutes = duration_minutes
    if (is_preview !== undefined) updates.is_preview = is_preview

    const { data: module, error } = await supabaseAdmin
      .from('course_modules')
      .update(updates)
      .eq('id', moduleId)
      .select()
      .single()

    if (error) {
      console.error('Error updating module:', error)
      return NextResponse.json(
        { error: 'Failed to update module', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ module })
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
    const { moduleId } = await params

    const { error } = await supabaseAdmin
      .from('course_modules')
      .delete()
      .eq('id', moduleId)

    if (error) {
      console.error('Error deleting module:', error)
      return NextResponse.json(
        { error: 'Failed to delete module', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

