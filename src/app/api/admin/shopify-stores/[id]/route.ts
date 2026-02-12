import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { mapShopifyStoreFromDB, mapShopifyStoreToDB, normalizeShopifyStoreUrl, validateShopifyStoreUrl } from '@/lib/utils/shopify-store-helpers'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id: storeId } = await params

    const { data, error } = await supabaseAdmin
      .from('shopify_stores')
      .select(`
        *,
        profiles (
          id,
          email,
          full_name
        )
      `)
      .eq('id', storeId)
      .single()

    if (error) {
      console.error('Error fetching shopify store:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const store = mapShopifyStoreFromDB(data)
    return NextResponse.json(store)
  } catch (error) {
    console.error('Error in GET /api/admin/shopify-stores/[id]:', error)
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
    const { id: storeId } = await params
    const body = await request.json()

    if (body.url) {
      if (!validateShopifyStoreUrl(body.url)) {
        return NextResponse.json(
          { error: 'Invalid Shopify store URL format' },
          { status: 400 }
        )
      }
      body.url = normalizeShopifyStoreUrl(body.url)
    }

    if (body.status && !['connected', 'disconnected', 'syncing', 'error'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    if (body.sync_status && !['success', 'failed', 'pending', 'never'].includes(body.sync_status)) {
      return NextResponse.json(
        { error: 'Invalid sync_status value' },
        { status: 400 }
      )
    }

    if (body.plan && !['basic', 'shopify', 'advanced', 'plus'].includes(body.plan)) {
      return NextResponse.json(
        { error: 'Invalid plan value' },
        { status: 400 }
      )
    }

    const updateData = mapShopifyStoreToDB(body)
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('shopify_stores')
      .update(updateData)
      .eq('id', storeId)
      .select(`
        *,
        profiles (
          id,
          email,
          full_name
        )
      `)
      .single()

    if (error) {
      console.error('Error updating shopify store:', error)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A store with this URL already exists' },
          { status: 409 }
        )
      }
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const store = mapShopifyStoreFromDB(data)
    return NextResponse.json(store)
  } catch (error) {
    console.error('Error in PATCH /api/admin/shopify-stores/[id]:', error)
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
    const { id: storeId } = await params

    const { data: storeData, error: fetchError } = await supabaseAdmin
      .from('shopify_stores')
      .select('id, user_id')
      .eq('id', storeId)
      .single()

    if (fetchError || !storeData) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('shopify_stores')
      .delete()
      .eq('id', storeId)

    if (error) {
      console.error('Error deleting shopify store:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Store deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/admin/shopify-stores/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
