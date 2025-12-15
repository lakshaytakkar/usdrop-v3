import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { mapShopifyStoreFromDB, mapShopifyStoreToDB, normalizeShopifyStoreUrl, validateShopifyStoreUrl } from '@/lib/utils/shopify-store-helpers'

// GET /api/admin/shopify-stores/[id] - Get a single store
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storeId } = await params

    // Use service role for admin access
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

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

// PATCH /api/admin/shopify-stores/[id] - Update a store
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storeId } = await params
    const body = await request.json()

    // Use service role for admin access
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Validate URL if provided
    if (body.url) {
      if (!validateShopifyStoreUrl(body.url)) {
        return NextResponse.json(
          { error: 'Invalid Shopify store URL format' },
          { status: 400 }
        )
      }
      body.url = normalizeShopifyStoreUrl(body.url)
    }

    // Validate status if provided
    if (body.status && !['connected', 'disconnected', 'syncing', 'error'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Validate sync_status if provided
    if (body.sync_status && !['success', 'failed', 'pending', 'never'].includes(body.sync_status)) {
      return NextResponse.json(
        { error: 'Invalid sync_status value' },
        { status: 400 }
      )
    }

    // Validate plan if provided
    if (body.plan && !['basic', 'shopify', 'advanced', 'plus'].includes(body.plan)) {
      return NextResponse.json(
        { error: 'Invalid plan value' },
        { status: 400 }
      )
    }

    // Map to DB format
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

// DELETE /api/admin/shopify-stores/[id] - Delete a store
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storeId } = await params

    // Use service role for admin access
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Check if store exists
    const { data: storeData, error: fetchError } = await supabaseAdmin
      .from('shopify_stores')
      .select('id, user_id')
      .eq('id', storeId)
      .single()

    if (fetchError || !storeData) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Check for dependencies (e.g., products, orders, etc.)
    // For now, we'll do a hard delete. If there are dependencies, we can soft delete instead
    // by setting status to 'disconnected'

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

