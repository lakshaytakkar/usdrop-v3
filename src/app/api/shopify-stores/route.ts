import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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

// GET /api/shopify-stores - Get stores for authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const supabaseClient = await createClient()

    let query = supabaseClient
      .from('shopify_stores')
      .select(`
        *,
        profiles (
          id,
          email,
          full_name
        )
      `)
      .eq('user_id', user.id)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,url.ilike.%${search}%`)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching shopify stores:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        stores: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0
      })
    }

    // Transform to match ShopifyStore interface using helper
    const stores = data.map((store) => mapShopifyStoreFromDB(store))

    // Get total count for pagination
    let countQuery = supabaseClient
      .from('shopify_stores')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (status) {
      countQuery = countQuery.eq('status', status)
    }
    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,url.ilike.%${search}%`)
    }

    const { count: totalCount } = await countQuery

    return NextResponse.json({
      stores,
      total: totalCount || 0,
      page,
      pageSize,
      totalPages: Math.ceil((totalCount || 0) / pageSize)
    })
  } catch (error) {
    console.error('Error in GET /api/shopify-stores:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/shopify-stores - Initiate OAuth flow
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { shop } = body

    if (!shop) {
      return NextResponse.json({ error: 'Shop parameter is required' }, { status: 400 })
    }

    // Import OAuth helpers
    const { generateOAuthState, buildShopifyOAuthUrl } = await import('@/lib/utils/shopify-oauth')
    
    // Generate state token
    const state = generateOAuthState()
    
    // TODO: Store state in session/cache for validation in callback
    // For now, we'll proceed without state storage in development
    
    // Build OAuth URL
    const oauthUrl = buildShopifyOAuthUrl(shop, state)
    
    // Return redirect URL
    return NextResponse.json({ 
      oauth_url: oauthUrl,
      state: state // In production, don't return state to client
    })
  } catch (error) {
    console.error('Error in POST /api/shopify-stores:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

