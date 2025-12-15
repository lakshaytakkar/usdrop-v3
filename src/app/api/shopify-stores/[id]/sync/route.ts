import { NextRequest, NextResponse } from 'next/server'
import { createClient, supabaseAdmin } from '@/lib/supabase/server'
import { mapShopifyStoreFromDB } from '@/lib/utils/shopify-store-helpers'

// Helper to get authenticated user
async function getAuthenticatedUser() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

// POST /api/shopify-stores/[id]/sync - Trigger store sync
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: storeId } = await params

    // Verify ownership
    const { data: storeData, error: fetchError } = await supabaseAdmin
      .from('shopify_stores')
      .select('id, user_id, url, access_token, status')
      .eq('id', storeId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !storeData) {
      return NextResponse.json({ error: 'Store not found or access denied' }, { status: 404 })
    }

    if (storeData.status !== 'connected') {
      return NextResponse.json(
        { error: 'Store must be connected to sync' },
        { status: 400 }
      )
    }

    if (!storeData.access_token) {
      return NextResponse.json(
        { error: 'Store access token is missing' },
        { status: 400 }
      )
    }

    // Update sync status to pending
    const { data: updatedStore, error: updateError } = await supabaseAdmin
      .from('shopify_stores')
      .update({
        sync_status: 'pending',
        updated_at: new Date().toISOString()
      })
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

    if (updateError) {
      console.error('Error updating sync status:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // TODO: Implement actual Shopify API sync
    // For now, simulate sync by updating some fields
    // In production, this would:
    // 1. Call Shopify API to fetch products, orders, etc.
    // 2. Update products_count, monthly_revenue, etc.
    // 3. Handle errors and update sync_status accordingly

    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update with sync results (mock data for now)
    const { data: syncedStore, error: syncError } = await supabaseAdmin
      .from('shopify_stores')
      .update({
        sync_status: 'success',
        last_synced_at: new Date().toISOString(),
        // In production, these would come from Shopify API
        // products_count: shopifyProducts.length,
        // monthly_revenue: calculateMonthlyRevenue(shopifyOrders),
        updated_at: new Date().toISOString()
      })
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

    if (syncError) {
      console.error('Error completing sync:', syncError)
      // Update to failed status
      await supabaseAdmin
        .from('shopify_stores')
        .update({
          sync_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', storeId)

      return NextResponse.json({ error: syncError.message }, { status: 500 })
    }

    const store = mapShopifyStoreFromDB(syncedStore!)
    return NextResponse.json({ 
      success: true, 
      message: 'Store synced successfully',
      store 
    })
  } catch (error) {
    console.error('Error in POST /api/shopify-stores/[id]/sync:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

