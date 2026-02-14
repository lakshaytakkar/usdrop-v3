import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import sql from '@/lib/db'

function mapStoreFromDB(row: any) {
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
    user: row.user_email ? {
      id: row.user_id,
      email: row.user_email,
      full_name: row.user_full_name,
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

    const data = await sql`
      SELECT s.*, p.email as user_email, p.full_name as user_full_name
      FROM shopify_stores s
      LEFT JOIN profiles p ON s.user_id = p.id
      WHERE s.id = ${storeId} AND s.user_id = ${user.id}
      LIMIT 1
    `

    if (data.length === 0) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    return NextResponse.json(mapStoreFromDB(data[0]))
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

    const existing = await sql`
      SELECT id FROM shopify_stores WHERE id = ${storeId} AND user_id = ${user.id}
    `
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Store not found or access denied' }, { status: 404 })
    }

    const storeName = body.name !== undefined ? body.name : null
    const shopDomain = body.url !== undefined ? body.url : null
    const isActive = body.status !== undefined ? (body.status === 'connected') : null
    const planVal = body.plan !== undefined ? body.plan : null

    const result = await sql`
      UPDATE shopify_stores SET
        updated_at = NOW(),
        store_name = COALESCE(${storeName}, store_name),
        shop_domain = COALESCE(${shopDomain}, shop_domain),
        is_active = COALESCE(${isActive}, is_active),
        plan = COALESCE(${planVal}, plan)
      WHERE id = ${storeId} AND user_id = ${user.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    return NextResponse.json(mapStoreFromDB(result[0]))
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

    const existing = await sql`
      SELECT id FROM shopify_stores WHERE id = ${storeId} AND user_id = ${user.id}
    `
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Store not found or access denied' }, { status: 404 })
    }

    await sql`
      DELETE FROM shopify_stores WHERE id = ${storeId} AND user_id = ${user.id}
    `

    return NextResponse.json({ success: true, message: 'Store deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/shopify-stores/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
