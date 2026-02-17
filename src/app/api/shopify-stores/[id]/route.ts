import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'

function mapStoreFromDB(row: any) {
  const profile = row.profiles
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.store_name || row.shop_domain || '',
    url: row.shop_domain || '',
    logo: null,
    status: row.is_active ? 'connected' : 'disconnected',
    connected_at: row.created_at || new Date().toISOString(),
    last_synced_at: row.last_synced_at || null,
    sync_status: row.last_synced_at ? 'success' : 'never',
    api_key: '',
    access_token: row.access_token ? '••••••••' : '',
    products_count: 0,
    monthly_revenue: null,
    monthly_traffic: null,
    niche: null,
    country: null,
    currency: 'USD',
    plan: row.plan || 'basic',
    user: profile ? {
      id: row.user_id,
      email: profile.email,
      full_name: profile.full_name,
    } : undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: storeId } = await params

    const { data, error } = await supabaseAdmin
      .from('shopify_stores')
      .select('*, profiles(email, full_name)')
      .eq('id', storeId)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    return NextResponse.json(mapStoreFromDB(data))
  } catch (error) {
    console.error('Error in GET /api/shopify-stores/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: storeId } = await params
    const body = await request.json()

    const { data: existing } = await supabaseAdmin
      .from('shopify_stores')
      .select('id')
      .eq('id', storeId)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Store not found or access denied' }, { status: 404 })
    }

    const updateFields: Record<string, any> = { updated_at: new Date().toISOString() }

    if (body.name !== undefined) updateFields.store_name = body.name
    if (body.url !== undefined) updateFields.shop_domain = body.url
    if (body.status !== undefined) updateFields.is_active = body.status === 'connected'
    if (body.plan !== undefined) updateFields.plan = body.plan

    const { data: result, error } = await supabaseAdmin
      .from('shopify_stores')
      .update(updateFields)
      .eq('id', storeId)
      .eq('user_id', user.id)
      .select('*, profiles(email, full_name)')
      .single()

    if (error || !result) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    return NextResponse.json(mapStoreFromDB(result))
  } catch (error) {
    console.error('Error in PATCH /api/shopify-stores/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: storeId } = await params

    const { data: existing } = await supabaseAdmin
      .from('shopify_stores')
      .select('id')
      .eq('id', storeId)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Store not found or access denied' }, { status: 404 })
    }

    await supabaseAdmin
      .from('shopify_stores')
      .delete()
      .eq('id', storeId)
      .eq('user_id', user.id)

    return NextResponse.json({ success: true, message: 'Store deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/shopify-stores/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
