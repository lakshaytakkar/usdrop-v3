import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import sql from '@/lib/db'

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

    const stores = await sql`
      SELECT id, user_id, shop_domain, access_token, is_active
      FROM shopify_stores
      WHERE id = ${storeId} AND user_id = ${user.id}
      LIMIT 1
    `

    if (stores.length === 0) {
      return NextResponse.json({ error: 'Store not found or access denied' }, { status: 404 })
    }

    const store = stores[0]

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

    await sql`
      UPDATE shopify_stores
      SET last_synced_at = NOW(), updated_at = NOW()
      WHERE id = ${storeId} AND user_id = ${user.id}
    `

    const updated = await sql`
      SELECT s.*, p.email as user_email, p.full_name as user_full_name
      FROM shopify_stores s
      LEFT JOIN profiles p ON s.user_id = p.id
      WHERE s.id = ${storeId}
      LIMIT 1
    `

    const row = updated[0]
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
