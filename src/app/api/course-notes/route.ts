import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')

    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('course_notes')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .order('timestamp_seconds', { ascending: true })

    if (error) {
      console.error('Error fetching course notes:', error)
      return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
    }

    return NextResponse.json({ notes: data || [] })
  } catch (error) {
    console.error('Error in GET /api/course-notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { moduleId, text, timestamp_seconds } = body

    if (!moduleId || !text) {
      return NextResponse.json({ error: 'moduleId and text are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('course_notes')
      .insert({
        user_id: user.id,
        module_id: moduleId,
        text,
        timestamp_seconds: timestamp_seconds || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating course note:', error)
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
    }

    return NextResponse.json({ note: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/course-notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, text, timestamp_seconds } = body

    if (!id || !text) {
      return NextResponse.json({ error: 'id and text are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('course_notes')
      .update({ text, timestamp_seconds: timestamp_seconds || 0, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating course note:', error)
      return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
    }

    return NextResponse.json({ note: data })
  } catch (error) {
    console.error('Error in PUT /api/course-notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('course_notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting course note:', error)
      return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/course-notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
