import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: storeId } = await params

    const { data: store, error: storeError } = await supabaseAdmin
      .from('shopify_stores')
      .select('id, user_id, shop_domain, access_token, is_active')
      .eq('id', storeId)
      .eq('user_id', user.id)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: 'Store not found or access denied' }, { status: 404 })
    }

    if (!store.is_active) {
      return NextResponse.json(
        { error: 'Store must be connected to sync' },
        { status: 400 }
      )
    }

    if (!store.access_token) {
      return NextResponse.json(
        { error: 'Store access token is missing' },
        { status: 400 }
      )
    }

    await supabaseAdmin
      .from('shopify_stores')
      .update({ last_synced_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', storeId)
      .eq('user_id', user.id)

    const { data: updated } = await supabaseAdmin
      .from('shopify_stores')
      .select('*, profiles(email, full_name)')
      .eq('id', storeId)
      .single()

    const row = updated
    const mappedStore = {
      id: row.id,
      user_id: row.user_id,
      name: row.store_name || row.shop_domain || '',
      url: row.shop_domain || '',
      status: row.is_active ? 'connected' : 'disconnected',
      connected_at: row.created_at,
      last_synced_at: row.last_synced_at,
      sync_status: 'success',
      plan: row.plan || 'basic',
      created_at: row.created_at,
      updated_at: row.updated_at,
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Store synced successfully',
      store: mappedStore
    })
  } catch (error) {
    console.error('Error in POST /api/shopify-stores/[id]/sync:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
