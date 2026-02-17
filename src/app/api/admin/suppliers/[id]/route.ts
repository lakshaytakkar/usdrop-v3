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
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }

    return NextResponse.json({ supplier: data })
  } catch (error) {
    console.error('Error fetching supplier:', error)
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

    const { name, website, country, rating, verified, shipping_time, min_order_quantity, contact_email } = body

    const updateData: Record<string, any> = {}

    if (name !== undefined) updateData.name = name
    if (website !== undefined) updateData.website = website
    if (country !== undefined) updateData.country = country
    if (rating !== undefined) updateData.rating = rating
    if (verified !== undefined) updateData.verified = verified
    if (shipping_time !== undefined) updateData.shipping_time = shipping_time
    if (min_order_quantity !== undefined) updateData.min_order_quantity = min_order_quantity
    if (contact_email !== undefined) updateData.contact_email = contact_email

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updateData.updated_at = new Date().toISOString()

    const { data: supplier, error } = await supabaseAdmin
      .from('suppliers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error || !supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }

    return NextResponse.json({ supplier })
  } catch (error) {
    console.error('Error updating supplier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    await supabaseAdmin.from('suppliers').delete().eq('id', id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
