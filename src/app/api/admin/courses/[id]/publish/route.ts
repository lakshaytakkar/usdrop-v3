import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params
    const body = await request.json()
    const { published } = body

    if (typeof published !== 'boolean') {
      return NextResponse.json(
        { error: 'published field is required and must be a boolean' },
        { status: 400 }
      )
    }

    const updates: any = {
      published,
    }

    // Set published_at if publishing for the first time
    if (published) {
      const { data: existing } = await supabaseAdmin
        .from('courses')
        .select('published_at')
        .eq('id', id)
        .single()

      if (!existing?.published_at) {
        updates.published_at = new Date().toISOString()
      }
    }

    const { data: course, error } = await supabaseAdmin
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating course publish status:', error)
      return NextResponse.json(
        { error: 'Failed to update course publish status', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error('Unexpected error updating course publish status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

