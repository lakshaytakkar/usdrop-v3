import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, profiles(full_name, email, avatar_url)')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const profile = data.profiles
    const { profiles: _, ...orderFields } = data
    const order = {
      ...orderFields,
      user_name: profile?.full_name || null,
      user_email: profile?.email || null,
      user_avatar: profile?.avatar_url || null,
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params
    const body = await request.json()

    const { status, tracking_number, tracking_url, notes } = body

    const updateData: Record<string, any> = {}

    if (status !== undefined) updateData.status = status
    if (tracking_number !== undefined) updateData.tracking_number = tracking_number
    if (tracking_url !== undefined) updateData.tracking_url = tracking_url
    if (notes !== undefined) updateData.notes = notes

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updateData.updated_at = new Date().toISOString()

    const { data: result, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error || !result) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order: result })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
