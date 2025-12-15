import { NextRequest, NextResponse } from 'next/server'
import { createClient, supabaseAdmin } from '@/lib/supabase/server'
import { mapShopifyStoreFromDB, mapShopifyStoreToDB, normalizeShopifyStoreUrl, validateShopifyStoreUrl } from '@/lib/utils/shopify-store-helpers'

// Helper to get authenticated user
async function getAuthenticatedUser() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

// GET /api/shopify-stores/[id] - Get a single store (user's own stores only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      .eq('user_id', user.id) // Ensure user owns this store
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
    console.error('Error in GET /api/shopify-stores/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/shopify-stores/[id] - Update user's own store
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: storeId } = await params
    const body = await request.json()

    // First verify ownership
    const { data: existingStore, error: fetchError } = await supabaseAdmin
      .from('shopify_stores')
      .select('id, user_id')
      .eq('id', storeId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingStore) {
      return NextResponse.json({ error: 'Store not found or access denied' }, { status: 404 })
    }

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

    // Map to DB format
    const updateData = mapShopifyStoreToDB(body)
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('shopify_stores')
      .update(updateData)
      .eq('id', storeId)
      .eq('user_id', user.id) // Double-check ownership
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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const store = mapShopifyStoreFromDB(data)
    return NextResponse.json(store)
  } catch (error) {
    console.error('Error in PATCH /api/shopify-stores/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/shopify-stores/[id] - Delete user's own store
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: storeId } = await params

    // Verify ownership before deleting
    const { data: storeData, error: fetchError } = await supabaseAdmin
      .from('shopify_stores')
      .select('id, user_id')
      .eq('id', storeId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !storeData) {
      return NextResponse.json({ error: 'Store not found or access denied' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('shopify_stores')
      .delete()
      .eq('id', storeId)
      .eq('user_id', user.id) // Double-check ownership

    if (error) {
      console.error('Error deleting shopify store:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Store deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/shopify-stores/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

