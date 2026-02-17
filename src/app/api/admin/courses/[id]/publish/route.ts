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

    const updateData: Record<string, any> = {
      published,
      updated_at: new Date().toISOString(),
    }

    if (published) {
      const { data: existing } = await supabaseAdmin
        .from('courses')
        .select('published_at')
        .eq('id', id)
        .single()

      if (existing && !existing.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    const { data: result, error } = await supabaseAdmin
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error || !result) {
      return NextResponse.json(
        { error: 'Failed to update course publish status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ course: result })
  } catch (error) {
    console.error('Unexpected error updating course publish status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
