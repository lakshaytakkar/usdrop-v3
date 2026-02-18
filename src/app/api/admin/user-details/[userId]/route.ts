import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

  try {
    const { userId } = await params

    const { data, error } = await supabaseAdmin
      .from('user_details')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user details:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'User details not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/admin/user-details/[userId]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

  try {
    const { userId } = await params
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('user_details')
      .upsert(
        {
          ...body,
          user_id: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single()

    if (error) {
      console.error('Error upserting user details:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in PUT /api/admin/user-details/[userId]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
