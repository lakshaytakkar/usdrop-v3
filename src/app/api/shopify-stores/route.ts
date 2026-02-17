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

    let query = supabaseAdmin
      .from('shopify_stores')
      .select('*, profiles(email, full_name)', { count: 'exact' })
      .eq('user_id', user.id)

    if (status === 'connected') {
      query = query.eq('is_active', true)
    } else if (status === 'disconnected') {
      query = query.eq('is_active', false)
    }

    if (search) {
      query = query.or(`store_name.ilike.%${search}%,shop_domain.ilike.%${search}%`)
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching shopify stores:', error)
      return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
    }

    const stores = (data || []).map(mapStoreFromDB)
    const totalCount = count || 0

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
