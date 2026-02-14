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

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const offset = (page - 1) * pageSize

    let data
    if (status === 'connected') {
      if (search) {
        data = await sql`
          SELECT s.*, p.email as user_email, p.full_name as user_full_name
          FROM shopify_stores s
          LEFT JOIN profiles p ON s.user_id = p.id
          WHERE s.user_id = ${user.id} AND s.is_active = true
            AND (s.store_name ILIKE ${'%' + search + '%'} OR s.shop_domain ILIKE ${'%' + search + '%'})
          ORDER BY s.created_at DESC
          LIMIT ${pageSize} OFFSET ${offset}
        `
      } else {
        data = await sql`
          SELECT s.*, p.email as user_email, p.full_name as user_full_name
          FROM shopify_stores s
          LEFT JOIN profiles p ON s.user_id = p.id
          WHERE s.user_id = ${user.id} AND s.is_active = true
          ORDER BY s.created_at DESC
          LIMIT ${pageSize} OFFSET ${offset}
        `
      }
    } else if (status === 'disconnected') {
      if (search) {
        data = await sql`
          SELECT s.*, p.email as user_email, p.full_name as user_full_name
          FROM shopify_stores s
          LEFT JOIN profiles p ON s.user_id = p.id
          WHERE s.user_id = ${user.id} AND s.is_active = false
            AND (s.store_name ILIKE ${'%' + search + '%'} OR s.shop_domain ILIKE ${'%' + search + '%'})
          ORDER BY s.created_at DESC
          LIMIT ${pageSize} OFFSET ${offset}
        `
      } else {
        data = await sql`
          SELECT s.*, p.email as user_email, p.full_name as user_full_name
          FROM shopify_stores s
          LEFT JOIN profiles p ON s.user_id = p.id
          WHERE s.user_id = ${user.id} AND s.is_active = false
          ORDER BY s.created_at DESC
          LIMIT ${pageSize} OFFSET ${offset}
        `
      }
    } else {
      if (search) {
        data = await sql`
          SELECT s.*, p.email as user_email, p.full_name as user_full_name
          FROM shopify_stores s
          LEFT JOIN profiles p ON s.user_id = p.id
          WHERE s.user_id = ${user.id}
            AND (s.store_name ILIKE ${'%' + search + '%'} OR s.shop_domain ILIKE ${'%' + search + '%'})
          ORDER BY s.created_at DESC
          LIMIT ${pageSize} OFFSET ${offset}
        `
      } else {
        data = await sql`
          SELECT s.*, p.email as user_email, p.full_name as user_full_name
          FROM shopify_stores s
          LEFT JOIN profiles p ON s.user_id = p.id
          WHERE s.user_id = ${user.id}
          ORDER BY s.created_at DESC
          LIMIT ${pageSize} OFFSET ${offset}
        `
      }
    }

    const stores = data.map(mapStoreFromDB)

    let countResult
    if (status === 'connected') {
      if (search) {
        countResult = await sql`
          SELECT COUNT(*) as count FROM shopify_stores
          WHERE user_id = ${user.id} AND is_active = true
            AND (store_name ILIKE ${'%' + search + '%'} OR shop_domain ILIKE ${'%' + search + '%'})
        `
      } else {
        countResult = await sql`
          SELECT COUNT(*) as count FROM shopify_stores
          WHERE user_id = ${user.id} AND is_active = true
        `
      }
    } else if (status === 'disconnected') {
      if (search) {
        countResult = await sql`
          SELECT COUNT(*) as count FROM shopify_stores
          WHERE user_id = ${user.id} AND is_active = false
            AND (store_name ILIKE ${'%' + search + '%'} OR shop_domain ILIKE ${'%' + search + '%'})
        `
      } else {
        countResult = await sql`
          SELECT COUNT(*) as count FROM shopify_stores
          WHERE user_id = ${user.id} AND is_active = false
        `
      }
    } else {
      if (search) {
        countResult = await sql`
          SELECT COUNT(*) as count FROM shopify_stores
          WHERE user_id = ${user.id}
            AND (store_name ILIKE ${'%' + search + '%'} OR shop_domain ILIKE ${'%' + search + '%'})
        `
      } else {
        countResult = await sql`
          SELECT COUNT(*) as count FROM shopify_stores WHERE user_id = ${user.id}
        `
      }
    }
    const totalCount = parseInt(countResult[0]?.count || '0')

    return NextResponse.json({
      stores,
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize)
    })
  } catch (error) {
    console.error('Error in GET /api/shopify-stores:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { shop } = body

    if (!shop) {
      return NextResponse.json({ error: 'Shop parameter is required' }, { status: 400 })
    }

    const { generateOAuthState, buildShopifyOAuthUrl } = await import('@/lib/utils/shopify-oauth')
    
    const state = generateOAuthState()
    const oauthUrl = buildShopifyOAuthUrl(shop, state)
    
    return NextResponse.json({ 
      oauth_url: oauthUrl,
      state: state
    })
  } catch (error) {
    console.error('Error in POST /api/shopify-stores:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
